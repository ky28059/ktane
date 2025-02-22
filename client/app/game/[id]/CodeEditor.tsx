'use client'

import { useEffect, useState } from 'react';

// Components
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import FileBar from '@/app/game/[id]/FileBar';

// Utils
import { event_to_keystring, GameConfig, parse_config, run_keypress_rules } from '@/utils/rules';
import { get_current_file, type_chars } from '@/utils/editor_state';


type CodeEditorProps = {
    config: GameConfig
}
export default function CodeEditor(props: CodeEditorProps) {
    const [editorState, setEditorState] = useState(parse_config(props.config));

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            e.preventDefault();
            console.log(e.key)

            setEditorState((editorState) => {
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

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const file = get_current_file(editorState);

    const code = file.buffer.lines
        .map((s, i) => i === file.buffer.cursor.y ? (s.slice(0, file.buffer.cursor.x) + '█' + s.slice(file.buffer.cursor.x)) : s)
        .join('\n')

    return (
        <div className="flex-grow flex flex-col overflow-x-auto min-w-0">
            <FileBar
                files={editorState.open_files.map((f) => f.filename)}
                selected={file.filename}
            />

            <div className="bg-editor relative flex-grow overflow-y-auto flex">
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
                    {code}
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
