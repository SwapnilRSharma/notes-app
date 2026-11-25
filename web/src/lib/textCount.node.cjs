// CommonJS wrapper for Node unit tests.
// Mirrors the browser ESM helpers in textCount.js so Node can consume without ESM.

function countWordsAndChars(text) {
  const s = typeof text === 'string' ? text : ''
  const chars = s.length
  const words = s.trim() ? s.trim().split(/\s+/).length : 0
  return { words, chars }
}

function formatCount({ words, chars }) {
  // Keep labels consistent with the UI/acceptance criteria
  return `${words} words · ${chars} characters`
}

module.exports = { countWordsAndChars, formatCount }
