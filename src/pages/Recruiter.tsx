import { useState, useEffect } from "react"

export default function Recruiter() {
  const [category, setCategory] = useState("")
  const [name, setName] = useState("")
  const [dataType, setDataType] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/attributes")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load attributes")
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAttributes(data)
        } else {
          setError("Unexpected response format")
        }
      })
      .catch(err => setError(err.message))
  }, [])

  const handleDelete = async (id: string) => {
    await fetch(`/api/attributes/${id}`, { method: 'DELETE' })
    setAttributes(attributes.filter(a => a.id !== id))
  }

  const attributeHandle = async () => {
    if(!category || !name || !dataType || !description) {
      setError("Please fill in all fields.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name, dataType, description })
      })

      const data = await res.json()

      if(!res.ok) {
        setError(data.error || "Failed to add attribute")
      } else {
        setAttributes([data, ...attributes])
        setCategory("")
        setName("")
        setDataType("")
        setDescription("")
      }
    } catch {
      setError("Failed to connect to server")
    } finally {
      // changed: always reset loading so button never gets stuck
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex h-14 items-center gap-2 border-b border-gray-200 bg-white px-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
          <span className="text-xs font-bold text-white">CV</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">CV Platform</span>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Add Attribute</h1>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Card Header with Edit button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-500">Attribute</span>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Edit
            </button>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
                  <option value="">Select category...</option>
                  <option value="Technical">Technical</option>
                  <option value="Soft Skill">Soft Skill</option>
                  <option value="Education">Education</option>
                  <option value="Language">Language</option>
                  <option value="Certification">Certification</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  type="text"
                  placeholder="e.g. years_of_experience"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Data Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Data Type</label>
                <select value={dataType} onChange={e => setDataType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
                  <option value="">Select type...</option>
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Boolean">Boolean</option>
                  <option value="Date">Date</option>
                </select>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe this attribute..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bottom bar with + button center and Add button right */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white text-2xl text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
              +
            </button>
            <button onClick={attributeHandle} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {attributes.map(attr => (
            <div key={attr.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex gap-6 text-sm">
                <span className="font-medium text-gray-900">{attr.name}</span>
                <span className="text-gray-500">{attr.category}</span>
                <span className="text-gray-500">{attr.dataType}</span>
              </div>
              <button onClick={() => handleDelete(attr.id)}
                className="text-sm text-red-500 hover:text-red-700">
                Delete
              </button>
            </div>
          ))}

          {attributes.length === 0 && (
            <p className="text-center text-sm text-gray-400 mt-8">
              No attributes yet. Add one above.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}