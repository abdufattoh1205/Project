import type { ReactNode } from 'react'

interface PrimaryButtonProps {
  children: ReactNode
}

export default function PrimaryButton({ children }: PrimaryButtonProps) {
  return (
    <button
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      type="submit"
    >
      {children}
    </button>
  )
}
