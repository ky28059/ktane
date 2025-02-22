import KeybindDocumentation from '@/app/game/[id]/KeybindDocumentation';
import { RuleAndTrigger } from '@/utils/rules';


export default function ManualPlayerInterface() {
    return (
        <div className="bg-gray-200">
            <div className="container font-serif py-16 max-w-6xl bg-white border-x border-black/20">
                <h1 className="font-bold text-4xl mb-6">
                    The Scame Editor
                </h1>
                <p className="mb-4">
                    Scame is the advanced, extensible, customizable, self-documenting editor. This manual describes how
                    to edit with Scame and some of the ways to customize it; it corresponds to KNU Scame version
                    2025.2.21.
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
                        <a className="text-[#005090] underline" href="#layout">Editor layout</a>
                    </li>
                    <li className="mb-2">
                        <a className="text-[#005090] underline" href="#chars">Characters</a>
                    </li>
                    <li className="mb-2">
                        <a className="text-[#005090] underline" href="#nav">Navigation</a>
                    </li>
                    <li className="mb-2">
                        <a className="text-[#005090] underline" href="#bg">Background color</a>
                    </li>
                    <li className="mb-2">
                        <a className="text-[#005090] underline" href="#mode">Mode</a>
                    </li>
                </ul>

                <h2 className="font-bold text-xl mb-5" id="intro">
                    0. Introduction
                </h2>
                <p className="mb-4">
                    You are reading about KNU Scame, the KNU incarnation of the advanced, self-documenting,
                    customizable, extensible editor Scame. (Scame Cannot Accurately Mimic Emacs)
                </p>
                <p className="mb-12">
                    We call Scame advanced because it can do much more than simple insertion and deletion of text. It
                    can change background color, switch tabs, and deploy to prod in a single command. Scame
                    editing commands operate in terms of characters, words, lines, sentences, paragraphs, and pages, as
                    well as expressions and comments in various programming languages.
                </p>

                <h2 className="font-bold text-xl mb-5" id="layout">
                    1. Editor layout
                </h2>
                <p className="mb-4">
                    An example of a Scame editor is as follows:
                </p>
                <img src="/assets/docs.jpg" />
                <p className="mb-12 mt-5">
                    Within the bottom bar, (1) displays your current <strong>Serial number</strong>, (2) displays your
                    current <strong>Mode</strong> and <strong>Background color</strong>, and (3) displays your
                    current <strong>Cursor position</strong>.
                </p>

                <h2 className="font-bold text-xl mb-5" id="chars">
                    2. Characters
                </h2>
                <p className="mb-8">
                    The following keybinds relate to inputting characters:
                </p>

                <KeybindDocumentation {...rule} />
                <KeybindDocumentation {...rule} />

                <h2 className="font-bold text-xl mt-12 mb-5" id="nav">
                    3. Navigation
                </h2>
                <p className="mb-8">
                    The following keybinds relate to navigating around the currently edited document:
                </p>

                <KeybindDocumentation {...rule} />
                <KeybindDocumentation {...rule} />
                <KeybindDocumentation {...rule} />

                <h2 className="font-bold text-xl mt-12 mb-5" id="bg">
                    4. Background color
                </h2>
                <p className="mb-5">
                    Some Scame keybinds automatically enable based on your background color. By default, your background
                    color is <code className="bg-gray-200 rounded px-1.5 py-0.5 text-sm">{res.initial_color}</code>.
                </p>
                <p className="mb-8">
                    The following keybinds relate to changing the current background color:
                </p>

                <KeybindDocumentation {...rule} />
                <KeybindDocumentation {...rule} />

                <h2 className="font-bold text-xl mt-12 mb-5" id="mode">
                    5. Mode
                </h2>
                <p className="mb-5">
                    Scame contains {res.modes.length} unique editing modes: <code className="bg-gray-200 rounded px-1.5 py-0.5 text-sm">{res.modes.join(', ')}</code>.
                    By default, your mode is set to <code className="bg-gray-200 rounded px-1.5 py-0.5 text-sm">{res.initial_mode}</code>.
                </p>
                <p className="mb-8">
                    The following keybinds relate to changing the current mode:
                </p>

                <KeybindDocumentation {...rule} />
                <KeybindDocumentation {...rule} />
            </div>
        </div>
    )
}

const res = {
    code: "def main()\nprint('hello world')",
    modes: ["square", "cycloid", "taurus"],
    initial_mode: "square",
    initial_color: "purple",
    serial_number: "27ha20vla",
    total_time: 300, // seconds
    rules: [
        {
            trigger: {
                type: "keypress",
                keypress: "a",
            },
            test: {
                type: "bin_op",
                op_type: "equals",
                lhs: {
                    type: "state_value",
                    val: "color",
                },
                rhs: {
                    type: "literal",
                    val: "purple",
                }
            },
            action: {
                type: "type_chars",
                characters: "lmao u suck",
            }
        }
    ]
}

const rule = res.rules[0] as RuleAndTrigger
