'use client'

import { useEffect, useRef, useState } from 'react';
import { Duration } from 'luxon';

// Components
import CodeEditor from '@/app/game/[id]/CodeEditor';
import Console from '@/app/game/[id]/Console';
import SlackNotif from '@/app/game/[id]/SlackNotif';

// Utils
import type { GameConfig } from '@/utils/rules';


type CodePlayerInterfaceProps = {
    config: GameConfig,
    timeLeft: Duration,
    submitCode: (c: string) => void
}
export default function CodePlayerInterface(props: CodePlayerInterfaceProps) {
    const [showNotif, setShowNotif] = useState(false);
    const opened = useRef(false);

    useEffect(() => {
        if (opened.current) return;
        if (props.timeLeft > Duration.fromMillis(1000 * 60 * 2)) return;

        setShowNotif(true);
        opened.current = true;
    }, [props.timeLeft]);

    return (
        <div className="flex h-screen [color-scheme:_dark]">
            <CodeEditor {...props} />
            <Console />

            <div className="bg-editor text-white fixed bottom-6 right-6 w-72 flex flex-col px-4 py-3 text-sm rounded select-none hover:bg-white/15 transition duration-150 border border-white/10">
                <span className="text-white/50">Your code will be deployed to prod in:</span>
                <span className="text-4xl font-mono">
                    {props.timeLeft.toFormat('m:ss')}
                    <span className="text-white/60 text-3xl">
                        .{(props.timeLeft.milliseconds % 1000).toString()[0]}
                    </span>
                </span>
            </div>

            {showNotif && <SlackNotif setOpen={setShowNotif} />}
        </div>
    )
}
