'use client'

import { useState } from 'react';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';


export default function CodeEditor() {
    const [code, setCode] = useState(ex);

    return (
        <div className="flex-grow bg-editor relative">
            {/* Hack: invisible textarea to capture user input */}
            <textarea
                className="absolute p-[1em] inset-0 text-[13px] font-[Menlo,_Monaco,_Consolas,_'Andale_Mono',_'Ubuntu_Mono',_'Courier_New',_monospace] text-white my-[0.5em] ml-[29.25px] outline-none text-transparent caret-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
            />

            <SyntaxHighlighter language="javascript">
                {code}
            </SyntaxHighlighter>
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
