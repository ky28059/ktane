export default function ManualPlayerInterface() {
    return (
        <div className="container font-serif py-16">
            <h1 className="font-bold text-4xl mb-6">
                The Scame Editor
            </h1>
            <p className="mb-4">
                Scame is the advanced, extensible, customizable, self-documenting editor. This manual describes how to
                edit with Scame and some of the ways to customize it; it corresponds to KNU Scame version 2025.2.21.
            </p>
            <p className="mb-4">
                This is the KNU Scame Manual, updated for Scame version 2025.2.21.
            </p>
            <p className="mb-12">
                Copyright © 1985–2024 KTANE, Inc.
            </p>

            <h2 className="font-bold text-xl mb-5">
                Table of contents
            </h2>
            <ul className="list-disc pl-6 mb-12">
                <li className="mb-2">
                    <a className="text-[#005090] underline" href="#intro">Introduction</a>
                </li>
                <li className="mb-2">
                    <a className="text-[#005090] underline" href="#chars">Characters</a>
                </li>
                <li className="mb-2">
                    <a className="text-[#005090] underline" href="#nav">Navigation</a>
                </li>
            </ul>

            <h2 className="font-bold text-xl mb-5" id="intro">
                1. Introduction
            </h2>
            <p className="mb-4">
                You are reading about KNU Scame, the KNU incarnation of the advanced, self-documenting, customizable,
                extensible editor Scame. (Scame Cannot Accurately Mimic Emacs)
            </p>
            <p className="mb-12">
                We call Scame advanced because it can do much more than simple insertion and deletion of text. It can
                change background color, switch tabs, and deploy to prod in a single command. Scame
                editing commands operate in terms of characters, words, lines, sentences, paragraphs, and pages, as well
                as expressions and comments in various programming languages.
            </p>

            <h2 className="font-bold text-xl mb-5" id="chars">
                2. Characters
            </h2>
            <p>...</p>
        </div>
    )
}
