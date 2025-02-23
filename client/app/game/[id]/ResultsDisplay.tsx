import { PiHouseBold } from 'react-icons/pi';
import { GoCheckCircleFill, GoFileCode, GoStopwatch, GoXCircleFill } from 'react-icons/go';


export default function ResultsDisplay() {
    const success = true;
    const Icon = success
        ? GoCheckCircleFill
        : GoXCircleFill

    return (
        <div className="bg-[#0d1117] h-screen text-white">
            <div className="px-8 py-16">
                <h1 className="font-medium text-xl flex gap-2 items-center">
                    <Icon className={'text-2xl ' + (success ? 'text-lime-500' : 'text-red-500')} />
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
                        <Icon className={success ? 'text-lime-500' : 'text-red-500'} />
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
                            {'succeeded'} 5 seconds ago in 25s
                        </p>
                    </div>

                    <div className="py-6 px-8 border border-white/20 flex-grow">
                        ...
                    </div>
                </div>
            </div>
        </div>
    )
}
