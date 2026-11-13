import { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import NoteList from './components/note-list'
import CreateNoteDialog from './components/create-note-dialog'
import { getNotes, type Note } from './lib/storage'

function App() {
  const [count, setCount] = useState(0)
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => getNotes())

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-2xl font-semibold">Notes</h1>
          <p className="text-sm text-gray-600">Vite + React + Tailwind</p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="grow">
            <Input
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex shrink-0 gap-2">
            <CreateNoteDialog onCreated={(n) => setNotes((prev) => [n, ...prev])}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Create Note</Button>
            </CreateNoteDialog>
            <Button onClick={() => setCount((c) => c + 1)}>Count is {count}</Button>
          </div>
        </div>
        <NoteList notes={notes} />
      </main>
    </div>
  )
}

export default App
