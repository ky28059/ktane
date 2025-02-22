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

            <div className="bg-editor text-white fixed bottom-6 right-6 w-72 flex flex-col px-4 py-3 text-sm rounded select-none hover:bg-white/15 transition duration-150 border border-white/10">
                <span className="text-white/50">Your code will be deployed to prod in:</span>
                <span className="text-4xl font-mono">3:21</span>
            </div>
        </div>
    )
}
