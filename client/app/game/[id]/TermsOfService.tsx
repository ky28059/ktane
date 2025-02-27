import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
});

const termsText: string = lorem.generateParagraphs(200);

type TermsOfServiceProps = {
    setOpen: (open: boolean) => void
}
export default function TermsOfService(props: TermsOfServiceProps) {

    return (
        <div className="bg-white text-gray-800 font-serif fixed top-[5%] left-[20%] right-[20%] bottom-[5%]  z-50 border border-gray-200 overflow-scroll shadow-lg">
            <div className="text-2xl p-2 border-b border-gray-300 bg-gray-50 font-extrabold">
                Terms and Conditions
            </div>
            <div className="bg-gray-50 m-5 border rounded-sm border-gray-200 text-gray-800 overflow-scroll">
                <div className="text-center font-bold text-2xl mb-3">
                    KNU GENERAL PUBLIC LICENSE
                </div>
                <div>
                    { termsText }
                </div>
            </div>
            <div className="flex justify-center items-center">
                <button 
                    onClick={() => props.setOpen(false)}
                    className="mb-2 pl-2 pr-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none transition-colors duration-200"
                >
                    Accept
                </button>
            </div>
            
        </div>
    )
}