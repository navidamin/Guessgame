// Modal overlay: shows 3 random topic buttons. The team picks one.

export default function TopicPicker({ topics, onSelect, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 space-y-5">
        <div className="text-center">
          <h2 className="text-xl font-bold">انتخاب موضوع</h2>
          <p className="text-sm text-slate-400 mt-1">
            یکی از سه موضوع زیر را انتخاب کنید.
          </p>
        </div>

        <div className="space-y-3">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => onSelect(topic)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl text-lg font-semibold transition hover:ring-2 hover:ring-emerald-400"
            >
              {topic}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-full text-sm text-slate-500 hover:text-slate-300 transition pt-2"
        >
          انصراف
        </button>
      </div>
    </div>
  )
}
