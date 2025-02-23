'use client';

import { useEffect, useRef, useState } from 'react';

export default function Console() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let id = setTimeout(() => {
            setIndex((i) => i + 1);
            setTimeout(() => {
                id = setInterval(() => setIndex((i) => i + 1), 1000 * 30);
            }, 1000 * 60);
        }, 1000);

        return () => clearInterval(id);
    }, [])

    return (
        <div className="flex-none bg-black text-white w-[40vw] border-l border-white/25 p-4">
            <pre className="whitespace-pre-wrap text-sm">
                {prog.slice(0, index).join('\n')}
            </pre>
        </div>
    )
}

const prog = [
    `Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.153.1-microsoft-standard-WSL2 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro


This message is shown once a day. To disable it please create the
/home/dev/.hushlogin file.
dev@ktane:~$`,
    '\nMessage from admin@ktane on pts/0 at 16:04 ...\nHey, it\'s your manager here... when are you finishing that last test case?\nWe have an all hands in 3 minutes...\n\ndev@ktane:~$',
    '\nMessage from nathanielbrooker@ktane on pts/220 at 16:04 ...\nHey man, just checking in. You got this project on lock yet?\n\ndev@ktane:~$',
    '\nMessage from jacobw@ktane on pts/2 at 16:04 ...\nWe’ll consider discussing a pay adjustment if you can deliver this project on time. Let’s aim to meet the deadline.\n\ndev@ktane:~$',
    '\nMessage from michelle@ktane on pts/26 at 16:04 ...\nYou free tonight? ;)\n\ndev@ktane:~$',
    '\nMessage from bob@ktane on pts/26 at 16:04 ...\nHey check out my new website! http://localhost:3000/index.html\n\ndev@ktane:~$',
    '\nMessage from bob@ktane on pts/26 at 16:04 ...\nWrong chat sorry.\n\ndev@ktane:~$'
]
