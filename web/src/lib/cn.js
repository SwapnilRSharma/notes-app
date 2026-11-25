import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes safely; accepts strings or arrays
export function cn(...inputs) {
  const flat = inputs.flat().filter(Boolean).join(' ')
  return twMerge(flat)
}

export default cn
