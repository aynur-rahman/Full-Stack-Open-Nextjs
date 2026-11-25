export function testingAllowed() {
  if (process.env.NODE_ENV === 'production' || process.env.TESTING !== 'true') return false
  try {
    const url = new URL(process.env.DATABASE_URL || '')
    const name = decodeURIComponent(url.pathname.slice(1))
    const overrides = ['host', 'hostaddr', 'port', 'database', 'db', 'dbname', 'service', 'servicefile']
    return name.endsWith('_test') && ![...url.searchParams.keys()].some(key => overrides.includes(key.toLowerCase()))
  } catch { return false }
}
