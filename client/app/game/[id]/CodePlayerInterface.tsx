import CodeEditor from '@/app/game/[id]/CodeEditor';
import Console from '@/app/game/[id]/Console';

// Utils
import type { GameConfig } from '@/utils/rules';


type CodePlayerInterfaceProps = {
    config: GameConfig
}
export default function CodePlayerInterface(props: CodePlayerInterfaceProps) {
    return (
        <div className="flex h-screen">
            <CodeEditor config={props.config} />
            <Console />
        </div>
    )
}
