/**
 * GET /api/applications/:id
 * 公開エンドポイント — 申請IDのステータスのみ返す
 * 内容・コメントは返さない
 */

import { getDb } from '../../_utils/db.js';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestGet(ctx) {
  const { env, params } = ctx;
  const id = params.id?.toUpperCase();

  // バリデーション
  if (!id || !/^APL-\d{8}-[A-Z0-9]{4}$/.test(id)) {
    return json({ error: 'Invalid ID format' }, 400);
  }

  const db = getDb(env);

  const { rows } = await db.execute({
    sql: `SELECT id, status, created_at, resolved_at, username
          FROM applications
          WHERE id = ?`,
    args: [id],
  }).catch(() => ({ rows: [] }));

  if (rows.length === 0) {
    return json({ error: 'Not found' }, 404);
  }

  const app = rows[0];

  // 内容・コメントは含めない
  return json({
    id:          app.id,
    status:      app.status,
    created_at:  app.created_at,
    resolved_at: app.resolved_at ?? null,
    username:    app.username,
  });
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
