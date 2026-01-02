// LeetCode Stats Auto-Update Script
async function updateLeetCodeStats() {
    const username = 'sp0104';
    
    try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update live stats
        updateElement('total-solved', data.totalSolved);
        updateElement('easy-solved', data.easySolved);
        updateElement('medium-solved', data.mediumSolved);
        updateElement('hard-solved', data.hardSolved);
        updateElement('global-rank', data.ranking);
        
        console.log('✅ LeetCode stats updated:', data);
        
    } catch (error) {
        console.error('❌ API Error:', error);
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined && value !== null) {
        element.textContent = typeof value === 'number' ? value.toLocaleString() : value;
    }
}

// Auto-run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLeetCodeStats);
} else {
    updateLeetCodeStats();
}
