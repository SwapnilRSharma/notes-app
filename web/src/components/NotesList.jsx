import { useState } from 'react'
import { Card, CardContent } from './ui/card.jsx'
import Button from './ui/button.jsx'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog.jsx'

export default function NotesList({ notes, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(() => new Set())

  const toggle = (title) => {
    const next = new Set(expanded)
    if (next.has(title)) next.delete(title)
    else next.add(title)
    setExpanded(next)
  }

  if (!notes || notes.length === 0) return <p>No notes yet.</p>

  return (
    <ul className="list">
      {notes.map(n => (
        <li key={n.title} className="list-item">
          <Card className="bg-white text-slate-900">
            <CardContent className="py-3">
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(n.title)} aria-label="Toggle body" className="px-1">
                  {expanded.has(n.title) ? '▾' : '▸'}
                </button>
                <strong className="title flex-1">{n.title}</strong>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onEdit?.(n)}>Edit</Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
                    </DialogTrigger>
                    <DialogContent aria-label={`Confirm delete ${n.title}`}>
                      <DialogHeader>
                        <DialogTitle>Delete Note</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{n.title}"?</DialogDescription>
                      </DialogHeader>
                      <div className="mt-3 flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => onDelete?.(n)}>Confirm</Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              {expanded.has(n.title) && (
                <div className="body mt-2 text-slate-700">{n.body}</div>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
