export default function Console() {
    return (
        <div className="flex-none bg-black text-white w-[40vw] border-l border-white/25 p-4">
            <pre className="whitespace-pre-wrap text-sm">
                {ex}
            </pre>
        </div>
    )
}

const ex = `Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.153.1-microsoft-standard-WSL2 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro


This message is shown once a day. To disable it please create the
/home/dev/.hushlogin file.
dev@ktane:~$`
