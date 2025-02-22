import PlayerInterface from '@/app/game/[id]/PlayerInterface';


export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PlayerInterface id={id} />
}
