const REPO_OWNER = "OCxeRu2951";
const REPO_NAME  = "DiscordBot-Nexus";

const TYPE_MAP = {
  bug:     { label: "bug",         prefix: "Bug Report",        color: "d73a4a" },
  feature: { label: "enhancement", prefix: "Feature Request",    color: "a2eeef" },
  other:   { label: "feedback",    prefix: "Feedback",           color: "e4e669" },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type":                "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;

  // GITHUB_TOKEN チェック
  if (!env.GITHUB_TOKEN) {
    console.error("[feedback] GITHUB_TOKEN is not set");
    return json({ error: "Server misconfigured" }, 500);
  }

  // リクエストボディのパース
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { content, lang = "ja", type = "other" } = body;

  // バリデーション
  if (!content || typeof content !== "string" || !content.trim()) {
    return json({ error: "Empty content" }, 400);
  }
  if (content.length > 1000) {
    return json({ error: "Content too long (max 1000)" }, 400);
  }

  const t   = TYPE_MAP[type] ?? TYPE_MAP.other;
  const now = new Date().toISOString();

  // Issue タイトル（最大72文字）
  const shortContent = content.slice(0, 60) + (content.length > 60 ? "..." : "");
  const title        = `[${t.prefix}] ${shortContent}`;

  // Issue 本文
  const issueBody = [
    `## ${t.prefix}`,
    "",
    "### 内容 / Content",
    "",
    content,
    "",
    "---",
    "",
    "| Key | Value |",
    "|---|---|",
    `| **Source**   | Nexus Pages — Feedback Form |`,
    `| **Language** | ${lang} |`,
    `| **Type**     | ${type} |`,
    `| **Date**     | ${now} |`,
  ].join("\n");

  // GitHub Issues API
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
    {
      method:  "POST",
      headers: {
        "Authorization":        `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type":         "application/json",
        "Accept":               "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent":           "Nexus-Pages-Feedback/1.0",
      },
      body: JSON.stringify({
        title,
        body:   issueBody,
        labels: [t.label],
      }),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[feedback] GitHub API error:", res.status, err);

    // レートリミット
    if (res.status === 403 || res.status === 429) {
      return json({ error: "Rate limited. Please try again later." }, 429);
    }
    // 認証エラー
    if (res.status === 401) {
      return json({ error: "GitHub authentication failed" }, 500);
    }

    return json({ error: "Failed to create issue" }, 500);
  }

  const issue = await res.json();

  return json({
    ok:        true,
    issue_url: issue.html_url,
    issue_number: issue.number,
  });
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}