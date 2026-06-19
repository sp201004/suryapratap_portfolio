// =====================================================================
// LeetCode Stats — live updater
// Primary Source:
//   • leetcode-api-pied.vercel.app/user/<username>
//     → solved counts (easy/medium/hard/total), contest badge, ranking
// Secondary Sources:
//   • leetcode-api-faisalshohag.vercel.app — total problem counts per
//     difficulty (denominators: 950, 2069, 943 etc.)
//   • alfa-leetcode-api.onrender.com — contest rating + max rating
// Hardcoded HTML fallbacks remain visible until live data lands.
// =====================================================================

const LEETCODE_USERNAME = "sp0104";

// Primary — solved counts, badge, ranking
const PRIMARY_API = `https://leetcode-api-pied.vercel.app/user/${LEETCODE_USERNAME}`;

// Total available problems per difficulty (denominators)
const FAISAL_API = `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`;

// Contest rating history (max rating calculation)
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

// Helper to find a difficulty entry from the submitStats arrays
function findByDifficulty(arr, diff) {
  return arr?.find(e => e.difficulty === diff);
}

async function updateLeetCodeStats() {
  // Run primary + secondary in parallel
  await Promise.allSettled([
    // ─── 1) Primary API — solved counts, totals, badge, ranking ───
    fetchJSON(PRIMARY_API).then(data => {
      const ac = data?.submitStats?.acSubmissionNum;

      if (Array.isArray(ac)) {
        const all    = findByDifficulty(ac, "All");
        const easy   = findByDifficulty(ac, "Easy");
        const medium = findByDifficulty(ac, "Medium");
        const hard   = findByDifficulty(ac, "Hard");

        if (all) {
          setText("total-solved",   all.count);
          setText("about-dsa-count", all.count);  // "About Me" section
        }
        if (easy)   setText("easy-solved",    easy.count);
        if (medium) setText("medium-solved",  medium.count);
        if (hard)   setText("hard-solved",    hard.count);
      }

      // Contest badge
      if (data?.contestBadge?.name) {
        setText("contest-badge", data.contestBadge.name);
        setText("about-badge",   data.contestBadge.name);  // "About Me" section
      }

      // Global ranking
      if (typeof data?.profile?.ranking === "number") {
        setText("global-rank", data.profile.ranking);
      }

      console.log("✅ LeetCode [primary]: solved counts, badge, rank updated");
    }).catch(err => console.warn("primary API failed:", err.message)),

    // ─── 2) Faisal API — total problem counts (denominators) ───
    fetchJSON(FAISAL_API).then(data => {
      if (typeof data?.totalEasy === "number")   setText("total-easy",   data.totalEasy);
      if (typeof data?.totalMedium === "number") setText("total-medium", data.totalMedium);
      if (typeof data?.totalHard === "number")   setText("total-hard",   data.totalHard);
      console.log("✅ LeetCode [faisal]: total problem counts updated");
    }).catch(err => console.warn("faisal API failed:", err.message)),

    // ─── 3) Alfa API — contest rating + max rating ───
    fetchJSONRetry(ALFA_CONTEST).then(c => {
      const rating = c?.userContestRanking?.rating;
      if (typeof rating === "number") {
        setText("contest-rating", Math.round(rating));
        setText("about-contest-rating", Math.round(rating));  // "About Me" section
      }

      // Compute max from history
      const history = c?.userContestRankingHistory;
      if (Array.isArray(history) && history.length) {
        const peak = history.reduce(
          (m, h) => (typeof h.rating === "number" && h.rating > m ? h.rating : m),
          0
        );
        if (peak > 0) setText("max-rating", Math.round(peak));
      }

      // Global ranking from contest data (more contest-specific; override if available)
      const contestRank = c?.userContestRanking?.globalRanking;
      if (typeof contestRank === "number") {
        setText("global-rank", contestRank);
      }

      console.log("✅ LeetCode [alfa]: contest rating + max updated");
    }).catch(err => console.warn("contest history fetch failed:", err.message)),
  ]);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateLeetCodeStats);
} else {
  updateLeetCodeStats();
}
