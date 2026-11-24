import { Toaster as Sonner } from 'sonner'

export function Toaster(props) {
  return (
    <Sonner richColors position="top-right" toastOptions={{ duration: 2500 }} {...props} />
  )
}

export default Toaster
