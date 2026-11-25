const test = require('node:test')
const assert = require('node:assert/strict')

test('countWordsAndChars: empty string -> 0 words, 0 characters', async () => {
  const { countWordsAndChars, formatCount } = require('../web/src/lib/textCount.node.cjs')
  const res = countWordsAndChars('')
  assert.equal(res.words, 0)
  assert.equal(res.chars, 0)
  assert.equal(formatCount(res), '0 words · 0 characters')
})

test('countWordsAndChars: single word', async () => {
  const { countWordsAndChars, formatCount } = require('../web/src/lib/textCount.node.cjs')
  const res = countWordsAndChars('Hello')
  assert.equal(res.words, 1)
  assert.equal(res.chars, 5)
  assert.equal(formatCount(res), '1 words · 5 characters')
})

test('countWordsAndChars: multiple words separated by whitespace', async () => {
  const { countWordsAndChars } = require('../web/src/lib/textCount.node.cjs')
  const res = countWordsAndChars('one two three')
  assert.equal(res.words, 3)
  assert.equal(res.chars, 13)
})
