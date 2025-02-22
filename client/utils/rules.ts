import { EditorState, BgColor, Mode, BufferState, get_current_file, type_chars, constrain_cursor, delete_char } from "./editor_state";

// game config returned from server
export type GameConfig = {
    code: string,
    modes: Mode[],
    initial_mode: Mode,
    initial_color: BgColor,
    serial_number: string,
    total_time: number,
    rules: RuleAndTrigger[],
}

export function parse_config(config: GameConfig): EditorState {
    return {
        open_files: [
            {
                filename: "main.py",
                buffer: {
                    lines: config.code.split('\n'),
                    cursor: {
                        x: 0,
                        y: 0,
                    },
                    scroll_start: 0,
                    bg_color: config.initial_color,
                    mode: config.initial_mode,
                }
            },
        ],
        buffer_index: 0,
        serial_number: config.serial_number,
        remaining_time: config.total_time,
        rulebook: rulebook_from_rule_list(config.rules),
    };
}

export type Rule = {
    // if test returns true, perform action
    test?: Expr,
    action: Action,
}

function eval_rule(state: RuleEvalContext, rule: Rule) {
    if (!rule.test || eval_expr(state, rule.test) === true) {
        do_action(state, rule.action);
    }
}

// serialized rule received from server
export type RuleAndTrigger = Rule & {
    // if trigger matches, try to run rule
    trigger: Trigger,
}

// when an even occurs, we look in the rulebook to determine what rules to run for given event
export type Rulebook = {
    // string represents key and ctrl and alt modifier keys
    keypress_rules: Record<string, Rule[]>,
    event_rules: Rule[],
}

function rulebook_from_rule_list(rules: RuleAndTrigger[]): Rulebook {
    const rulebook: Rulebook = {
        keypress_rules: {},
        event_rules: [],
    };

    for (const rule of rules) {
        switch (rule.trigger.type) {
            case 'keypress':
                if (rulebook.keypress_rules[rule.trigger.keypress]) {
                    rulebook.keypress_rules[rule.trigger.keypress].push(rule);
                } else {
                    rulebook.keypress_rules[rule.trigger.keypress] = [rule];
                }
                break;
            case 'event_trigger':
                rulebook.event_rules.push(rule);
                break;
        }
    }

    return rulebook;
}

export function run_keypress_rules(state: EditorState, keypress: string): boolean {
    const rule_eval_context = {
        editor_state: state,
        buffer: get_current_file(state).buffer,
    };

    state.rulebook.keypress_rules[keypress]?.forEach(rule => eval_rule(rule_eval_context, rule));

    return state.rulebook.keypress_rules[keypress] !== undefined
}

export function run_event_rule(state: EditorState) {
    const rule_eval_context = {
        editor_state: state,
        buffer: get_current_file(state).buffer,
    };

    const rule = state.rulebook.event_rules[Math.floor(Math.random() * state.rulebook.event_rules.length)];
    eval_rule(rule_eval_context, rule);
}

// triggers cause conditions they are associated with to be evaluated when a given event occurs
export type KeypressTrigger = {
    type: 'keypress'
    keypress: string,
}

// converts keyboard event to keystring
export function event_to_keystring(event: KeyboardEvent) {
    let out = "";
    if (event.ctrlKey) {
        out += "C";
    }

    if (event.shiftKey) {
        out += "S";
    }

    if (event.altKey) {
        out += "A";
    }

    return out + "-" + event.code;
}

// one event is randomly picked every so often
export type EventTrigger = {
    type: 'event_trigger',
}

export type Trigger = KeypressTrigger | EventTrigger

// values returned by expressions
export type Value = number | string | boolean

function value_num(input: Value): number {
    if (typeof(input) === 'number') {
        return input;
    } else {
        throw new Error();
    }
}

function value_string(input: Value): string {
    if (typeof(input) === 'string') {
        return input;
    } else {
        throw new Error();
    }
}

function value_bool(input: Value): boolean {
    if (typeof(input) === 'boolean') {
        return input;
    } else {
        throw new Error();
    }
}

// evaluation context for a rule
type RuleEvalContext = {
    editor_state: EditorState,
    // buffer associated with the trigger
    buffer?: BufferState,
}

function context_get_buffer(context: RuleEvalContext): BufferState {
    return context.buffer ?? get_current_file(context.editor_state).buffer;
}

export type LiteralExpr = {
    type: 'literal',
    val: Value,
}

// expression that retrieves a value from the state
export enum StateValue {
    Background = 'background',
    LineNum = 'line_num',
    ColumnNum = 'column_num',
    Mode = 'mode',
    Filename = 'filename',
    Timer = 'timer',
    SerialNumber = 'serial_number',
}

export type StateValueExpr = {
    type: 'state_value',
    val: StateValue,
}

function eval_state_value(context: RuleEvalContext, expr: StateValueExpr): Value {
    const buffer = context_get_buffer(context);

    switch (expr.val) {
        case StateValue.Background:
            return buffer.bg_color;
        case StateValue.LineNum:
            return buffer.cursor.y;
        case StateValue.ColumnNum:
            return buffer.cursor.x;
        case StateValue.Mode:
            return buffer.mode;
        case StateValue.Filename:
            return get_current_file(context.editor_state).filename;
        case StateValue.Timer:
            return context.editor_state.remaining_time;
        case StateValue.SerialNumber:
            return context.editor_state.serial_number;
    }
}

// unary operation
export enum UnaryOp {
    Not = 'not',
    Negate = 'negate',
}

export type UnaryOpExpr = {
    type: 'unary_op',
    op_type: UnaryOp,
    val: Expr,
}

function eval_un_op(context: RuleEvalContext, expr: UnaryOpExpr): Value {
    const val = eval_expr(context, expr.val);

    switch (expr.op_type) {
        case UnaryOp.Not:
            return !value_bool(val);
        case UnaryOp.Negate:
            return -value_num(val);
    }
}

// binary operation
export enum BinaryOp {
    And = 'and',
    Or = 'or',
    Equals = 'equals',
    NotEquals = 'not_equals',
    Add = 'add',
    Sub = 'sub',
    Mul = 'mul',
    Div = 'div',
    Mod = 'mod',
}

export type BinOpExpr = {
    type: 'bin_op',
    op_type: BinaryOp,
    lhs: Expr,
    rhs: Expr,
}

function eval_bin_op(context: RuleEvalContext, expr: BinOpExpr): Value {
    const lhs = eval_expr(context, expr.lhs);
    const rhs = eval_expr(context, expr.rhs);

    switch (expr.op_type) {
        case BinaryOp.And:
            return value_bool(lhs) && value_bool(rhs);
        case BinaryOp.Or:
            return value_bool(lhs) || value_bool(rhs);
        case BinaryOp.Equals:
            return lhs === rhs;
        case BinaryOp.NotEquals:
            return lhs !== rhs;
        case BinaryOp.Add:
            return value_num(lhs) + value_num(rhs);
        case BinaryOp.Sub:
            return value_num(lhs) - value_num(rhs);
        case BinaryOp.Mul:
            return value_num(lhs) * value_num(rhs);
        case BinaryOp.Div:
            return value_num(lhs) / value_num(rhs);
        case BinaryOp.Mod:
            return value_num(lhs) % value_num(rhs);
    }
}

export type Expr = LiteralExpr | StateValueExpr | UnaryOpExpr | BinOpExpr

function eval_expr(state: RuleEvalContext, expr: Expr): Value {
    switch (expr.type) {
        case 'literal':
            return expr.val;
        case 'state_value':
            return eval_state_value(state, expr);
        case 'unary_op':
            return eval_un_op(state, expr);
        case 'bin_op':
            return eval_bin_op(state, expr);
    }
}

// Actions
export type DieAction = {
    type: 'die',
    message: string,
}

export type TypeCharsAction = {
    type: 'type_chars',
    characters: string,
}

export type SubmitAction = {
    type: 'submit',
}

export type ChangeBackgroundAction = {
    type: 'change_bg',
    color: BgColor,
}

export type ChangeModeAction = {
    type: 'change_mode',
    mode: Mode,
}

export type MoveCursurAction = {
    type: 'move_cursor',
    x_offset: number,
    y_offset: number,
}

export type DeleteAction = {
    type: 'delete',
}

export type ActionList = {
    type: 'action_list',
    actions: Action[],
}

export type Action = DieAction | TypeCharsAction | SubmitAction | ChangeBackgroundAction | ChangeModeAction | MoveCursurAction | DeleteAction | ActionList

function do_action(state: RuleEvalContext, action: Action) {
    const buffer = context_get_buffer(state);

    switch (action.type) {
        case 'die':
            // TODO
            break;
        case 'type_chars':
            type_chars(buffer, action.characters);
            break;
        case 'submit':
            // TODO
            break;
        case 'change_bg':
            buffer.bg_color = action.color;
            break;
        case 'change_mode':
            buffer.mode = action.mode;
            break;
        case 'move_cursor':
            buffer.cursor.x += action.x_offset;
            buffer.cursor.y += action.y_offset;
            constrain_cursor(buffer);
            break;
        case 'delete':
            delete_char(buffer);
            break;
        case 'action_list':
            action.actions.forEach(action => do_action(state, action));
            break;
    }
}
