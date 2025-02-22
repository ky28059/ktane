import CreateLobbyButton from '@/app/(landing)/CreateLobbyButton';


export default function Home() {
    return (
        <div className="pt-16">
            <div className="container flex flex-col items-center py-8">
                <img
                    src="/assets/logo.png"
                    className="max-w-3xl mx-auto"
                />
                <p className="uppercase text-2xl text-center tracking-tight font-bold mb-6">
                    The co-op pair programming party game.
                </p>

                <CreateLobbyButton />
            </div>

            <section className="flex h-64">
                <img
                    className="w-1/2 object-cover object-top"
                    src="/assets/manual_view.jpg"
                />
            </section>

            <div className="bg-black py-12">
                <p className="container mb-5">
                    It's the night of the IPO, and your code is the final missing piece before the project can be
                    shipped. You'll need to finish it, and fast, but there's a catch... how did that esoteric
                    command-line editor work again?
                </p>
                <p className="container mb-5">
                    Inspired by Keep Talking And No One Explodes, two players must work together to finish the
                    provided code samples—one
                </p>
            </div>
        </div>
    )
}
