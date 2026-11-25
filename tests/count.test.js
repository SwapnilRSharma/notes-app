// Minimal unit test for word/character count logic
const assert = require('assert')

function countWordChar(text) {
  const t = (text || '')
  const trimmed = t.trim()
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0
  const characters = t.length
  return { words, characters }
}

// Empty
let res = countWordChar('')
assert.strictEqual(res.words, 0, 'empty: words should be 0')
assert.strictEqual(res.characters, 0, 'empty: characters should be 0')

// Single word
res = countWordChar('hello')
assert.strictEqual(res.words, 1, 'single word: words should be 1')
assert.strictEqual(res.characters, 5, 'single word: characters should be 5')

// Multi-word with extra whitespace
res = countWordChar('hello  world   test')
assert.strictEqual(res.words, 3, 'multi-word: words should be 3')
assert.strictEqual(res.characters, 5 + 2 + 5 + 3 + 4, 'multi-word: characters should include spaces')

// Newlines and tabs
res = countWordChar('\tone\n two\nthree')
assert.strictEqual(res.words, 3, 'whitespace-separated tokens should count as words')
assert.strictEqual(res.characters, '\tone\n two\nthree'.length, 'characters should be raw length including whitespace')

console.log('count.test.js passed')
