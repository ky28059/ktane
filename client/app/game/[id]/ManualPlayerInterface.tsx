import KeybindDocumentation from '@/app/game/[id]/KeybindDocumentation';
import type { GameConfig } from '@/utils/rules';
import { Duration } from "luxon";
import { useEffect, useRef, useState } from 'react';
import TermsOfService from '@/app/game/[id]/TermsOfService';
import Clippy from '@/app/game/[id]/Clippy';



type ManualPlayerInterfaceProps = {
    config: GameConfig,
    timeLeft: Duration,
}
export default function ManualPlayerInterface(props: ManualPlayerInterfaceProps) {
    const groups = Object.groupBy(props.config.rules, (r) => r.action.type);
    const [showTOS, setShowTOS] = useState(false);
    const openedTOS = useRef(false);

    const [showClippy, setShowClippy] = useState(false);
    const openedClippy = useRef(false);

    useEffect(() => {
        if (openedTOS.current) return;
        if (props.timeLeft > Duration.fromMillis(1000 * 60 * 4)) return; //should be 4 minutes in

        setShowTOS(true);
        openedTOS.current = true;
    }, [props.timeLeft]);

    useEffect(() => {
        if (openedClippy.current) return;
        if (props.timeLeft > Duration.fromMillis(1000 * 60 * 2)) return;

        setShowClippy(true);
        openedClippy.current = true;
    }, [props.timeLeft]);

    return (
        <div className="bg-gray-200 text-black">
            { showTOS && <TermsOfService setOpen={setShowTOS} />}
            {showClippy && <Clippy setOpen={setShowClippy}/>}
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
                    <li className="mb-2">
                        <a className="text-[#005090] underline" href="#misc">Advanced</a>
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

                <h2 className="font-bold text-xl mb-5" id="intro">
                    0.1. Parsing this manual
                </h2>
                <p className="mb-4">
                    Each keybind in this manual takes the form:
                </p>
                <code className="text-xl bg-black/5 rounded px-2 py-1 h-max">
                    [CSA]-[key]
                </code>
                <p className="mb-4 mt-4">
                    Where <strong>C</strong>, <strong>S</strong>, or <strong>A</strong> on the left of the divider
                    corresponds to a need to press <strong>Ctrl/Cmd</strong>, <strong>Shift</strong>, and{' '}
                    <strong>Alt</strong>, respectively.
                </p>
                <p className="mb-12">
                    On the right, each key is denoted by its <a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code" target="_blank" rel="noopener noreferrer" className="text-[#005090] underline">JavaScript key code</a>.
                    For example, <strong>k</strong> is denoted by <strong>KeyK</strong>, <strong>9</strong> by
                    <strong>Digit9</strong>, the enter key by <strong>Enter</strong>, etc.
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

                {groups['type_chars']?.map((r) => (
                    <KeybindDocumentation {...r} key={JSON.stringify(r)} />
                )) ?? (
                    <p>No keybinds found.</p>
                )}

                <h2 className="font-bold text-xl mb-5" id="del">
                    2.1. Deletion
                </h2>
                <p className="mb-8">
                    The following keybinds relate to un-inputting characters:
                </p>

                {groups['delete']?.map((r) => (
                    <KeybindDocumentation {...r} key={JSON.stringify(r)} />
                )) ?? (
                    <p>No keybinds found.</p>
                )}
                {groups['backspace']?.map((r) => (
                    <KeybindDocumentation {...r} key={JSON.stringify(r)} />
                )) ?? (
                    <p>No keybinds found.</p>
                )}

                <h2 className="font-bold text-xl mt-12 mb-5" id="nav">
                    3. Navigation
                </h2>
                <p className="mb-8">
                    The following keybinds relate to navigating around the currently edited document:
                </p>

                {groups['move_cursor']?.map((r) => (
                    <KeybindDocumentation {...r} key={JSON.stringify(r)} />
                )) ?? (
                    <p>No keybinds found.</p>
                )}

                <h2 className="font-bold text-xl mt-12 mb-5" id="bg">
                    4. Background color
                </h2>
                <p className="mb-5">
                    Some Scame keybinds automatically enable based on your background color. By default, your background
                    color is <code
                    className="bg-gray-200 rounded px-1.5 py-0.5 text-sm">{props.config.initial_color}</code>.
                </p>
                <p className="mb-8">
                    The following keybinds relate to changing the current background color:
                </p>

                {groups['change_bg']?.map((r) => (
                    <KeybindDocumentation {...r} key={JSON.stringify(r)} />
                )) ?? (
                    <p>No keybinds found.</p>
                )}

                <h2 className="font-bold text-xl mt-12 mb-5" id="mode">
                    5. Mode
                </h2>
                <p className="mb-5">
                    Scame contains {props.config.modes.length} unique editing modes: <code
                    className="bg-gray-200 rounded px-1.5 py-0.5 text-sm">{props.config.modes.join(', ')}</code>.
                    By default, your mode is set to <code
                    className="bg-gray-200 rounded px-1.5 py-0.5 text-sm">{props.config.initial_mode}</code>.
                </p>
                <p className="mb-8">
                    The following keybinds relate to changing the current mode:
                </p>

                {groups['change_mode']?.map((r) => (
                    <KeybindDocumentation {...r} key={JSON.stringify(r)} />
                )) ?? (
                    <p>No keybinds found.</p>
                )}

                <h2 className="font-bold text-xl mt-12 mb-5" id="misc">
                    6. Advanced
                </h2>
                <p className="mb-8">
                    The following advanced Scame keybinds handle more advanced features than simple text insertion
                    and deletion.
                </p>

                <h3 className="font-bold text-xl mt-12 mb-8" id="misc">
                    6.1. Deploying to prod
                </h3>
                {groups['submit']?.map((r) => (
                    <KeybindDocumentation {...r} key={JSON.stringify(r)} />
                )) ?? (
                    <p>No keybinds found.</p>
                )}

                <h3 className="font-bold text-xl mt-12 mb-8" id="misc">
                    6.2. Multi-modal keybinds
                </h3>
                {groups['action_list']?.map((r) => (
                    <KeybindDocumentation {...r} key={JSON.stringify(r)} />
                )) ?? (
                    <p>No keybinds found.</p>
                )}
            </div>
        </div>
    )
}
