type FileBarProps = {
    files: string[],
    selected: string,
    setSelected: (selected: string) => void,
}
export default function FileBar(props: FileBarProps) {
    return (
        <div className="flex bg-filebar border-b border-white/25">
            {props.files.map((file, i) => (
                <File
                    key={file}
                    name={file}
                    selected={props.selected}
                    setSelected={props.setSelected}
                />
            ))}
        </div>
    )
}

type FileProps = {
    name: string,
    selected: string,
    setSelected: (selected: string) => void,
}
function File(props: FileProps) {
    const active = props.selected === props.name;

    return (
        <button
            className={'flex px-3 py-1.5 text-sm cursor-pointer border-x border-t ' + (active ? 'text-white border-t-blue-500 border-b border-b-editor border-x-white/25 -mb-px bg-editor' : 'text-white/40 border-x-transparent border-t-transparent')}
            onClick={() => props.setSelected(props.name)}
        >
            {props.name}
        </button>
    )
}
