import { createClient } from '@libsql/client/web';

let _db = null;

export function getDb(env) {
  if (_db) return _db;
  _db = createClient({
    url:       env.TURSO_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return _db;
}
