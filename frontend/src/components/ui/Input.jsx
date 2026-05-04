export default function Input({ label, icon: Icon, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>}
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200
        ${error
          ? 'border-red-300 bg-red-50/50'
          : 'border-slate-200 bg-slate-50/50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100'
        }`}>
        {Icon && <Icon size={16} className={error ? 'text-red-400' : 'text-slate-400'} />}
        {props.rows ? (
          <textarea {...props} className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none" />
        ) : (
          <input {...props} className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none" />
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
