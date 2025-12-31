// ==========================================
// 1. CONFIGURATION & URL PARAMS
// ==========================================
const API_BASE_URL = "http://127.0.0.1:8000/api";
const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const params = new URLSearchParams(window.location.search);
const subjectId = params.get('id');         // Passed from Roadmap
const subjectTitle = params.get('title');
const moduleTitle = params.get('moduleTitle'); // Optional filter

// ==========================================
// 2. SETUP HEADER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Auth Check
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = 'index.html'; return; }

    // Set Title
    const headerTitle = document.getElementById('subject-title');
    if (headerTitle) {
        if (moduleTitle && moduleTitle !== 'null' && moduleTitle !== 'undefined') {
            headerTitle.innerText = `${subjectTitle || 'Subject'} : ${decodeURIComponent(moduleTitle)}`;
        } else {
            headerTitle.innerText = `${subjectTitle || 'Subject Details'}`;
        }
    }

    // Load Default Tab (Video)
    switchTab('video');
});

// ==========================================
// 3. MAIN LOGIC: SWITCH TABS & FETCH
// ==========================================
async function switchTab(type) {
    const display = document.getElementById('content-display');
    const token = localStorage.getItem('token');
    
    if (!display) return;

    // --- UI: Update Active Tab ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.borderBottom = 'none';
        btn.style.opacity = '0.7';
    });
    
    // Find button that called this function and activate it
    // (Using a rough selector to find the button based on the onClick text)
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn'))
        .find(b => b.getAttribute('onclick').includes(`'${type}'`));
        
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.opacity = '1';
        
        let color = '#3b82f6'; // default
        if(type === 'video') color = '#ef4444';
        if(type === 'pdf') color = '#f59e0b';
        if(type === 'ppt') color = '#22c55e';
        activeBtn.style.borderBottom = `3px solid ${color}`;
    }

    // --- Show Loading ---
    display.innerHTML = '<div class="placeholder"><div class="spinner"></div> Loading content...</div>';

    try {
        // --- Fetch Data ---
        const response = await fetch(`${API_BASE_URL}/student/materials/${subjectId}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error("Failed to load materials");

        let materials = await response.json();

        // --- Filter Data by Type ---
        // If type is 'pdf', we also accept 'document' if your backend sends that
        const targetType = type.toLowerCase();
        
        const filtered = materials.filter(item => {
            // Optional: Filter by specific module if user came from a specific module node
            // if (moduleTitle && item.module !== moduleTitle) return false;

            return item.type === targetType;
        });

        if (filtered.length === 0) {
            display.innerHTML = `<div class="placeholder">No ${type.toUpperCase()} content found.</div>`;
            return;
        }

        renderGrid(filtered);

    } catch (error) {
        console.error(error);
        display.innerHTML = `<div class="placeholder" style="color:#ef4444;">Error loading content.</div>`;
    }
}

function renderGrid(items) {
    const display = document.getElementById('content-display');
    let html = '<div class="materials-grid">';

    items.forEach(item => {
        let fileUrl = '#';
        let iconClass = 'fa-file';
        let iconColor = '#6b7280';
        let bgIcon = '#f3f4f6';
        let btnText = 'Open File';
        let btnClass = 'open-btn'; // Default class

        // Style logic based on type
        if (item.type === 'video') {
            iconClass = 'fa-video'; iconColor = '#ef4444'; bgIcon = '#fee2e2';
            fileUrl = STORAGE_URL + item.filePath;
            btnText = 'Watch Video';
        } else if (item.type === 'pdf') {
            iconClass = 'fa-file-pdf'; iconColor = '#f59e0b'; bgIcon = '#fef3c7';
            fileUrl = STORAGE_URL + item.filePath;
            btnText = 'View PDF';
        } else if (item.type === 'ppt') {
            iconClass = 'fa-file-powerpoint'; iconColor = '#22c55e'; bgIcon = '#dcfce7';
            fileUrl = STORAGE_URL + item.filePath;
            btnText = 'Download PPT';
        } else if (item.type === 'quiz') {
            iconClass = 'fa-clipboard-question'; iconColor = '#3b82f6'; bgIcon = '#eff6ff';
            fileUrl = `QuizTaker.html?quizId=${item.id}`; 
            btnText = 'Start Quiz';
            btnClass = 'open-btn quiz-btn'; // Special style
        }

        html += `
        <div class="material-card" style="border-left: 4px solid ${iconColor}">
            <div class="card-top">
                <div class="file-icon" style="color: ${iconColor}; background: ${bgIcon};">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div class="file-info">
                    <div class="file-title" title="${item.title}">${item.title}</div>
                    <div class="file-type">${item.type.toUpperCase()}</div>
                </div>
            </div>
            <a href="${fileUrl}" target="_blank" class="${btnClass}">
                ${btnText} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.8em; margin-left:5px;"></i>
            </a>
        </div>`;
    });

    html += '</div>';
    display.innerHTML = html;
}