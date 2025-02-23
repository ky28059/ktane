import { Action, BinaryOp, Expr, RuleAndTrigger, StateValue, UnaryOp } from '@/utils/rules';


export default function KeybindDocumentation(props: RuleAndTrigger) {
    if (props.trigger.type !== 'keypress') return;

    return (
        <div className="flex gap-8 mb-10">
            <div className="w-36">
                <code className="text-xl bg-black/5 rounded px-2 py-1 h-max">
                    {props.trigger.keypress}
                </code>
            </div>
            <div className="text-sm">
                {props.test && (
                    <>
                        <p className="font-bold">Active if:</p>
                        <p className="bg-gray-200 px-4 py-2 rounded mb-3">
                            {exprToString(props.test)}
                        </p>
                    </>
                )}
                {/*
                <table className="w-full border mb-3">
                    <tbody>
                    <tr>
                        <td className="px-2 py-1 bg-gray-200">Current mode:</td>
                        <td className="px-2 py-1">Circle</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-1 bg-gray-200">Background color:</td>
                        <td className="px-2 py-1">Purple</td>
                    </tr>
                    </tbody>
                </table>
                */}

                <p>
                    <strong>Action:</strong>{' '}
                    <span className="whitespace-pre-wrap">
                        {actionToString(props.action)}
                    </span>
                </p>
            </div>
        </div>
    )
}

function actionToString(a: Action): string {
    switch (a.type) {
        case 'die': return 'You die :(.';
        case 'submit': return 'Immediately deploys your code to prod.';
        case 'change_bg': return `Changes the background color to \`${a.color}\`.`;
        case 'move_cursor': return `Moves the cursor by \`(${a.x_offset}, ${a.y_offset})\`.`
        case 'change_mode': return `Changes the current mode to \`${a.mode}\`.`;
        case 'type_chars': return `Types the character(s) \`${a.characters.replaceAll('\n', '[newline]').replaceAll('\t', '[tab]')}\`.`;
        case 'delete': return 'Deletes the character at the cursor.';
        case 'backspace': return 'Deletes the character to the left of the cursor.';
        case 'do_nothing': return 'Does nothing.';
        case 'set_fallback': if (a.type_char) {
            return 'Allows non mapped characters to be typed.';
        } else {
            return 'Forbids non mapped characters from being typed.';
        }
        case 'set_filter': if (a.filter_name) {
            return `Sets the current filter to ${a.filter_name}.`;
        } else {
            return 'Clears the current filter.';
        }
        case 'action_list': return a.actions.map(actionToString).join(', ');
    }
}

function exprToString(a: Expr): string {
    switch (a.type) {
        case "literal": return a.val.toString();
        case "unary_op": switch (a.op_type) {
            case UnaryOp.Negate:
            case UnaryOp.Not:
                return `¬${exprToString(a.val)}`
        }
        case "bin_op": switch (a.op_type) {
            case BinaryOp.Div: return `(${exprToString(a.lhs)} / ${exprToString(a.rhs)})`;
            case BinaryOp.Add: return `(${exprToString(a.lhs)} + ${exprToString(a.rhs)})`;
            case BinaryOp.Mod: return `(${exprToString(a.lhs)} % ${exprToString(a.rhs)})`;
            case BinaryOp.Mul: return `(${exprToString(a.lhs)} * ${exprToString(a.rhs)})`;
            case BinaryOp.Sub: return `(${exprToString(a.lhs)} - ${exprToString(a.rhs)})`;
            case BinaryOp.Equals: return `${exprToString(a.lhs)} = ${exprToString(a.rhs)}`;
            case BinaryOp.NotEquals: return `${exprToString(a.lhs)} != ${exprToString(a.rhs)}`;
            case BinaryOp.Or: return `${exprToString(a.lhs)} OR ${exprToString(a.rhs)}`
            case BinaryOp.And: return `${exprToString(a.lhs)} AND ${exprToString(a.rhs)}`
        }
        case "state_value": switch (a.val) {
            case StateValue.Background: return 'Background color';
            case StateValue.ColumnNum: return 'Column number';
            case StateValue.LineNum: return 'Line number';
            case StateValue.Mode: return 'Current mode';
            case StateValue.Timer: return 'Current time';
            case StateValue.SerialNumber: return 'Serial number';
            case StateValue.Filename: return 'File name';
        }
    }
}
