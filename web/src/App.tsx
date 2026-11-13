import { useState } from 'react'
import { Button } from './components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './components/ui/dialog'

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
          <div className="flex gap-3">
            <Button onClick={() => setCount((c) => c + 1)}>Count is {count}</Button>
            <Dialog>
              <DialogTrigger>
                <Button className="bg-slate-700 hover:bg-slate-700/90">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Example Dialog</DialogTitle>
                  <DialogDescription>Shadcn-like dialog without external deps.</DialogDescription>
                </DialogHeader>
                <p className="text-sm text-slate-700">Hello from dialog.</p>
                <DialogFooter>
                  <DialogClose>
                    <Button className="bg-slate-700 hover:bg-slate-700/90">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
