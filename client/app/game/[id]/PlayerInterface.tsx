'use client'

import { useEffect, useRef, useState } from 'react';
import { DateTime, Duration } from 'luxon';

// Components
import ManualPlayerInterface from '@/app/game/[id]/ManualPlayerInterface';
import CodePlayerInterface from '@/app/game/[id]/CodePlayerInterface';
import ResultsDisplay from '@/app/game/[id]/ResultsDisplay';

// Utils
import type { GameConfig } from '@/utils/rules';


type PlayerInterfaceProps = {
    id: string
}
export default function PlayerInterface(props: PlayerInterfaceProps) {
    const [config, setConfig] = useState<GameConfig | null>(null);
    const [role, setRole] = useState<'manual' | 'coder'>('manual');

    const [finished, setFinished] = useState(false);
    const [codeData, setCodeData] = useState<CodeData['nums'] | null>(null);
    const [results, setResults] = useState<TestData | null>(null);

    const endDate = useRef<DateTime>(DateTime.now());
    const ws = useRef<WebSocket>(null);

    useEffect(() => {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem('sessionId', sessionId);
        }

        ws.current = new WebSocket(`${process.env.WS_BASE!}/${props.id}`);
        ws.current.addEventListener('open', () => {
            ws.current!.send(JSON.stringify({ session_id: sessionId }));
        });

        ws.current.addEventListener('message', (m: MessageEvent<string>) => {
            console.log(m.data, typeof m.data);
            const res = JSON.parse(m.data) as BackendMessage;

            switch (res.type) {
                case 'start':
                    setConfig({ ...res.config, code: res.code_data.template });
                    setCodeData(res.code_data.nums);
                    endDate.current = DateTime.fromMillis(res.end_time);
                    break;
                case 'role':
                    setRole(res.data);
                    break;
                case 'result':
                    setFinished(true);
                    setResults(res.data);
                    break;
            }
        });

        return () => ws.current?.close();
    }, []);

    function submitCode(code: string) {
        ws.current?.send(JSON.stringify({ state: 'submitted', code }));
        setFinished(true);
    }

    // Hydration error workaround
    const [joinHref, setJoinHref] = useState('');
    useEffect(() => setJoinHref(new URL(`/game/${props.id}`, window.location.href).href), []);

    // Timer
    const [timeLeft, setTimeLeft] = useState(Duration.fromMillis(1000 * 60 * 5));
    const alarmPlayed = useRef(false);

    useEffect(() => {
        if (!config) return;

        const id = setInterval(() => {
            const newTime = endDate.current.diff(DateTime.now());

            if (newTime < Duration.fromMillis(1000 * 60) && !alarmPlayed.current) {
                void alarmRef.current?.play();
                alarmPlayed.current = true;
            }

            setTimeLeft(newTime);
        }, 100)

        return () => clearInterval(id);
    }, [config])

    // Sounds
    const jazzRef = useRef<HTMLAudioElement>(null);
    const alarmRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        window.addEventListener('keydown', () => jazzRef.current?.play())
    }, []);

    if (!config) return (
        <div className="relative bg-[url('/assets/office.jpg')] bg-cover bg-center flex flex-col gap-2 items-center justify-center h-screen text-white">
            <div className="absolute inset-0 backdrop-blur-sm" />

            <audio
                src="/audio/jazz.mp3"
                ref={jazzRef}
                autoPlay
                loop
            />

            <img
                src="/assets/logo.png"
                className="max-w-2xl relative"
            />
            <p className="max-w-3xl text-pretty text-center relative">
                This game hasn't started yet! Invite someone else to play at{' '}
                <a href={joinHref} className="text-white/50 underline bg-black/50 px-2 py-1.5 rounded hover:text-white/70 transition duration-100">{joinHref}</a>, or press any key to relax
                in the meantime.
            </p>
        </div>
    )

    if (finished) return (
        <ResultsDisplay
            codeData={codeData!}
            results={results}
        />
    )

    return (
        <div>
            <audio
                src="/audio/office.mp3"
                ref={(e) => void e?.play()}
                autoPlay
                loop
            />
            <audio
                src="/audio/alarm-radar.mp3"
                ref={alarmRef}
            />

            {role === 'manual' ? (
                <ManualPlayerInterface config={config} />
            ) : (
                <CodePlayerInterface
                    config={config}
                    timeLeft={timeLeft}
                    endDate={endDate.current}
                    submitCode={submitCode}
                />
            )}
        </div>
    )
}

type BackendMessage = RoleMessage | StartMessage | ResultMessage

type RoleMessage = {
    type: 'role',
    data: 'manual' | 'coder'
}

type StartMessage = {
    type: 'start',
    end_time: number, // epoch ms
    config: GameConfig,
    code_data: CodeData
}

type ResultMessage = {
    type: 'result',
    data: TestData
}

export type TestData = {
    all_tests_failed: boolean,
    tests: { [key: string]: boolean }
}

export type CodeData = {
    nums: { [key: string]: [difficulty: 'easy' | 'medium' | 'hard', number, fn: string] },
    template: string
}
