// Simple text counting helpers used by the UI
// words: count of whitespace-separated tokens in trim(text)
// chars: total string length (includes spaces and punctuation)

export function countWordsAndChars(text) {
  const s = typeof text === 'string' ? text : ''
  const chars = s.length
  const words = s.trim() ? s.trim().split(/\s+/).length : 0
  return { words, chars }
}

export function formatCount({ words, chars }) {
  // UX: keep static labels as per acceptance criteria
  return `${words} words · ${chars} characters`
}
