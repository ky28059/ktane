import type { Action, RuleAndTrigger } from '@/utils/rules';


export default function KeybindDocumentation(props: RuleAndTrigger) {
    if (props.trigger.type !== 'keypress') return;

    return (
        <div className="flex gap-8 mb-6">
            <code className="text-xl bg-black/5 rounded px-2 py-1 h-max">
                {props.trigger.keypress}
            </code>
            <div className="text-sm">
                <p className="font-bold">Active if:</p>
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

                <p>
                    <strong>Action:</strong> {actionToString(props.action)}
                </p>
            </div>
        </div>
    )
}

function actionToString(a: Action) {
    switch (a.type) {
        case 'submit': return 'Immediately deploys your code to prod.';
        case 'change_bg': return `Changes the background color to \`${a.color}\`.`;
        case 'move_cursor': return `Moves the cursor by \`(${a.x_offset}, ${a.y_offset})\`.`
        case 'change_mode': return `Changes the current mode to \`${a.mode}\`.`;
        case 'type_chars': return `Types the character(s) \`${a.characters}\`.`;
    }
}
