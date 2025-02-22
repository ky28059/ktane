'use client'

import { useEffect, useState } from 'react';

// Components
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import FileBar from '@/app/game/[id]/FileBar';

// Utils
import { BinaryOp, event_to_keystring, parse_config, run_keypress_rules, StateValue } from '@/utils/rules';
import { BgColor, get_current_file, type_chars, type EditorState } from '@/utils/editor_state';


export default function CodeEditor() {
    const [editorState, setEditorState] = useState<EditorState | null>(parse_config(
        {'code': "def main():\n    print('hello world')", 'modes': ['square', 'circle', 'rhombus', 'pyramid', 'circle', 'square'], 'initial_mode': 'pyramid', 'initial_color': BgColor.Purple, 'serial_number': 'ZmRLcY08Bm6X', 'total_time': 110, 'rules': [{'trigger': {'type': 'keypress', 'keypress': '-KeyA'}, 'test': {'type': 'bin_op', 'op_type': BinaryOp.Equals, 'lhs': {'type': 'state_value', 'val': StateValue.Background}, 'rhs': {'type': 'literal', 'val': 'purple'}}, 'action': {'type': 'type_chars', 'characters': 'lmao u suck'}}]}
    ));

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            e.preventDefault();

            setEditorState((editorState) => {
                if (!editorState) return null;

                const keyString = event_to_keystring(e);
                const newState = structuredClone(editorState);

                if (!run_keypress_rules(newState, keyString)) {
                    const buffer = get_current_file(newState).buffer;
                    if (e.key.length === 1) {
                        type_chars(buffer, e.key);
                    }
                }
                const buffer = get_current_file(newState).buffer;

                return newState;
            });
        }

        window.addEventListener('keypress', handler);
        return () => window.removeEventListener('keypress', handler);
    }, []);

    if (!editorState) return ( // TODO
        <div>loading...</div>
    );

    const file = get_current_file(editorState);

    return (
        <div className="flex-grow flex flex-col">
            <FileBar
                files={editorState.open_files.map((f) => f.filename)}
                selected={file.filename}
            />

            <div className="bg-editor relative flex-grow overflow-y-auto">
                {/* Hack: invisible textarea to capture user input */}
                {/*
                <textarea
                    className="absolute p-[1em] inset-0 text-[13px] font-[Menlo,_Monaco,_Consolas,_'Andale_Mono',_'Ubuntu_Mono',_'Courier_New',_monospace] ml-[29.25px] outline-none text-transparent caret-white resize-none"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                />
                */}

                <SyntaxHighlighter language="python">
                    {file.buffer.lines.join('\n')}
                </SyntaxHighlighter>
            </div>

            <div className="flex gap-8 bg-filebar text-white/40 py-4 px-5 font-mono text-sm border-t border-white/10">
                <div>
                    <p>S: {editorState.serial_number}</p>
                    <p>KNU Scame</p>
                </div>
                <div className="text-right ml-auto">
                    <p>M {file.buffer.mode} | B {file.buffer.bg_color}</p>
                    <p>C {file.buffer.cursor.x},{file.buffer.cursor.y}</p>
                </div>
                <div>
                    All
                </div>
            </div>
        </div>
    )
}
