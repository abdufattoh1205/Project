import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import TextInput from '../components/auth/TextInput'
import PasswordInput from '../components/auth/PasswordInput'
import PrimaryButton from '../components/auth/PrimaryButton'
import OAuthButton from '../components/auth/OAuthButton'

export default function Login() {
  return (
    <AuthLayout>
      <AuthCard title="Welcome back" subtitle="Sign in to your account to continue">
        <form className="flex flex-col gap-[18px]" onSubmit={(e) => e.preventDefault()}>
          <TextInput label="Email" type="email" placeholder="Enter your email" />
          <PasswordInput />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500 select-none">
              <input type="checkbox" className="peer sr-only" />
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 transition-colors peer-checked:border-indigo-600 peer-checked:bg-indigo-600">
                <svg className="hidden peer-checked:block" width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>Remember me</span>
            </label>
            <a href="#" className="text-xs font-medium text-indigo-600 hover:underline" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <PrimaryButton>Sign in</PrimaryButton>
        </form>

        <div className="flex items-center gap-3 my-5">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-500 whitespace-nowrap">or continue with</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex flex-col gap-2.5">
          <OAuthButton provider="google" />
          <OAuthButton provider="facebook" />
        </div>

        <p className="mt-5 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <a href="#" className="font-semibold text-indigo-600 hover:underline" onClick={(e) => e.preventDefault()}>
            Create one
          </a>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
