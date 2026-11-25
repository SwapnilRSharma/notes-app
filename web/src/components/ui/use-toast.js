import { toast as sonnerToast } from 'sonner'

// Shadcn-compatible useToast wrapper backed by Sonner
// Usage: const { toast } = useToast(); toast({ description: '...', variant: 'success' })
export function useToast() {
  return {
    toast: ({ description, variant } = {}) => {
      // Map variants to sonner styles
      if (variant === 'success') return sonnerToast.success(description)
      if (variant === 'error' || variant === 'destructive') return sonnerToast.error(description)
      return sonnerToast(description)
    }
  }
}

export default useToast
