import test from 'node:test'
import assert from 'node:assert/strict'

test('countWordsAndChars: empty string -> 0 words, 0 characters', async () => {
  const { countWordsAndChars, formatCount } = await import('../web/src/lib/textCount.js')
  const res = countWordsAndChars('')
  assert.equal(res.words, 0)
  assert.equal(res.chars, 0)
  assert.equal(formatCount(res), '0 words · 0 characters')
})

test('countWordsAndChars: single word', async () => {
  const { countWordsAndChars, formatCount } = await import('../web/src/lib/textCount.js')
  const res = countWordsAndChars('Hello')
  assert.equal(res.words, 1)
  assert.equal(res.chars, 5)
  assert.equal(formatCount(res), '1 words · 5 characters')
})

test('countWordsAndChars: multiple words separated by whitespace', async () => {
  const { countWordsAndChars } = await import('../web/src/lib/textCount.js')
  const res = countWordsAndChars('one two three')
  assert.equal(res.words, 3)
  assert.equal(res.chars, 13)
})
