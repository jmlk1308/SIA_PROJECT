// ==========================================
// 1. CONFIGURATION & SETUP
// ==========================================
const params = new URLSearchParams(window.location.search);

// IMPORTANT: Dashboard sends 'subjectId', but some links might send 'id'
const subjectId = params.get('subjectId') || params.get('id'); 
const subjectTitle = params.get('title');

const titleElement = document.getElementById('roadmap-title');
const container = document.getElementById('timeline-tracks');
const API_BASE_URL = "http://127.0.0.1:8000/api";

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Auth Check
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Set Page Title
    if (titleElement) {
        titleElement.innerText = subjectTitle ? decodeURIComponent(subjectTitle) : "Subject Roadmap";
    }

    // 3. Load Data
    if (subjectId) {
        fetchRoadmap(subjectId, token);
    } else {
        container.innerHTML = "<p class='text-center' style='padding:20px;'>Error: No Subject ID found.</p>";
    }
});

// ==========================================
// 3. FETCH DATA FROM LARAVEL
// ==========================================
async function fetchRoadmap(id, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/student/roadmap/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Failed to load roadmap");

        const items = await response.json();

        if (items.length === 0) {
            container.innerHTML = `
                <div style='text-align:center; padding: 40px; color: gray;'>
                    <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 10px; opacity:0.5;"></i><br>
                    No content uploaded for this subject yet.
                </div>`;
            return;
        }

        renderTimeline(items);

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p style='text-align:center; color:#ef4444; padding:20px;'>Connection Error. Is the backend running?</p>";
    }
}

// ==========================================
// 4. RENDER TIMELINE
// ==========================================
function renderTimeline(items) {
    container.innerHTML = ''; 

    items.forEach((item, index) => {
        const isLeft = index % 2 === 0;
        const sideClass = isLeft ? 'left' : 'right';
        const count = index + 1;

        // Visual distinction between Lesson and Quiz
        let icon = 'fa-book-open';
        let colorClass = 'status-active'; // Blue
        let label = item.module_name || 'Lesson Module';
        let pinColor = '#3b82f6'; // Blue

        if (item.type === 'quiz') {
            icon = 'fa-pen-to-square';
            colorClass = 'status-quiz'; // Orange
            label = 'Assessment / Quiz';
            pinColor = '#f59e0b'; // Orange
        }

        const html = `
        <div class="module-row ${sideClass}">
            <div class="module-card" onclick="openItem('${item.type}', ${item.id}, '${item.title}')" style="border-top-color: ${pinColor}">
                <div class="module-title">
                    <i class="fas ${icon}" style="color: ${pinColor}; margin-right: 10px;"></i>
                    ${item.title}
                </div>
                <div class="module-desc">${label}</div>
                <span class="status-badge ${colorClass}">
                    ${item.type.toUpperCase()}
                </span>
            </div>
            
            <div class="module-marker" style="border-color: ${pinColor}; color: ${pinColor};">
                ${count}
            </div>
            
            <div class="module-card spacer" style="visibility: hidden; pointer-events: none;"></div>
        </div>`;

        container.innerHTML += html;
    });
}

// ==========================================
// 5. NAVIGATION (THE FIX)
// ==========================================
function openItem(type, itemId, itemTitle) {
    // When clicking a module, we go to the Subject Content page.
    // We pass the 'id' (Subject ID) so it knows which subject to load.
    // 'itemId' (Lesson/Quiz ID) can be used if we want to filter specific content later.

    const encodedTitle = encodeURIComponent(subjectTitle || 'Subject');
    
    // Redirect to Subject.html (The File Viewer)
    // We send 'id' because Subject.js expects 'id' to load the materials.
    window.location.href = `Subject.html?id=${subjectId}&title=${encodedTitle}`;
}