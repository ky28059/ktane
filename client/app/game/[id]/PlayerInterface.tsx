'use client'

import { useEffect, useRef, useState } from 'react';
import { DateTime, Duration } from 'luxon';

// Components
import ManualPlayerInterface from '@/app/game/[id]/ManualPlayerInterface';
import CodePlayerInterface from '@/app/game/[id]/CodePlayerInterface';

// Utils
import { BinaryOp, GameConfig, StateValue } from '@/utils/rules';
import { BgColor } from '@/utils/editor_state';


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
            <button onClick={() => setConfig(ex)}>secret dev button</button>
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

const ex: GameConfig = {
    'code': "def main():\n    print('hello world')",
    'modes': ['square', 'circle', 'rhombus', 'pyramid', 'four leaf clover', 'canada'],
    'initial_mode': 'pyramid',
    'initial_color': BgColor.Purple,
    'serial_number': 'ZmRLcY08Bm6X',
    'total_time': 110,
    'rules': [
        {
            'trigger': {'type': 'keypress', 'keypress': '-KeyA'},
            'test': {'type': 'bin_op', 'op_type': BinaryOp.Equals, 'lhs': {'type': 'state_value', 'val': StateValue.Background}, 'rhs': {'type': 'literal', 'val': 'purple'}},
            'action': {'type': 'type_chars', 'characters': 'lmao u suck'}
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Enter'},
            'action': {'type': 'type_chars', 'characters': '\n'},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Delete'},
            'action': {'type': 'delete'},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Backspace'},
            'action': {'type': 'backspace'},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-ArrowUp'},
            'action': {'type': 'move_cursor', 'x_offset': 0, 'y_offset': -1},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-ArrowDown'},
            'action': {'type': 'move_cursor', 'x_offset': 0, 'y_offset': 1},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-ArrowLeft'},
            'action': {'type': 'move_cursor', 'x_offset': -1, 'y_offset': 0},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-ArrowRight'},
            'action': {'type': 'move_cursor', 'x_offset': 1, 'y_offset': 0},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Tab'},
            'action': {'type': 'type_chars', 'characters': '    '},
        },
    ]
}
