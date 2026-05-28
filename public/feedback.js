const MESSAGES = {
  ja: {
    empty: "フィードバックを入力してください。",
    sending: "送信中...",
    success: "送信しました。ありがとうございます。",
    error: "送信に失敗しました。時間をおいて再試行してください。",
    tooLong: "フィードバックは1000文字以内で入力してください。",
    submit: "送信",
    viewIssue: "Issueを確認",
  },
  en: {
    empty: "Please enter your feedback.",
    sending: "Sending...",
    success: "Thank you! Your feedback has been submitted.",
    error: "Failed to send. Please try again later.",
    tooLong: "Feedback must be 1000 characters or less.",
    submit: "Submit",
    viewIssue: "View Issue",
  },
};

function getLang() {
  return localStorage.getItem("lang") || "ja";
}

function showStatus(msg, type = "info", issueUrl = null) {
  let el = document.getElementById("feedbackStatus");
  if (!el) {
    el = document.createElement("div");
    el.id = "feedbackStatus";
    el.style.cssText = [
      "margin-top:12px",
      "padding:10px 14px",
      "border-radius:8px",
      "font-size:14px",
      "font-family:monospace",
      "transition:all 0.2s",
      "display:flex",
      "align-items:center",
      "justify-content:space-between",
      "gap:12px",
    ].join(";");
    document.getElementById("submitBtn").after(el);
  }

  const styles = {
    success: {
      bg: "rgba(35,165,90,0.12)",
      color: "#23a55a",
      border: "rgba(35,165,90,0.3)",
    },
    error: {
      bg: "rgba(242,63,66,0.12)",
      color: "#f23f42",
      border: "rgba(242,63,66,0.3)",
    },
    info: {
      bg: "rgba(240,120,48,0.10)",
      color: "#f07830",
      border: "rgba(240,120,48,0.3)",
    },
  };

  const s = styles[type] ?? styles.info;
  el.style.background = s.bg;
  el.style.color = s.color;
  el.style.border = `1px solid ${s.border}`;

  el.innerHTML = `<span>${msg}</span>`;

  if (issueUrl) {
    const link = document.createElement("a");
    link.href = issueUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = MESSAGES[getLang()].viewIssue + " →";
    link.style.cssText =
      "color:inherit;text-decoration:underline;white-space:nowrap;font-weight:700;";
    el.appendChild(link);
  }

  el.style.display = "flex";
}

function hideStatus() {
  const el = document.getElementById("feedbackStatus");
  if (el) el.style.display = "none";
}

function updateCounter() {
  const input = document.getElementById("feedbackInput");
  if (!input) return;

  let counter = document.getElementById("feedbackCounter");
  if (!counter) {
    counter = document.createElement("div");
    counter.id = "feedbackCounter";
    counter.style.cssText =
      "text-align:right;font-size:12px;font-family:monospace;margin-top:4px;transition:color 0.2s;";
    input.after(counter);
  }

  const len = input.value.length;
  const max = 1000;
  const pct = len / max;
  counter.style.color =
    pct > 0.9 ? "#f23f42" : pct > 0.7 ? "#f0b232" : "var(--muted)";
  counter.textContent = `${len} / ${max}`;
}

function updateButtonLabel() {
  const lang = getLang();
  const btn = document.getElementById("submitBtn");
  if (btn && !btn.disabled) {
    btn.textContent = MESSAGES[lang].submit;
  }
}

function updatePlaceholder() {
  const lang = getLang();
  const input = document.getElementById("feedbackInput");
  if (!input) return;
  input.placeholder =
    lang === "ja"
      ? "ご意見・ご要望・バグ報告など、お気軽にどうぞ。\n\nCtrl+Enter で送信できます。"
      : "Enter your feedback, feature requests, or bug reports here...\n\nPress Ctrl+Enter to submit.";
}

async function submitFeedback() {
  const lang = getLang();
  const M = MESSAGES[lang];
  const input = document.getElementById("feedbackInput");
  const btn = document.getElementById("submitBtn");
  const type = document.getElementById("feedbackType")?.value ?? "other";
  const text = input.value.trim();

  hideStatus();

  if (!text) {
    showStatus(M.empty, "error");
    input.focus();
    return;
  }

  if (text.length > 1000) {
    showStatus(M.tooLong, "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = M.sending;

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, lang, type }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    showStatus(M.success, "success", data.issue_url ?? null);
    input.value = "";
    updateCounter();

    if (!data.issue_url) {
      setTimeout(hideStatus, 10000);
    }
  } catch (err) {
    console.error("Feedback submit error:", err);
    showStatus(M.error, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = M.submit;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitBtn");
  const input = document.getElementById("feedbackInput");

  if (btn) btn.addEventListener("click", submitFeedback);

  if (input) {
    input.addEventListener("input", updateCounter);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submitFeedback();
    });
  }

  updateButtonLabel();
  updatePlaceholder();
  updateCounter();

  document.addEventListener("langChanged", () => {
    updateButtonLabel();
    updatePlaceholder();
  });
});
