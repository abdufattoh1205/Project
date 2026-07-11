export default function PasswordInput() {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-900">Password</label>
      <div className="relative">
        <input
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-colors"
          type="password"
          placeholder="Enter your password"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded p-1 text-gray-400 hover:text-gray-500 cursor-pointer"
          type="button"
          tabIndex={-1}
          aria-label="Show password"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
