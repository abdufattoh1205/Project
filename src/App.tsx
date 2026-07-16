import { Routes, Route, Link } from 'react-router-dom'
import Admin from './pages/Admin'
import Candidate from './pages/Candidate'
import Recruiter from './pages/Recruiter'

// Role selector — this was your first App, now it's just a component
const RoleSelector = () => {
  const roles = ['Candidate', 'Recruiter', 'Admin']
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        {roles.map((role) => (
          <Link
            key={role}
            to={`/${role.toLowerCase()}`}
            className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
          >
            {role}
          </Link>
        ))}
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleSelector />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/candidate" element={<Candidate />} />
      <Route path="/recruiter" element={<Recruiter />} />
      <Route path="*" element={<RoleSelector />} />
    </Routes>
  )
}

export default App