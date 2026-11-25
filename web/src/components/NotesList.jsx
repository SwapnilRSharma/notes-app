import { useState } from 'react'
import { Card, CardContent } from './ui/card.jsx'
import Button from './ui/button.jsx'

export default function NotesList({ notes, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(() => new Set())

  // Count helper for view mode; keeps logic consistent with editors
  const countWordChar = (text) => {
    const t = (text || '')
    const trimmed = t.trim()
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0
    const characters = t.length
    return { words, characters }
  }

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
                <div className="mt-2">
                  <div className="body text-slate-700">{n.body}</div>
                  {(() => {
                    const { words, characters } = countWordChar(n.body)
                    return (
                      <div className="text-slate-500 text-sm mt-1" aria-label="note-counter">
                        {words} words · {characters} characters
                      </div>
                    )
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
