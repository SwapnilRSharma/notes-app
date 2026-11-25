import { useState } from 'react'
import { Card, CardContent } from './ui/card.jsx'
import Button from './ui/button.jsx'
import AlertDialog, { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog.jsx'

export default function NotesList({ notes, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(() => new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetNote, setTargetNote] = useState(null)

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
                <button onClick={() => toggle(n.title)} aria-label="Toggle body" aria-expanded={expanded.has(n.title)} className="px-1">
                  {expanded.has(n.title) ? '▾' : '▸'}
                </button>
                <strong className="title flex-1">{n.title}</strong>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onEdit?.(n)}>Edit</Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => { setTargetNote(n); setConfirmOpen(true) }}
                  >
                    Delete
                  </Button>
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
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <AlertDialogContent ariaLabelledBy="delete-title">
        <AlertDialogHeader>
          <AlertDialogTitle id="delete-title">Delete note?</AlertDialogTitle>
          <AlertDialogDescription>
            {targetNote ? `Delete note "${targetNote.title}". This action cannot be undone.` : 'Delete this note?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => { const n = targetNote; setConfirmOpen(false); setTargetNote(null); onDelete?.(n) }}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
