import { useState } from 'react'
import { Card, CardContent } from './ui/card.jsx'
import Button from './ui/button.jsx'

export default function NotesList({ notes, loading = false, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(() => new Set())

  const toggle = (title) => {
    const next = new Set(expanded)
    if (next.has(title)) next.delete(title)
    else next.add(title)
    setExpanded(next)
  }

  if (loading) {
    return (
      <ul className="list" aria-busy="true" aria-live="polite">
        {[0,1,2].map(i => (
          <li key={i} className="list-item">
            <div className="h-16 rounded-md bg-muted animate-pulse motion-reduce:animate-none" />
          </li>
        ))}
      </ul>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-sm text-muted-foreground">
        No notes yet. Create your first note above.
      </div>
    )
  }

  return (
    <ul className="list-none p-0 m-0">
      {notes.map(n => (
        <li key={n.title} className="py-2.5">
          <Card className="bg-white text-slate-900">
            <CardContent className="py-3">
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(n.title)} aria-label="Toggle body" aria-pressed={expanded.has(n.title)} className="px-1 focus-visible:ring-2 focus-visible:ring-ring rounded">
                  {expanded.has(n.title) ? '▾' : '▸'}
                </button>
                <strong className="min-w-[160px] flex-1">{n.title}</strong>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onEdit?.(n)}>Edit</Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => onDelete?.(n)}>Delete</Button>
                </div>
              </div>
              {expanded.has(n.title) && (
                <div className="ml-7 whitespace-pre-wrap mt-2 text-slate-700">{n.body}</div>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
