import CodePlayerInterface from '@/app/game/[id]/CodePlayerInterface';
import ManualPlayerInterface from '@/app/game/[id]/ManualPlayerInterface';


export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (id === '333') return (
        <ManualPlayerInterface />
    )

    return (
        <CodePlayerInterface />
    )
}
