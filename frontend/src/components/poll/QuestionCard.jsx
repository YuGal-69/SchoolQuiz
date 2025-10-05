export default function QuestionCard({poll, onVote}) {
    return (<div className="bg-[#4F0DCE] rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4"> {
            poll.question
        }</h3>
        <div className="space-y-3"> {
            poll.options.map((opt, idx) => (<button key={idx}
                onClick={
                    () => onVote(opt.id)
                }
                className="w-full bg-[#7765DA] hover:bg-[#5767D0] text-white font-medium py-2 px-4 rounded-lg transition"> {
                typeof opt.text === 'object' ? (opt.text ?. text || JSON.stringify(opt.text)) : opt.text
            } </button>))
        } </div>
    </div>);
}
