'use client'

import { useState } from 'react';

// Components
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import FileBar from '@/app/game/[id]/FileBar';


export default function CodeEditor() {
    const [code, setCode] = useState(ex);

    const files = ['a.txt', 'b.js', 'c.hs'];
    const [selected, setSelected] = useState(files[0]);

    return (
        <div className="flex-grow flex flex-col">
            <FileBar
                files={files}
                selected={selected}
                setSelected={setSelected}
            />

            <div className="bg-editor relative h-full">
                {/* Hack: invisible textarea to capture user input */}
                <textarea
                    className="absolute p-[1em] inset-0 text-[13px] font-[Menlo,_Monaco,_Consolas,_'Andale_Mono',_'Ubuntu_Mono',_'Courier_New',_monospace] ml-[29.25px] outline-none text-transparent caret-white"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                />

                <SyntaxHighlighter language="javascript">
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

const ex = `import SyntaxHighlighter from '@/components/SyntaxHighlighter';

export default function CodeEditor() {
    return (
        <div className="flex-grow bg-editor">
            <SyntaxHighlighter language="js">
                function hii
            </SyntaxHighlighter>
        </div>
    )
}`
