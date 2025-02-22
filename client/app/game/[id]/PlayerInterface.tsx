'use client'

import { useEffect, useState } from 'react';

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
    const [config, setConfig] = useState<GameConfig | null>({
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
    });

    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_BASE!);

        ws.addEventListener('message', (m: MessageEvent<BackendMessage>) => {
            switch (m.data.type) {
                case 'config': return setConfig(m.data.data);
                case 'code_data': return // ...
            }
        });
    }, []);

    const joinHref = new URL(`/game/${props.id}`, window.location.href).href;

    if (!config) return ( // TODO
        <div className="bg-editor flex flex-col gap-2 items-center justify-center h-screen text-white">
            {/* TODO: logo */}
            <img
                src="/assets/logo.png"
                className="max-w-2xl"
            />
            <p>
                This game hasn't started yet! Invite someone else to play at{' '}
                <a href={joinHref} className="text-white/50 underline">{joinHref}</a>.
            </p>
        </div>
    )

    if (props.id === '333') return (
        <ManualPlayerInterface config={config} />
    )

    return (
        <CodePlayerInterface config={config} />
    )
}

type BackendMessage = ConfigMessage | CodeDataMessage

type ConfigMessage = {
    type: 'config',
    data: GameConfig
}

type CodeDataMessage = {
    type: 'code_data',
    data: {} // TODO
}
