// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const BASE_URL = "http://127.0.0.1:8000"; 
const API_URL = "http://127.0.0.1:8000/api/admin";

// State Variables
let isEditCourseMode = false;
let isEditSubjectMode = false;
let selectedCourseId = null; 
let allLogs = []; 
let selectedSubjectId = null;

// ✅ HELPER: Get Auth Headers
function getAuthHeaders(isMultipart = false) {
    const token = localStorage.getItem('auth_token');
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
    }
    return headers;
}

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Load Initial Data
    loadUsers();
    loadCourses();
    loadCoursesForDropdown(); 
    loadProfile();

    // Initial state for user form role selector
    if(document.getElementById('role')) {
        toggleCourseInput();
    }
});

function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Show selected view
    const view = document.getElementById(viewId);
    if(view) view.classList.add('active');

    // Highlight nav item
    const navItem = document.querySelector(`.nav-item[onclick="switchView('${viewId}')"]`);
    if(navItem) navItem.classList.add('active');

    // Refresh data for the specific view
    if (viewId === 'user-management') { loadUsers(); loadCoursesForDropdown(); }
    if (viewId === 'courses-management') loadCourses();
    if (viewId === 'subjects-management') loadSubjectsView();
    if (viewId === 'activity-logs') loadActivityLogs();
    if (viewId === 'profile-management') loadProfile();
}

// ==========================================
// 3. USER MANAGEMENT
// ==========================================

function toggleCourseInput() {
    const roleSelect = document.getElementById('role');
    const courseGroup = document.getElementById('course-group');
    if (roleSelect && courseGroup) {
        courseGroup.style.display = (roleSelect.value === 'professor') ? 'block' : 'none';
        const courseInput = document.getElementById('user-course');
        if (roleSelect.value === 'professor') {
            courseInput.setAttribute('required', 'required');
        } else {
            courseInput.removeAttribute('required');
            courseInput.value = "";
        }
    }
}

async function loadCoursesForDropdown() {
    try {
        const res = await fetch(`${BASE_URL}/api/courses`, { headers: getAuthHeaders() });
        if(res.ok) {
            const courses = await res.json();
            const userSelect = document.getElementById('user-course');
            
            if(userSelect) {
                userSelect.innerHTML = '<option value="">Select Course</option>';
                courses.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id; 
                    opt.innerText = c.title;
                    userSelect.appendChild(opt);
                });
            }
        }
    } catch (err) { console.error("Error loading dropdown:", err); }
}

async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/users`, { headers: getAuthHeaders() });
        
        // ✅ Handle Auth Errors
        if (res.status === 401) {
            alert("Session expired. Please login again.");
            window.location.href = 'admin-login.html';
            return;
        }
        if (res.status === 403) {
            alert("Access Denied. You do not have Admin permissions.");
            return;
        }

        const users = await res.json();
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if(document.getElementById('count-users')) {
            document.getElementById('count-users').innerText = users.length || 0;
        }

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No users found.</td></tr>';
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        users.forEach(user => {
            const courseDisplay = user.course_id ? `Course ID: ${user.course_id}` : '-';
            
            // Prevent deleting yourself
            let deleteBtn = `
                <button class="action-btn-icon delete-btn" onclick="deleteUser(${user.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>`;
            
            if (user.id === currentUser.id) {
                deleteBtn = `<span style="color:#cbd5e0; font-size:0.8rem;">(You)</span>`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:30px; height:30px; background:#e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                            <i class="fas fa-user" style="color:#718096; font-size:0.8rem;"></i>
                        </div>
                        ${user.username}
                    </div>
                </td>
                <td><span class="role-badge role-${user.role}">${user.role.toUpperCase()}</span></td>
                <td>${courseDisplay}</td>
                <td>${deleteBtn}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) { 
        console.error(err); 
        const tbody = document.getElementById('users-table-body');
        if(tbody) tbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Error connecting to server.</td></tr>`;
    }
}

function showAddUserModal() {
    document.getElementById('user-form').reset();
    toggleCourseInput();
    document.getElementById('user-modal').classList.add('active');
}

function closeUserModal() {
    document.getElementById('user-modal').classList.remove('active');
}

// Create User Form Submit
const userForm = document.getElementById('user-form');
if(userForm) {
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const role = document.getElementById('role').value;
        const courseSelect = document.getElementById('user-course');
        const courseId = (role === 'professor' && courseSelect) ? courseSelect.value : null;

        const data = {
            username: document.getElementById('username').value,
            email: document.getElementById('username').value + "@uep.edu.ph", // Auto-gen email
            password: document.getElementById('password').value,
            role: role,
            courseId: courseId
        };

        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("User created successfully!");
                closeUserModal();
                loadUsers();
            } else {
                const msg = await res.json();
                alert("Error: " + (msg.message || "Failed to create user"));
            }
        } catch (err) { console.error(err); }
    });
}

async function deleteUser(id) {
    if(!confirm("Are you sure you want to delete this user?")) return;
    try {
        const res = await fetch(`${API_URL}/users/${id}`, { 
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if(res.ok) {
            loadUsers();
        } else {
            const data = await res.json();
            alert(data.message || "Failed to delete user");
        }
    } catch (err) { console.error(err); }
}

// ==========================================
// 4. COURSE MANAGEMENT
// ==========================================

async function loadCourses() {
    try {
        const res = await fetch(`${BASE_URL}/api/courses`, { headers: getAuthHeaders() });
        const courses = await res.json();
        const grid = document.getElementById('courses-grid');
        grid.innerHTML = '';

        if(document.getElementById('count-courses')) {
            document.getElementById('count-courses').innerText = courses.length;
        }

        courses.forEach(course => {
            const theme = course.theme_color || '#3182ce';
            let backgroundStyle = `background: ${theme};`;

            if (course.file_path) {
                const imageUrl = `${BASE_URL}/storage/${course.file_path}`;
                backgroundStyle = `background-image: url('${imageUrl}'); background-size: cover; background-position: center;`;
            }

            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <div class="course-header-banner" style="${backgroundStyle}">
                    <div class="course-code-badge">ID: ${course.id}</div>
                </div>
                <div class="course-body">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description || 'No description.'}</p>
                    <div class="course-footer">
                         <button class="action-btn-icon delete-btn" onclick="deleteCourse('${course.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        loadCoursesForDropdown(); // Refresh dropdowns elsewhere
        
    } catch (err) { console.error(err); }
}

function openAddCourseModal() {
    document.getElementById('course-modal-title').innerText = "Add New Course";
    document.getElementById('course-form').reset();
    isEditCourseMode = false;
    document.getElementById('course-modal').classList.add('active');
}

function closeCourseModal() {
    document.getElementById('course-modal').classList.remove('active');
}

// Course Form Submit
const courseForm = document.getElementById('course-form');
if (courseForm) {
    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', document.getElementById('course-name').value);
        formData.append('description', document.getElementById('course-description').value);
        formData.append('themeColor', document.getElementById('course-color').value);

        const fileInput = document.getElementById('course-image');
        if (fileInput && fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        let url = `${BASE_URL}/api/courses`;
        // No edit mode implemented in UI yet, but logic is ready
        if (isEditCourseMode) {
            const courseId = document.getElementById('course-code').value; // hidden field
            url = `${BASE_URL}/api/courses/${courseId}`;
            formData.append('_method', 'PUT'); 
        }

        try {
            const res = await fetch(url, {
                method: 'POST', // Use POST for FormData with files
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
                body: formData
            });

            if (res.ok) {
                alert(isEditCourseMode ? "Course updated!" : "Course created!");
                closeCourseModal();
                loadCourses();
            } else {
                const data = await res.json();
                alert("Error: " + (data.message || "Failed to save."));
            }
        } catch (err) {
            console.error("Save Error:", err);
            alert("System Error: " + err.message);
        }
    });
}

async function deleteCourse(id) {
    if(!confirm("Delete course? This will remove all linked subjects.")) return;
    try {
        await fetch(`${BASE_URL}/api/courses/${id}`, { 
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        loadCourses();
    } catch (err) { console.error(err); }
}

// ==========================================
// 5. SUBJECT MANAGEMENT
// ==========================================

async function loadSubjectsView() {
    try {
        const res = await fetch(`${BASE_URL}/api/courses`, { headers: getAuthHeaders() });
        const courses = await res.json();
        
        const tabsContainer = document.getElementById('subject-course-tabs');
        tabsContainer.innerHTML = '';

        if (courses.length > 0) {
            courses.forEach((course, index) => {
                const tab = document.createElement('div');
                tab.className = `course-tab ${index === 0 ? 'active' : ''}`;
                tab.innerHTML = `<div class="course-dot"></div> ${course.title}`;
                tab.onclick = () => selectSubjectCourse(course.id, course.title, tab);
                tabsContainer.appendChild(tab);
            });

            // Select first by default
            selectSubjectCourse(courses[0].id, courses[0].title, tabsContainer.firstChild);
        }
    } catch (err) { console.error(err); }
}

function selectSubjectCourse(courseId, courseTitle, tabElement) {
    selectedCourseId = courseId;
    
    document.querySelectorAll('.course-tab').forEach(t => t.classList.remove('active'));
    if(tabElement) tabElement.classList.add('active');

    document.getElementById('subject-banner').style.display = 'flex';
    document.getElementById('selected-course-title').innerText = courseTitle;
    document.getElementById('subjects-grid').style.display = 'flex';

    loadSubjectsForGrid(courseId);
}

async function loadSubjectsForGrid(courseId) {
    // Clear previous
    [1,2,3,4].forEach(y => {
        const el = document.getElementById(`year-${y}-content`);
        if(el) el.innerHTML = '';
    });

    try {
        const res = await fetch(`${BASE_URL}/api/subjects?courseId=${courseId}`, { headers: getAuthHeaders() });
        const subjects = await res.json();

        subjects.forEach(sub => {
            const card = document.createElement('div');
            card.className = 'subject-item-card';
            card.innerHTML = `
                <div class="sub-actions">
                    <i class="fas fa-trash sub-icon-btn del" onclick="deleteSubject(${sub.id})"></i>
                </div>
                <span class="sub-sem-badge">${sub.semester === 1 ? '1st' : '2nd'} Sem</span>
                <div class="sub-title">${sub.title}</div>
                <div class="sub-code">${sub.code}</div>
            `;
            const col = document.getElementById(`year-${sub.year_level}-content`);
            if(col) col.appendChild(card);
        });
    } catch (err) { console.error(err); }
}

function openAddSubjectModal() {
    if (!selectedCourseId) {
        alert("Please select a course tab first.");
        return;
    }
    document.getElementById('sub-course-id').value = selectedCourseId;
    document.getElementById('subject-modal').classList.add('active');
}

function closeSubjectModal() {
    document.getElementById('subject-modal').classList.remove('active');
}

// Subject Form Submit
const subjectForm = document.getElementById('subject-form');
if (subjectForm) {
    subjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            courseId: document.getElementById('sub-course-id').value,
            code: document.getElementById('sub-code').value,
            title: document.getElementById('sub-title').value,
            yearLevel: document.getElementById('sub-year').value,
            semester: document.getElementById('sub-sem').value
        };

        try {
            const res = await fetch(`${BASE_URL}/api/subjects`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Subject added successfully!");
                closeSubjectModal();
                loadSubjectsForGrid(data.courseId);
                subjectForm.reset();
            } else {
                const result = await res.json();
                alert("Error: " + (result.message || "Failed to add subject"));
            }
        } catch (err) { console.error(err); }
    });
}

async function deleteSubject(id) {
    if(!confirm("Delete this subject?")) return;
    try {
        await fetch(`${BASE_URL}/api/subjects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        loadSubjectsForGrid(selectedCourseId); // Refresh
    } catch(e) { console.error(e); }
}

// ==========================================
// 6. ACTIVITY LOGS
// ==========================================

async function loadActivityLogs() {
    const tbody = document.getElementById('logs-table-body');
    if(!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
        const res = await fetch(`${API_URL}/logs`, { headers: getAuthHeaders() });
        const logs = await res.json();
        tbody.innerHTML = '';

        logs.forEach(log => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${log.username}</td>
                <td>${log.action}</td>
                <td>${log.role}</td>
                <td>${log.timestamp}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) { console.error(err); }
}

// ==========================================
// 7. PROFILE
// ==========================================
async function loadProfile() {
    try {
        const res = await fetch(`${API_URL}/profile`, { headers: getAuthHeaders() });
        if (res.ok) {
            const user = await res.json();
            document.getElementById('profile-username').value = user.username;
            document.getElementById('profile-email').value = user.email;
            
            if(user.profilePicture) {
                const img = document.getElementById('profile-img');
                const icon = document.getElementById('profile-icon');
                if(img) {
                    img.src = `${BASE_URL}/storage/${user.profilePicture}`;
                    img.style.display = 'block';
                }
                if(icon) icon.style.display = 'none';
            }
        }
    } catch (err) { console.error(err); }
}

// ==========================================
// 8. LOGOUT
// ==========================================
async function logout() {
    if(confirm("Logout?")) {
        try {
            await fetch(`${BASE_URL}/api/logout`, { method: 'POST', headers: getAuthHeaders() });
        } catch(e){}
        localStorage.clear();
        window.location.href = 'admin-login.html';
    }
}