import { EditorState, BgColor, Mode, BufferState, get_current_file, type_chars } from "./editor_state";

export type GameConfig = {
    initial_state: EditorState,
    rules: Rule[],
}

export type Rule = {
    // if test returns true, perform action
    test: Expr,
    action: Action,
}

export function eval_rule(state: RuleEvalContext, rule: Rule) {
    if (eval_expr(state, rule.test) === true) {
        do_action(state, rule.action);
    }
}

// serialized rule received from server
export type RuleAndTrigger = {
    // if trigger matches, try to run rule
    trigger: Trigger,
    rule: Rule,
}

// when an even occurs, we look in the rulebook to determine what rules to run for given event
export type Rulebook = {
    // string represnets key and ctrl and alt modifier keys
    keypress_rules: Record<string, Rule[]>,
    event_rules: Rule[],
}

export function run_keypress_rules(state: EditorState, rulebook: Rulebook, keypress: string) {
    const rule_eval_context = {
        editor_state: state,
        buffer: get_current_file(state).buffer,
    };

    rulebook.keypress_rules[keypress]?.forEach(rule => eval_rule(rule_eval_context, rule));
}

export function run_evenr_rule(state: EditorState, rulebook: Rulebook) {
    const rule_eval_context = {
        editor_state: state,
        buffer: get_current_file(state).buffer,
    };

    const rule = rulebook.event_rules[Math.floor(Math.random() * rulebook.event_rules.length)];
    eval_rule(rule_eval_context, rule);
}

// triggers cause conditions they are associated with to be evaluated when a given event occurs
export type KeypressTrigger = {
    type: 'keypress'
    keypress: string,
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

// expression that retreives a value from the state
export enum StateValue {
    Background,
    LineNum,
    ColumnNum,
    Mode,
    Filename,
    Timer,
    SerialNumber,
}

export type StateValueExpr = {
    type: 'state_value',
    val: StateValue,
}

export function eval_state_value(context: RuleEvalContext, expr: StateValueExpr): Value {
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

export function eval_un_op(context: RuleEvalContext, expr: UnaryOpExpr): Value {
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

export function eval_bin_op(context: RuleEvalContext, expr: BinOpExpr): Value {
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

export type Expr = StateValueExpr | UnaryOpExpr | BinOpExpr

export function eval_expr(state: RuleEvalContext, expr: Expr): Value {
    switch (expr.type) {
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

export type Action = DieAction | TypeCharsAction | SubmitAction | ChangeBackgroundAction | ChangeModeAction

export function do_action(state: RuleEvalContext, action: Action) {
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
    }
}