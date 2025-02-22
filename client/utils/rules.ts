import { EditorState, BgColor, Mode } from "./editor_state";

export type GameConfig = {
    initial_state: EditorState,
    rules: Rule[],
}

export type Rule = {
    // if trigger matches event eval test expr, if true run action
    trigger: Trigger,
    test: Expr,
    action: Action,
}

export type KeypressInfo = {
    ctrl: boolean,
    alt: boolean,
    keycode: number,
}

// triggers cause conditions they are associated with to be evaluated when a given event occurs
export type KeypressTrigger = {
    type: 'keypress'
    keypress: KeypressInfo,
}

// one event is randomly picked every so often
export type EventTrigger = {
    type: 'event_trigger',
}

export type Trigger = KeypressTrigger | EventTrigger

// values returned by expressions
export type Value = number | string | boolean

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

export type Expr = StateValueExpr | UnaryOpExpr | BinOpExpr

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
