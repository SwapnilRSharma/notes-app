import * as React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { addNote, type Note } from '../lib/storage'

export function CreateNoteDialog({
  children,
  onCreated,
}: {
  children: React.ReactNode
  onCreated?: (note: Note) => void
}) {
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const titleRef = React.useRef<HTMLInputElement>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>Enter a title and body for your new note.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              ref={titleRef}
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My new note"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your thoughts..."
              rows={6}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button className="bg-slate-700 hover:bg-slate-700/90" type="button">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={(e) => { e.preventDefault(); /* close is handled by DialogClose */ }} className="hidden" />
          </DialogClose>
          {/* Hidden close is used to get a close callback without exposing internal state; instead, we wrap Save in DialogClose that runs handler then closes via context. */}
          {/* Save button that closes after saving */}
          <DialogClose asChild>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={(e) => {
                e.preventDefault()
                // We cannot get a direct close callback; DialogClose will close after this handler
                // so we just perform save here without manual close and rely on DialogClose
                const t = title.trim()
                const b = body.trim()
                if (!t || !b) {
                  setError('Title and body are required.')
                  titleRef.current?.focus()
                  // Prevent closing by stopping propagation
                  e.stopPropagation()
                  return
                }
                const note = addNote({ title: t, body: b })
                onCreated?.(note)
                setTitle('')
                setBody('')
                setError(null)
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNoteDialog
