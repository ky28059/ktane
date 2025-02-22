import { Prism } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


type SyntaxHighlighterProps = {
    language: string,
    children: string | string[]
};
export default function SyntaxHighlighter(props: SyntaxHighlighterProps) {
    return (
        <Prism
            language={props.language}
            style={vscDarkPlus}
            customStyle={{ margin: 0 }}
            // codeTagProps={{style: {}}}
            showLineNumbers
            // useInlineStyles={false}
        >
            {props.children}
        </Prism>
    )
}
