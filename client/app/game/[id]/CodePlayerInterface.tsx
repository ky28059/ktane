import CodeEditor from '@/app/game/[id]/CodeEditor';
import Console from '@/app/game/[id]/Console';


export default function CodePlayerInterface() {
    return (
        <div className="flex h-screen">
            <CodeEditor />
            <Console />
        </div>
    )
}
