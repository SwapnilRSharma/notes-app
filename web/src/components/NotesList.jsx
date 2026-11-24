import { useState } from 'react'
import { Button } from './ui/button.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible.jsx'

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
    <ul className="list-none p-0 m-0">
      {notes.map(n => (
        <li key={n.title} className="py-2 border-b border-slate-200">
          <Collapsible open={expanded.has(n.title)} onOpenChange={() => toggle(n.title)}>
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle body">
                  <span aria-hidden>{expanded.has(n.title) ? '▾' : '▸'}</span>
                </Button>
              </CollapsibleTrigger>
              <strong className="min-w-40 font-semibold">{n.title}</strong>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => onEdit?.(n)}>Edit</Button>
                <Button variant="destructive" onClick={() => onDelete?.(n)}>Delete</Button>
              </div>
            </div>
            <CollapsibleContent>
              {expanded.has(n.title) && (
                <div className="ml-8 whitespace-pre-wrap mt-1">{n.body}</div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </li>
      ))}
    </ul>
  )
}
