import { Oswald } from 'next/font/google';
import CreateLobbyButton from '@/app/(landing)/CreateLobbyButton';


const oswald = Oswald({ subsets: ['latin'] });

export default function Home() {
    return (
        <div>
            <section className="pt-16 bg-[url('/assets/office.jpg')] bg-cover bg-center relative">
                <div className="absolute inset-0 backdrop-blur-sm" />
                <div className="relative container flex flex-col items-center py-8">
                    <img
                        src="/assets/logo.png"
                        className="max-w-3xl mx-auto"
                    />
                    <p
                        className="uppercase text-3xl text-center tracking-tight font-bold mb-6"
                        style={oswald.style}
                    >
                        The co-op pair programming party game.
                    </p>

                    <CreateLobbyButton />
                </div>
            </section>

            <section className="flex h-64">
                <img
                    className="w-1/2 object-cover object-top"
                    src="/assets/coder_view.jpg"
                />
                <img
                    className="w-1/2 object-cover object-top"
                    src="/assets/manual_view.jpg"
                />
            </section>

            <div className="bg-black py-12">
                <div className="container max-w-5xl">
                    <h2
                        className="text-ktane uppercase mb-5 font-bold tracking-tight text-2xl"
                        style={oswald.style}
                    >
                        About
                    </h2>
                    <p className="mb-5">
                        It's the night of the IPO, and your code is the final missing piece before the project can be
                        shipped. You'll need to finish it, and fast, but there's a catch... how did that esoteric
                        command-line editor work again?
                    </p>
                    <p className="mb-5">
                        Inspired by Keep Talking And No One Explodes, two players must work together to finish their
                        provided code samples—one controlling the editor, the other viewing the keybind documentation.
                        Can you pass your test cases before your code is deployed to prod?
                    </p>
                </div>
            </div>
        </div>
    )
}
