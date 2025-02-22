'use client'

import { useEffect, useRef, useState } from 'react';
import { DateTime, Duration } from 'luxon';

// Components
import ManualPlayerInterface from '@/app/game/[id]/ManualPlayerInterface';
import CodePlayerInterface from '@/app/game/[id]/CodePlayerInterface';

// Utils
import { BinaryOp, GameConfig, StateValue } from '@/utils/rules';


type PlayerInterfaceProps = {
    id: string
}
export default function PlayerInterface(props: PlayerInterfaceProps) {
    const [config, setConfig] = useState<GameConfig | null>(null);
    const [role, setRole] = useState<'manual' | 'coder'>('manual');

    const endDate = useRef<DateTime>(DateTime.now());

    useEffect(() => {
        const ws = new WebSocket(`${process.env.WS_BASE!}/${props.id}`);

        ws.addEventListener('message', (m: MessageEvent<string>) => {
            console.log(m.data, typeof m.data);
            const res = JSON.parse(m.data) as BackendMessage;

            switch (res.type) {
                case 'start':
                    endDate.current = DateTime.fromMillis(res.end_time)
                    break;
                case 'config':
                    return setConfig(res.data);
                case 'code_data':
                    return // ...
                case 'role':
                    return setRole(res.data);
            }
        });

        return () => ws.close();
    }, []);

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
        <div className="bg-editor flex flex-col gap-2 items-center justify-center h-screen text-white">
            <audio
                src="/audio/jazz.mp3"
                ref={jazzRef}
                autoPlay
                loop
            />

            <img
                src="/assets/logo.png"
                className="max-w-2xl"
            />
            <p className="max-w-3xl text-pretty text-center">
                This game hasn't started yet! Invite someone else to play at{' '}
                <a href={joinHref} className="text-white/50 underline">{joinHref}</a>, or press any key to relax
                in the meantime.
            </p>
        </div>
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
                src="/audio/alarm.mp3"
                ref={alarmRef}
            />

            {role === 'manual' ? (
                <ManualPlayerInterface config={config} />
            ) : (
                <CodePlayerInterface
                    config={config}
                    timeLeft={timeLeft}
                />
            )}
        </div>
    )
}

type BackendMessage = ConfigMessage | CodeDataMessage | RoleMessage | StartMessage

type ConfigMessage = {
    type: 'config',
    data: GameConfig
}

type CodeDataMessage = {
    type: 'code_data',
    data: {} // TODO
}

type RoleMessage = {
    type: 'role',
    data: 'manual' | 'coder'
}

type StartMessage = {
    type: 'start',
    end_time: number // epoch ms
}
