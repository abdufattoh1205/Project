import AuthLayout from '../components/auth/AuthLayout'
import AuthCard from '../components/auth/AuthCard'
import TextInput from '../components/auth/TextInput'
import PasswordInput from '../components/auth/PasswordInput'
import PrimaryButton from '../components/auth/PrimaryButton'
import OAuthButton from '../components/auth/OAuthButton'

export default function Register() {
  return (
    <AuthLayout>
      <AuthCard title="Create an account" subtitle="Get started with your free account">
        <form className="flex flex-col gap-[18px]" onSubmit={(e) => e.preventDefault()}>
          <TextInput label="Full Name" placeholder="Enter your full name" />
          <TextInput label="Email" type="email" placeholder="Enter your email" />
          <PasswordInput />
          <TextInput label="Confirm Password" type="password" placeholder="Confirm your password" />

          <PrimaryButton>Create account</PrimaryButton>
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
          Already have an account?{' '}
          <a href="#" className="font-semibold text-indigo-600 hover:underline" onClick={(e) => e.preventDefault()}>
            Sign in
          </a>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
