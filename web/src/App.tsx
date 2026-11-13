import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-2xl font-semibold">Notes</h1>
          <p className="text-sm text-gray-600">Vite + React + Tailwind</p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="mb-4">
            Tailwind is configured. Edit <code className="font-mono">src/App.tsx</code> and save to test HMR.
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setCount((c) => c + 1)}
          >
            Count is {count}
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
