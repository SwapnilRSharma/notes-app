import type { Note } from '../types'
import { NoteForm } from './NoteForm'

export function EditNoteModal({ note, onClose, onSave }: { note: Note; onClose: () => void; onSave: (updated: Note) => Promise<void> | void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center' }}>
      <div style={{ background: 'white', padding: 16, width: 520, maxWidth: '90vw', borderRadius: 8 }}>
        <h3>Edit Note</h3>
        <NoteForm initial={note} onSubmit={onSave} />
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
