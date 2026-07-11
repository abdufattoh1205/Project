interface TextInputProps {
  label: string
  type?: string
  placeholder?: string
}

export default function TextInput({ label, type = 'text', placeholder }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-900">{label}</label>
      <input
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-colors"
        type={type}
        placeholder={placeholder}
      />
    </div>
  )
}
