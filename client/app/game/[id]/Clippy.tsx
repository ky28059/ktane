import { DotGothic16 } from "next/font/google";

const dotgothic = DotGothic16({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-dot-gothic",
});

type ClippyProps = {
    setOpen: (open: boolean) => void
}
export default function Clippy(props: ClippyProps) {
    return (
        <div className="fixed top-[25%] left-[8%] right-[80%] bottom-[15%]">
            <div className={`bg-[#ffffd1] text-[#404035] z-50 border rounded-xl border-[#20201a] overflow-scroll shadow-lg p-1 text-sm ${dotgothic.className}`}>
                
                <div className="mb-3">
                    Hi, I'm Clippy! I'm the browser assistant and my job is to help you navigate this page.
                </div>
                
                <div className="mb-3">
                    Would you like help?
                </div>

                <input
                    type="checkbox"
                    id="clippycheck"
                    onChange={() => {
                        props.setOpen(false);
                        new Audio("/audio/clippy-click.mp3").play()
                    }}/>
                <label htmlFor="clippycheck" className="mb-1 ml-1">Dont show me this tip again.</label>
            </div>
            <img src="/assets/clippy.webp" alt="test" className="p-3" />
        </div>
    )
}