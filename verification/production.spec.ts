import { randomUUID } from 'node:crypto'
import { test, expect } from '@playwright/test'

test('production persists the complete reading workflow and rejects testing endpoints', async ({ page, request }, testInfo) => {
  const suffix = randomUUID().slice(0, 8)
  const username = `production_${suffix}`
  const name = `Production Reader ${suffix}`
  const password = `Local-${randomUUID()}`
  const title = `Production persistence ${suffix}`
  const secondTitle = `Production companion ${suffix}`

  expect((await request.delete('/api/testing/reset')).status()).toBe(403)
  expect((await request.post('/api/testing/users', { data: { username, name, password } })).status()).toBe(403)

  await page.goto('/register')
  await page.getByLabel('Username', { exact: true }).fill(username)
  await page.getByLabel('Name', { exact: true }).fill(name)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByLabel('Confirm Password', { exact: true }).fill(password)
  await page.getByTestId('register-button').click()
  await expect(page).toHaveURL('/login')
  await page.getByLabel('Username', { exact: true }).fill(username)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByTestId('login-button').click()
  await expect(page).toHaveURL('/')

  for (const blogTitle of [title, secondTitle]) {
    await page.goto('/blogs/new')
    await page.getByLabel('Title', { exact: true }).fill(blogTitle)
    await page.getByLabel('Author', { exact: true }).fill('Production Author')
    await page.getByLabel('URL', { exact: true }).fill(`https://example.com/articles/${suffix}`)
    await page.getByTestId('create-blog-button').click()
    await expect(page).toHaveURL('/blogs')
    await expect(page.getByTestId('blogs-list')).toContainText(blogTitle)
  }
  await page.getByRole('link', { name: secondTitle, exact: true }).click()
  await page.getByRole('button', { name: 'Like', exact: true }).click()
  await expect(page.getByTestId('like-count')).toHaveText('1 like')
  await page.reload()
  await expect(page.getByTestId('like-count')).toHaveText('1 like')

  await page.goto('/blogs')
  await page.getByTestId('filter-input').fill(suffix)
  await page.getByTestId('search-button').click()
  await expect(page).toHaveURL(`/blogs?filter=${suffix}`)
  await expect(page.getByTestId('blogs-list').getByRole('link')).toHaveText([secondTitle, title])
  await page.reload()
  await expect(page.getByTestId('blogs-list').getByRole('link')).toHaveText([secondTitle, title])

  await page.screenshot({ path: testInfo.outputPath('blogs-desktop.png'), fullPage: true })
  await page.setViewportSize({ width: 375, height: 812 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('blogs-mobile.png'), fullPage: true })
  await page.setViewportSize({ width: 1280, height: 800 })

  await page.goto('/me')
  const unread = page.getByTestId('unread-section')
  await expect(unread).toContainText(title)
  await expect(unread).toContainText(secondTitle)
  await unread.locator('li').filter({ has: page.getByRole('link', { name: title, exact: true }) }).getByRole('button', { name: 'Mark as read' }).click()
  await expect(page.getByTestId('read-section')).toContainText(title)
  await expect(unread).not.toContainText(title)
  await page.reload()
  await expect(page.getByTestId('read-section')).toContainText(title)
  await expect(unread).toContainText(secondTitle)

  await page.getByTestId('generate-token-button').click()
  await expect(page.getByTestId('api-token')).toBeVisible()
  const token = (await page.getByTestId('api-token').innerText()).trim()
  const profile = await request.get('/api/me', { headers: { Authorization: `Bearer ${token}` } })
  expect(profile.status()).toBe(200)
  expect(await profile.json()).toEqual({ id: expect.any(Number), username, name })
  expect((await page.request.get('/api/me')).status()).toBe(401)

  await page.goto(`/users/${username}`)
  await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: secondTitle, exact: true })).toBeVisible()
  expect((await request.delete('/api/testing/reset')).status()).toBe(403)
  await page.reload()
  await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible()
})
