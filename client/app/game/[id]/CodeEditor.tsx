'use client'

import { useEffect, useState } from 'react';

// Components
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import FileBar from '@/app/game/[id]/FileBar';


export default function CodeEditor() {
    const [code, setCode] = useState(ex);

    const files = ['test.py', 'two.py', 'runner.py'];
    const [selected, setSelected] = useState(files[0]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            e.preventDefault();

            // JACK: edit below this line!!!
            console.log(e.code, e.altKey, e.ctrlKey, e.shiftKey, e.metaKey);
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
                    {code}
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
