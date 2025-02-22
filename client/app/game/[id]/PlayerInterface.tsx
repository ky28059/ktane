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
        // TODO: ws logic goes here
    }, []);

    if (!config) return ( // TODO
        <div>loading...</div>
    )

    if (props.id === '333') return (
        <ManualPlayerInterface config={config} />
    )

    return (
        <CodePlayerInterface config={config} />
    )
}
