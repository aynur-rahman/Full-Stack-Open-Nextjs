import { afterEach, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { testingAllowed } from '../lib/testing'

const originalEnvironment = process.env
beforeEach(() => {
  process.env = {
    NODE_ENV: 'test',
    TESTING: 'true',
    DATABASE_URL: 'postgres://sample:sample@localhost:5432/blogs_test',
  }
})
afterEach(() => { process.env = originalEnvironment })

test('explicit test mode accepts a dedicated test database', () => {
  assert.equal(testingAllowed(), true)
})
test('production always disables reset and seed endpoints', () => {
  process.env = { ...process.env, NODE_ENV: 'production' }
  assert.equal(testingAllowed(), false)
})
for (const testing of [undefined, '', 'false', 'TRUE', '1']) {
  test(`the TESTING value ${JSON.stringify(testing)} does not authorize test endpoints`, () => {
    if (testing === undefined) delete process.env.TESTING
    else process.env.TESTING = testing
    assert.equal(testingAllowed(), false)
  })
}
for (const database of ['blogs', 'blogs_test_backup', 'test_blogs', '']) {
  test(`database name ${JSON.stringify(database)} is not an isolated test destination`, () => {
    process.env.DATABASE_URL = `postgres://sample:sample@localhost:5432/${database}`
    assert.equal(testingAllowed(), false)
  })
}
test('missing or malformed database URLs fail closed', () => {
  delete process.env.DATABASE_URL
  assert.equal(testingAllowed(), false)
  process.env.DATABASE_URL = 'not a database URL'
  assert.equal(testingAllowed(), false)
})
for (const key of ['host', 'hostaddr', 'port', 'database', 'db', 'dbname', 'service', 'servicefile', 'HOST']) {
  test(`a ${key} destination override cannot bypass test isolation`, () => {
    process.env.DATABASE_URL += `?${key}=application-database`
    assert.equal(testingAllowed(), false)
  })
}
test('non-routing connection options remain usable for hosted test databases', () => {
  process.env.DATABASE_URL += '?sslmode=require&application_name=course-tests'
  assert.equal(testingAllowed(), true)
})
test('encoded database names are evaluated after decoding', () => {
  process.env.DATABASE_URL = 'postgres://sample:sample@localhost/blogs%5Ftest'
  assert.equal(testingAllowed(), true)
  process.env.DATABASE_URL = 'postgres://sample:sample@localhost/blogs%5Ftest%5Fbackup'
  assert.equal(testingAllowed(), false)
})
