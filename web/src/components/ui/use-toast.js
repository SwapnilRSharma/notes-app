import { useToast as useToastFromProvider } from './toaster.jsx'

// Re-export a hook named useToast to align with Shadcn usage patterns
// Usage: const { toast } = useToast(); toast({ description: '...', variant: 'success' })
export function useToast() {
  return useToastFromProvider()
}

export default useToast
