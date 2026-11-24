import { useState } from 'react'
import { Button } from './ui/button.jsx'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog.jsx'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible.jsx'

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
          <Collapsible open={expanded.has(n.title)} onOpenChange={(o) => {
            const next = new Set(expanded); if (o) next.add(n.title); else next.delete(n.title); setExpanded(next)
          }}>
            <div className="row">
              <CollapsibleTrigger asChild>
                <button onClick={() => toggle(n.title)} aria-label="Toggle body">{expanded.has(n.title) ? '▾' : '▸'}</button>
              </CollapsibleTrigger>
              <strong className="title">{n.title}</strong>
              <div className="actions">
                <Button variant="secondary" onClick={() => onEdit?.(n)}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete note?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {`Delete note "${n.title}"? This action cannot be undone.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={() => onDelete?.(n)}>Delete</Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CollapsibleContent>
              {expanded.has(n.title) && (
                <div className="body">{n.body}</div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </li>
      ))}
    </ul>
  )
}
