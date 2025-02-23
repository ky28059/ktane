'use client'

import { useRef } from 'react';

// Icons
import { BiDotsHorizontal } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';


type SlackNotifProps = {
    setOpen: (open: boolean) => void
}
export default function SlackNotif(props: SlackNotifProps) {
    const played = useRef(false);

    return (
        <div className="bg-editor/80 backdrop-blur-md rounded border border-white/20 p-3 fixed bottom-5 right-5 w-96 select-none">
            <audio
                src="/audio/slack.mp3"
                ref={(e) => {
                    if (played.current) return;
                    void e?.play();
                    played.current = true;
                }}
            />

            <div className="flex gap-3 items-center mb-3">
                <img
                    src="/assets/slack.webp"
                    className="size-5 p-0.5 rounded-full bg-white"
                />
                <p className="text-sm">Slack</p>

                <BiDotsHorizontal className="ml-auto" />
                <button
                    className="p-1 pr-2 cursor-pointer"
                    onClick={() => props.setOpen(false)}
                >
                    <RxCross2 />
                </button>
            </div>

            <p className="text-sm mb-2">KTANE</p>
            <div className="flex gap-4 items-center">
                <img
                    src="/assets/jacob_pfp.jpg"
                    className="size-20 rounded-full object-cover object-center"
                />
                <div>
                    <p>#ipo</p>
                    <p className="text-white/80 text-sm">
                        Jacob W (big J): Bro hurry up
                    </p>
                </div>
            </div>
        </div>
    )
}
