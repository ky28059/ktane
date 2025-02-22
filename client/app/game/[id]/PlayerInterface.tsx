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
    const [config, setConfig] = useState<GameConfig | null>({'code': "def main():\n    print('hello world')", 'modes': ['square', 'circle', 'rhombus', 'pyramid', 'circle', 'square'], 'initial_mode': 'pyramid', 'initial_color': BgColor.Purple, 'serial_number': 'ZmRLcY08Bm6X', 'total_time': 110, 'rules': [{'trigger': {'type': 'keypress', 'keypress': '-KeyA'}, 'test': {'type': 'bin_op', 'op_type': BinaryOp.Equals, 'lhs': {'type': 'state_value', 'val': StateValue.Background}, 'rhs': {'type': 'literal', 'val': 'purple'}}, 'action': {'type': 'type_chars', 'characters': 'lmao u suck'}}]});

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
