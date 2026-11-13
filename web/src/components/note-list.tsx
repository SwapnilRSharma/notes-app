import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import type { Note } from '../lib/storage'

export function NoteList({ notes }: { notes: Note[] }) {
  if (!notes.length) {
    return (
      <Card className="bg-white">
        <CardContent className="py-10 text-center text-sm text-slate-600">
          No notes yet. Create your first note to get started.
        </CardContent>
      </Card>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {notes.map((n) => (
        <Card key={n.id}>
          <CardHeader>
            <CardTitle className="truncate">{n.title}</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 whitespace-pre-wrap text-slate-700">{n.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default NoteList
