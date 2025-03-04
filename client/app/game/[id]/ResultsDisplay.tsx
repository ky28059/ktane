import { PiHouseBold } from 'react-icons/pi';
import {
    GoArrowLeft,
    GoCheckCircleFill,
    GoChevronRight, GoCode,
    GoFileCode, GoGear, GoGitPullRequest, GoGraph, GoIssueOpened, GoLock, GoPlay, GoShield,
    GoSkip,
    GoStopwatch, GoTable,
    GoXCircleFill
} from 'react-icons/go';
import { FaGithub } from 'react-icons/fa6';

// Utils
import type { CodeData, TestData } from '@/app/game/[id]/PlayerInterface';


type ResultsDisplayProps = {
    codeData: CodeData['nums'],
    results: TestData | null
}
export default function ResultsDisplay(props: ResultsDisplayProps) {
    const loading = !props.results;
    const failed = props.results && (props.results.all_tests_failed || Object.values(props.results.tests).some(x => !x))

    const Icon = loading
        ? GoSkip : failed
        ? GoXCircleFill
        : GoCheckCircleFill;

    return (
        <div className="bg-[#0d1117] h-screen text-white">
            <header className="bg-black px-4 pt-5 border-b border-white/20">
                <div className="flex items-center gap-3">
                    <FaGithub className="text-3xl" />
                    <p className="text-sm flex items-center gap-2">
                        KTANE <span className="text-white/50">/</span> prod-repo <GoLock />
                    </p>
                </div>

                <div className="flex gap-2 mt-3">
                    <p className="flex gap-2 items-center p-2 text-sm border-b-2 border-transparent">
                        <GoCode className="text-white/50 text-base" /> Code
                    </p>
                    <p className="flex gap-2 items-center p-2 text-sm border-b-2 border-transparent">
                        <GoIssueOpened className="text-white/50 text-base" /> Issues
                    </p>
                    <p className="flex gap-2 items-center p-2 text-sm border-b-2 border-transparent">
                        <GoGitPullRequest className="text-white/50 text-base" /> Pull requests
                    </p>
                    <p className="flex gap-2 items-center p-2 text-sm border-b-2 border-red-400">
                        <GoPlay className="text-white/50 text-base" /> Actions
                    </p>
                    <p className="flex gap-2 items-center p-2 text-sm border-b-2 border-transparent">
                        <GoTable className="text-white/50 text-base" /> Projects
                    </p>
                    <p className="flex gap-2 items-center p-2 text-sm border-b-2 border-transparent">
                        <GoShield className="text-white/50 text-base" /> Security
                    </p>
                    <p className="flex gap-2 items-center p-2 text-sm border-b-2 border-transparent">
                        <GoGraph className="text-white/50 text-base" /> Insights
                    </p>
                    <p className="flex gap-2 items-center p-2 text-sm border-b-2 border-transparent">
                        <GoGear className="text-white/50 text-base" /> Settings
                    </p>
                </div>
            </header>

            <div className="px-8 py-12">
                <p className="text-sm text-white/50 flex items-center gap-1 mb-2">
                    <GoArrowLeft /> Build
                </p>
                <h1 className="font-medium text-xl flex gap-2 items-center">
                    <Icon className={'text-2xl ' + (loading ? 'text-white/50' : failed ? 'text-red-500' : 'text-lime-500')} />
                    deployed to prod 🚀🚀🔥
                    <span className="text-white/40 font-normal">#3147</span>
                </h1>
            </div>

            <div className="flex gap-8 mr-6">
                <aside className="px-6 w-80 flex-none">
                    <h3 className="flex items-center gap-2 border-b border-white/20 py-2 px-4 text-sm">
                        <PiHouseBold className="text-white/60 text-base" /> Summary
                    </h3>
                    <h4 className="text-xs text-white/50 px-4 mt-5 mb-3">
                        Jobs
                    </h4>
                    <div className="py-2 flex items-center gap-1 bg-white/5 rounded px-3 text-sm border-l-3 border-blue-500 font-medium">
                        <Icon className={loading ? 'text-white/50' : failed ? 'text-red-500' : 'text-lime-500'} />
                        CI tests & code coverage
                    </div>
                    <hr className="border-white/20 my-2" />
                    <h4 className="text-xs text-white/50 px-4 mt-5 mb-3">
                        Run details
                    </h4>
                    <p className="flex items-center gap-2 py-1 px-4 text-sm">
                        <GoStopwatch className="text-white/60 text-base" /> Usage
                    </p>
                    <p className="flex items-center gap-2 py-1 px-4 text-sm">
                        <GoFileCode className="text-white/60 text-base" /> Workflow file
                    </p>
                </aside>

                <div className="bg-black/70 flex flex-col flex-grow">
                    <div className="py-6 px-8 border border-white/20">
                        <h2 className="font-semibold">
                            CI tests & code coverage
                        </h2>
                        <p className="text-white/40 text-sm">
                            {loading ? 'queued' : failed ? 'failed' : 'succeeded'} 5 seconds ago in 25s
                        </p>
                    </div>

                    <div className="py-6 px-8 border border-white/20 flex-grow flex flex-col gap-2">
                        {Object.entries(props.codeData).map(([num, [difficulty, _, name]]) => (
                            <div
                                className="text-white/60 py-1 px-4 text-sm flex items-center gap-3"
                                key={num}
                            >
                                <GoChevronRight className="text-lg" />
                                {!props.results ? (
                                    // TODO
                                    <GoSkip className="text-xl" />
                                ) : (props.results.all_tests_failed || !props.results.tests[num]) ? (
                                    <GoXCircleFill className="text-red-500 text-xl" />
                                ) : (
                                    <GoCheckCircleFill className="text-lime-500 text-xl" />
                                )}
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
