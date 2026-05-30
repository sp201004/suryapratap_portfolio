// =====================================================================
// LeetCode Stats — live updater
// Sources:
//   • leetcode-api-faisalshohag.vercel.app — solved breakdown (fast, Vercel)
//   • coderme.vercel.app                   — current contest rating (fast)
//   • alfa-leetcode-api.onrender.com       — contest history + global rank + badge
// Render free tier has cold starts; we use a short timeout + one retry so
// the slowest endpoint doesn't hang the page. Hardcoded HTML fallbacks remain
// visible until live data lands.
// =====================================================================

const LEETCODE_USERNAME = "sp0104";
const FAISAL_API   = `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`;
const CODERME_API  = `https://coderme.vercel.app/leetcode/${LEETCODE_USERNAME}`;
const ALFA_CONTEST = `https://alfa-leetcode-api.onrender.com/userContestRankingInfo/${LEETCODE_USERNAME}`;

// Aborts long-running requests so a sleeping Render dyno can't block UI.
async function fetchJSON(url, { timeoutMs = 8000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// Retry once on timeout / 5xx — useful for Render cold starts.
async function fetchJSONRetry(url, opts) {
  try {
    return await fetchJSON(url, opts);
  } catch (err) {
    // wait a moment and try once more with a longer timeout
    await new Promise(r => setTimeout(r, 1500));
    return await fetchJSON(url, { timeoutMs: 18000, ...opts });
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el || value === undefined || value === null) return;
  el.textContent = typeof value === "number" ? value.toLocaleString() : value;
}

function updateTotalsDenominators(data) {
  const setDenom = (id, count) => {
    const el = document.getElementById(id);
    if (el && typeof count === "number") {
      el.textContent = count.toLocaleString();
    }
  };
  setDenom("total-easy", data.totalEasy);
  setDenom("total-medium", data.totalMedium);
  setDenom("total-hard", data.totalHard);
}

async function updateLeetCodeStats() {
  // Run all three in parallel so the slow one doesn't hold up the fast ones.
  await Promise.allSettled([
    // 1) Solved breakdown — Faisal (Vercel, fast)
    fetchJSON(FAISAL_API).then(stats => {
      setText("total-solved", stats.totalSolved);
      setText("easy-solved",  stats.easySolved);
      setText("medium-solved", stats.mediumSolved);
      setText("hard-solved",  stats.hardSolved);
      updateTotalsDenominators(stats);
      console.log("✅ LeetCode: solved counts updated");
    }).catch(err => console.warn("solved fetch failed:", err.message)),

    // 2) Current contest rating — coderme (Vercel, fast)
    fetchJSON(CODERME_API).then(cm => {
      if (typeof cm?.rating === "number") {
        setText("contest-rating", Math.round(cm.rating));
      }
      console.log("✅ LeetCode: contest rating updated");
    }).catch(err => console.warn("contest rating fetch failed:", err.message)),

    // 3) Contest rank + max rating + badge — alfa (Render, slower; retry once)
    fetchJSONRetry(ALFA_CONTEST).then(c => {
      const ranking = c?.userContestRanking?.globalRanking;
      if (typeof ranking === "number") setText("global-rank", ranking);

      const history = c?.userContestRankingHistory;
      if (Array.isArray(history) && history.length) {
        const peak = history.reduce(
          (m, h) => (typeof h.rating === "number" && h.rating > m ? h.rating : m),
          0
        );
        if (peak > 0) setText("max-rating", Math.round(peak));
      }
      const badge = c?.userContestRanking?.badge?.name;
      if (badge) setText("contest-badge", badge);
      console.log("✅ LeetCode: contest rank + max + badge updated");
    }).catch(err => console.warn("contest history fetch failed:", err.message)),
  ]);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateLeetCodeStats);
} else {
  updateLeetCodeStats();
}
