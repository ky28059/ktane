'use client'

import { useRouter } from 'next/navigation';


export default function CreateLobbyButton() {
    const router = useRouter();

    async function createLobby() {
        const { lobby_id } = await (await fetch(`${process.env.API_BASE}/lobby`, {
            method: 'POST',
            body: JSON.stringify({ difficulty: 2 })
        })).json();

        router.push(`/game/${lobby_id}`);
    }

    return (
        <button
            className="mx-auto px-4 py-2.5 rounded font-semibold text-white cursor-pointer border border-white"
            onClick={createLobby}
        >
            Create a lobby
        </button>
    )
}
