'use client'

import { useEffect, useState } from 'react';

// Components
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import FileBar from '@/app/game/[id]/FileBar';
import { BinaryOp, event_to_keystring, parse_config, run_keypress_rules, StateValue } from '@/utils/rules';
import { BgColor, get_current_file, type_chars, type EditorState } from '@/utils/editor_state';


export default function CodeEditor() {
    const [code, setCode] = useState(ex);

    const files = ['test.py', 'two.py', 'runner.py'];
    const [selected, setSelected] = useState(files[0]);

    const [editorState, setEditorState] = useState<EditorState | null>(parse_config(
        {'code': "def main():\n    print('hello world')", 'modes': ['square', 'circle', 'rhombus', 'pyramid', 'circle', 'square'], 'initial_mode': 'pyramid', 'initial_color': BgColor.Purple, 'serial_number': 'ZmRLcY08Bm6X', 'total_time': 110, 'rules': [{'trigger': {'type': 'keypress', 'keypress': '-KeyA'}, 'test': {'type': 'bin_op', 'op_type': BinaryOp.Equals, 'lhs': {'type': 'state_value', 'val': StateValue.Background}, 'rhs': {'type': 'literal', 'val': 'purple'}}, 'action': {'type': 'type_chars', 'characters': 'lmao u suck'}}]}
    ));

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            e.preventDefault();

            setEditorState((editorState) => {
                if (!editorState) {
                    return null;
                }

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

    return (
        <div className="flex-grow flex flex-col">
            <FileBar
                files={files}
                selected={selected}
                setSelected={setSelected}
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
                    {editorState ? get_current_file(editorState).buffer.lines.join('\n') : ''}
                </SyntaxHighlighter>
            </div>

            <div className="flex gap-8 bg-filebar text-white/40 py-4 px-5 font-mono text-sm border-t border-white/10">
                <div>
                    <p>S: 27ha20vla</p>
                    <p>KNU Scame</p>
                </div>
                <div className="text-right ml-auto">
                    <p>M cycloid | B purple</p>
                    <p>C 0,1</p>
                </div>
                <div>
                    All
                </div>
            </div>
        </div>
    )
}

const ex = `def serialize_document(doc):
    """Recursively convert MongoDB documents to JSON-serializable format."""
    if isinstance(doc, dict):
        return {k: serialize_document(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [serialize_document(v) for v in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    return doc
`
