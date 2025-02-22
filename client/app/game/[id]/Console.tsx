'use client';

import { useEffect, useRef, useState } from 'react';

export default function Console() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => i + 1);
        }, 400);

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
    '\nMessage from admin@ktane on pts/220 at 16:04 ...',
    'Hey, it\'s your manager here... when are you finishing that last test case?',
    'We have an all hands in 3 minutes...',
    '',
    'dev@ktane:~$'
]

// `Unable to find image 'mongo:latest' locally
// latest: Pulling from library/mongo
// 5a7813e071bf: Downloading [=========================================>         ]  24.88MB/29.75MB
// 07b085c89153: Download complete
// 8170e4b21000: Downloading [===============>                                   ]  458.8kB/1.508MB
// 1aa9099a841a: Downloading [==>                                                ]  63.76kB/1.13MB
// bce7aaa046ee: Waiting
// a53a70bd8c23: Waiting
// 9c76b9a0da25: Waiting
// 990f24c1b076: Waiting`
