// ==========================================
// 1. INIT & GLOBAL VARIABLES
// ==========================================
const params = new URLSearchParams(window.location.search);
const courseId = params.get('course'); 
let allSubjects = [];
let currentYearFilter = "All Years"; // Track active filter
let currentStudent = null;

const API_BASE_URL = "http://127.0.0.1:8000/api";

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Check Auth
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Load User
    const userData = localStorage.getItem('user');
    if (userData) {
        currentStudent = JSON.parse(userData);
        const profileNameEl = document.querySelector('.profile-name');
        if (profileNameEl && currentStudent.username) {
            profileNameEl.textContent = currentStudent.username;
        }
    }

    // Initialize UI
    if (courseId) {
        fetchCourseTitle();
    } else {
        document.getElementById('dashboard-title').innerText = "All Subjects";
    }

    setupFilterDropdown(); // ✅ Setup Filter Listeners
    loadRecentViews();     // ✅ Load Recent Subjects
    fetchEnrolledSubjects(); 
});

// ==========================================
// 3. FETCH COURSE TITLE
// ==========================================
async function fetchCourseTitle() {
    try {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}`);
        if(res.ok) {
            const course = await res.json();
            document.getElementById('dashboard-title').innerText = course.title.toUpperCase();
        }
    } catch (err) {
        console.error("Error fetching course title:", err);
    }
}

// ==========================================
// 4. FETCH ENROLLED SUBJECTS
// ==========================================
async function fetchEnrolledSubjects() {
    const token = localStorage.getItem('token');
    const container = document.getElementById('cardsGrid'); 

    try {
        let url = `${API_BASE_URL}/student/subjects`;
        if (courseId) {
            url += `?course_id=${courseId}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        allSubjects = await response.json();
        renderSubjects(); // Initial Render
        
    } catch (error) {
        console.error('Error fetching subjects:', error);
        if(container) {
            container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:gray;">Failed to load subjects. Is the backend running?</p>';
        }
    }
}

// ==========================================
// 5. RENDER & FILTER LOGIC (FIXED)
// ==========================================
function setupFilterDropdown() {
    const btn = document.getElementById('filterBtn');
    const dropdown = document.getElementById('filterDropdown');
    const btnText = document.getElementById('filterBtnText');
    const options = document.querySelectorAll('.filter-option');

    // Toggle Dropdown
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // Handle Option Click
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            currentYearFilter = opt.getAttribute('data-value'); // e.g., "1st Year" or "All Years"
            btnText.innerText = currentYearFilter;
            dropdown.classList.remove('show');
            renderSubjects(); // Re-render with new filter
        });
    });

    // Close when clicking outside
    window.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });
}

function renderSubjects() {
    const container = document.getElementById('cardsGrid');
    if (!container) return;

    // ✅ FILTER LOGIC
    let filtered = allSubjects;
    if (currentYearFilter !== "All Years") {
        // Convert "1st Year" -> 1, "2nd Year" -> 2
        const yearNum = parseInt(currentYearFilter); 
        filtered = allSubjects.filter(s => s.year_level === yearNum);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:gray; padding:40px;">No subjects found for this year level.</p>';
        return;
    }

    container.innerHTML = filtered.map(subject => `
        <div class="subject-card" onclick="handleSubjectClick(${subject.id})" 
             style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.2s; border-left: 5px solid #3b82f6; display: flex; flex-direction: column; gap: 10px;">
            
            <div style="font-size: 0.85rem; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px;">
                ${subject.code}
            </div>
            
            <div style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">
                ${subject.title}
            </div>
            
            <div style="font-size: 0.9rem; color: #6b7280; display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                <span>Year ${subject.year_level} • Sem ${subject.semester}</span>
                <i class="fas fa-arrow-right" style="color: #3b82f6;"></i>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 6. RECENT VIEW LOGIC (FIXED)
// ==========================================
function handleSubjectClick(id) {
    // 1. Find the full subject object
    const subject = allSubjects.find(s => s.id === id);
    
    if (subject) {
        // 2. Get existing recents
        let recents = JSON.parse(localStorage.getItem('recentSubjects')) || [];
        
        // 3. Remove duplicate if exists (to move it to top)
        recents = recents.filter(s => s.id !== id);
        
        // 4. Add to front
        recents.unshift({
            id: subject.id,
            title: subject.title,
            year: subject.year_level,
            code: subject.code
        });
        
        // 5. Keep only top 5
        if (recents.length > 5) recents.pop();
        
        // 6. Save
        localStorage.setItem('recentSubjects', JSON.stringify(recents));
    }

    // 7. Navigate
    goToRoadmap(subject.id, subject.title);
}

function loadRecentViews() {
    const recentList = document.querySelector('.recent-list');
    if (!recentList) return;

    const recents = JSON.parse(localStorage.getItem('recentSubjects')) || [];

    if (recents.length === 0) {
        recentList.innerHTML = '<p style="color:#aaa; font-size:0.9rem;">No recently viewed subjects.</p>';
        return;
    }

    recentList.innerHTML = recents.map(sub => `
        <div class="recent-item" onclick="goToRoadmap(${sub.id}, '${sub.title}')" style="cursor:pointer;">
            <span class="recent-title">${sub.title}</span>
            <span class="recent-year">${sub.year}${getOrdinal(sub.year)} Year</span>
        </div>
    `).join('');
}

function getOrdinal(n) {
    return ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th";
}

function goToRoadmap(id, title) {
    window.location.href = `Roadmap.html?subjectId=${id}&title=${encodeURIComponent(title)}`;
}

// ==========================================
// 7. UTILITIES
// ==========================================
function logout() {
    if(confirm("Logout?")) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

function toggleProfileDropdown() {
    const dd = document.getElementById('profile-dropdown');
    if(dd) dd.classList.toggle('show');
}

window.onclick = function(e) {
    if (!e.target.closest('.profile-dropdown-wrapper')) {
        const dd = document.getElementById('profile-dropdown');
        if (dd && dd.classList.contains('show')) dd.classList.remove('show');
    }
}