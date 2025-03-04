import { FaPython } from 'react-icons/fa6';


type FileBarProps = {
    files: string[],
    selected: string
}
export default function FileBar(props: FileBarProps) {
    return (
        <div className="flex bg-filebar border-b border-white/25">
            {props.files.map((file, i) => (
                <File
                    key={file}
                    name={file}
                    selected={props.selected}
                />
            ))}
        </div>
    )
}

type FileProps = {
    name: string,
    selected: string,
}
function File(props: FileProps) {
    const active = props.selected === props.name;

    return (
        <button
            className={'flex items-center gap-1 px-3 py-1.5 text-sm cursor-pointer border-x border-t ' + (active ? 'text-white border-t-blue-500 border-b border-b-editor border-x-white/25 -mb-px bg-editor' : 'text-white/40 border-x-transparent border-t-transparent')}
            // onClick={() => props.setSelected(props.name)}
        >
            <FaPython />
            {props.name}
        </button>
    )
}
