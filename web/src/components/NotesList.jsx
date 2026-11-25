import { useState } from 'react'
import { Card, CardContent } from './ui/card.jsx'
import Button from './ui/button.jsx'
import { countWordsAndChars, formatCount } from '../lib/textCount.js'

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
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => onDelete?.(n)}>Delete</Button>
                </div>
              </div>
              {expanded.has(n.title) && (
                <div className="body mt-2 text-slate-700">
                  {n.body}
                  <div className="mt-1 text-xs text-slate-500" data-testid="view-body-counter">
                    {formatCount(countWordsAndChars(n.body))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
