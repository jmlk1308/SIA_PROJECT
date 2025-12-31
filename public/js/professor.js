const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'professor-login.html';
        return;
    }

    // Load User Info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profNameEl = document.getElementById('prof-name');
    if(profNameEl) profNameEl.innerText = user.username || 'Professor';
    
    // Load Profile Inputs
    if(document.getElementById('prof-fullname')) document.getElementById('prof-fullname').value = user.username || '';
    if(document.getElementById('prof-email')) document.getElementById('prof-email').value = user.email || '';

    // Initial Load
    loadStats();
    loadSubjects(); // ✅ This now has better error handling
    loadLessons();
    loadQuizzes();
});

// Auth Headers
function getAuthHeaders(isMultipart = false) {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
    }
    return headers;
}

// Navigation
function switchView(viewName, btnElement) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`view-${viewName}`);
    if(target) target.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
}

// --- DATA LOADING ---

async function loadStats() {
    try {
        const res = await fetch(`${API_BASE_URL}/professor/stats`, { headers: getAuthHeaders() });
        if(res.ok) {
            const data = await res.json();
            const sStudents = document.getElementById('stat-students');
            const sLessons = document.getElementById('stat-lessons');
            const sQuizzes = document.getElementById('stat-quizzes');

            if(sStudents) sStudents.innerText = data.totalStudents || 0;
            if(sLessons) sLessons.innerText = data.totalLessons || 0;
            if(sQuizzes) sQuizzes.innerText = data.totalQuizzes || 0;
        }
    } catch(e) {
        console.error("Stats Load Error:", e);
    }
}

// ✅ FIXED LOAD SUBJECTS FUNCTION
async function loadSubjects() {
    try {
        console.log("Fetching subjects...");
        const res = await fetch(`${API_BASE_URL}/subjects`, { headers: getAuthHeaders() });
        
        if (!res.ok) {
            throw new Error(`Failed to load subjects: ${res.statusText}`);
        }

        const subjects = await res.json();
        
        // Safety check: ensure subjects is an array
        if(!Array.isArray(subjects)) {
            console.error("API Error: Expected array of subjects, got:", subjects);
            return;
        }

        if (subjects.length === 0) {
            console.warn("No subjects found in database. Ask Admin to create subjects.");
        }

        const options = '<option value="">Select Subject</option>' + 
            subjects.map(s => `<option value="${s.id}">${s.code} - ${s.title}</option>`).join('');
        
        const uploadSub = document.getElementById('uploadSubject');
        const quizSub = document.getElementById('quizSubject');
        
        if(uploadSub) uploadSub.innerHTML = options;
        if(quizSub) quizSub.innerHTML = options;

    } catch(e) {
        console.error("Error loading subjects:", e);
        // alert("Could not load subjects. Please check the console (F12) for details.");
    }
}

// --- LESSON FUNCTIONS ---

function openUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
}

const uploadForm = document.getElementById('uploadForm');
if(uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const subjectId = document.getElementById('uploadSubject').value;
        
        if(!subjectId) {
            alert("Please select a subject first.");
            return;
        }

        formData.append('subject_id', subjectId);
        formData.append('title', document.getElementById('uploadTitle').value);
        formData.append('module_name', document.getElementById('uploadModule').value);
        formData.append('file', document.getElementById('uploadFile').files[0]);

        try {
            const res = await fetch(`${API_BASE_URL}/lessons`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });

            if(res.ok) {
                alert("Lesson Uploaded!");
                document.getElementById('uploadModal').classList.remove('active');
                e.target.reset();
                loadLessons();
                loadStats();
            } else {
                const err = await res.json();
                alert("Upload Failed: " + (err.message || res.statusText));
            }
        } catch(e) { console.error(e); }
    });
}

async function loadLessons() {
    try {
        const res = await fetch(`${API_BASE_URL}/lessons`, { headers: getAuthHeaders() });
        const lessons = await res.json();
        const tbody = document.querySelector('#lessons-table tbody');
        if(tbody) {
            tbody.innerHTML = '';
            lessons.forEach(l => {
                const fileUrl = `http://127.0.0.1:8000/storage/${l.file_path}`;
                tbody.innerHTML += `
                    <tr>
                        <td>${l.title}</td>
                        <td>${l.subject ? l.subject.code : l.subject_id}</td>
                        <td>${l.module_name}</td>
                        <td><span class="status ${l.file_type === 'video' ? 'pending' : 'delivered'}">${l.file_type}</span></td>
                        <td>
                            <a href="${fileUrl}" target="_blank" style="margin-right:10px; color:#3182ce;"><i class="fas fa-eye"></i></a>
                            <i class="fas fa-trash" style="color:#e53e3e; cursor:pointer;" onclick="deleteLesson(${l.id})"></i>
                        </td>
                    </tr>
                `;
            });
        }
    } catch(e) {}
}

async function deleteLesson(id) {
    if(!confirm("Delete this lesson?")) return;
    try {
        await fetch(`${API_BASE_URL}/lessons/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        loadLessons();
        loadStats();
    } catch(e) {}
}

// --- QUIZ FUNCTIONS ---

function openQuizModal() {
    document.getElementById('quizModal').classList.add('active');
}

const quizForm = document.getElementById('quizForm');
if(quizForm) {
    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const subjectId = document.getElementById('quizSubject').value;

        if(!subjectId) {
            alert("Please select a subject first.");
            return;
        }

        const data = {
            subject_id: subjectId,
            title: document.getElementById('quizTitle').value,
            question: document.getElementById('quizPrompt').value
        };

        try {
            const res = await fetch(`${API_BASE_URL}/quizzes`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });

            if(res.ok) {
                alert("Quiz Created!");
                document.getElementById('quizModal').classList.remove('active');
                e.target.reset();
                loadQuizzes();
                loadStats();
            } else {
                alert("Quiz Creation Failed");
            }
        } catch(e) {}
    });
}

async function loadQuizzes() {
    try {
        const res = await fetch(`${API_BASE_URL}/quizzes`, { headers: getAuthHeaders() });
        const quizzes = await res.json();
        const tbody = document.querySelector('#quizzes-table tbody');
        if(tbody) {
            tbody.innerHTML = '';
            quizzes.forEach(q => {
                tbody.innerHTML += `
                    <tr>
                        <td>${q.title}</td>
                        <td>${q.subject ? q.subject.code : 'No Subject'}</td>
                        <td><span class="status delivered">AI Active</span></td>
                        <td>
                            <i class="fas fa-trash" style="color:#e53e3e; cursor:pointer;" onclick="deleteQuiz(${q.id})"></i>
                        </td>
                    </tr>
                `;
            });
        }
    } catch(e) {
        console.error("Error loading quizzes:", e);
    }
}

async function deleteQuiz(id) {
    if(!confirm("Delete this quiz?")) return;
    try {
        await fetch(`${API_BASE_URL}/quizzes/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        loadQuizzes();
        loadStats();
    } catch(e) {}
}

// --- PROFILE ---

const profileForm = document.getElementById('profile-form');
if(profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            fullName: document.getElementById('prof-fullname').value,
            email: document.getElementById('prof-email').value,
            password: document.getElementById('prof-password').value
        };

        try {
            const res = await fetch(`${API_BASE_URL}/professor/profile`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });

            if(res.ok) {
                alert("Profile Updated!");
                const user = JSON.parse(localStorage.getItem('user'));
                user.username = data.fullName;
                localStorage.setItem('user', JSON.stringify(user));
                document.getElementById('prof-name').innerText = user.username;
            }
        } catch(e) {}
    });
}

function logout() {
    localStorage.clear();
    window.location.href = 'professor-login.html';
}