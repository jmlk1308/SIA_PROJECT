// home.js

// CONFIGURATION
// Adjust these to point to your actual backend URL
const API_BASE_URL = "http://127.0.0.1:8000/api";
const STORAGE_URL = "http://127.0.0.1:8000/storage/";

let courses = [];
let currentIndex = 0;
let currentAngle = 0;

// DOM Elements
const cardTrack = document.getElementById('card-track');
const bgContainer = document.getElementById('bg-container');
const titleEl = document.getElementById('hero-title');
const descEl = document.getElementById('hero-desc');
const actionBtn = document.getElementById('hero-btn');

// Check if we are on landing or student home
const isLandingPage = window.location.href.includes('landing.html');

document.addEventListener("DOMContentLoaded", () => {
    // Auth Check (skip if on public landing page)
    if (!isLandingPage) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
    }
    fetchCourses();
});

// 1. FETCH DATA
async function fetchCourses() {
    try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        if(!res.ok) throw new Error("Failed to fetch courses");
        
        const data = await res.json();
        
        if(data.length === 0) {
             titleEl.innerText = "NO COURSES";
             return;
        }

        // Map data to clean object
        courses = data.map(c => ({
            id: c.id,
            title: c.title,
            desc: c.description,
            // Fallback image if none exists
            image: c.file_path ? `${STORAGE_URL}${c.file_path}` : 'https://via.placeholder.com/400x400?text=No+Image',
            color: c.theme_color || '#3b82f6'
        }));

        initCarousel();

    } catch (err) {
        console.error(err);
        titleEl.innerText = "SERVER ERROR";
        descEl.innerText = "Is the backend running? (php artisan serve)";
        descEl.style.borderLeftColor = "red";
    }
}

// 2. BUILD THE 3D CAROUSEL
function initCarousel() {
    const numCards = courses.length;
    // Angle between cards (e.g., 3 cards = 120deg, 6 cards = 60deg)
    const anglePerCard = 360 / numCards;
    
    // Radius: Distance from center. 
    // We adjust it so cards slightly overlap in the background (cylinder effect)
    const radius = Math.round( (340 / 2) / Math.tan( Math.PI / numCards ) ) + 60;

    cardTrack.innerHTML = '';
    bgContainer.innerHTML = '<div class="bg-overlay"></div>';

    courses.forEach((course, i) => {
        // A. Create Background Slide
        const bg = document.createElement('div');
        bg.className = `bg-slide ${i === 0 ? 'active' : ''}`;
        bg.style.backgroundImage = `url('${course.image}')`;
        bgContainer.appendChild(bg);

        // B. Create Foreground Card
        const card = document.createElement('div');
        card.className = `course-card ${i === 0 ? 'active-card' : ''}`;
        card.style.backgroundImage = `url('${course.image}')`;
        
        // C. Position in 3D Space
        // Rotate the card to its angle, then push it out by radius
        card.style.transform = `rotateY(${i * anglePerCard}deg) translateZ(${radius}px)`;
        
        // Add Title inside the card (Visual polish)
        card.innerHTML = `<div class="card-inner-title">${course.title}</div>`;

        // Interaction
        card.onclick = () => rotateTo(i);

        cardTrack.appendChild(card);
    });

    updateUI(0);
}

// 3. ROTATION LOGIC
function rotateTo(index) {
    if(index === currentIndex) {
        // If clicking the already active card, enter the course
        enterCourse(courses[index].id);
        return;
    }

    const numCards = courses.length;
    const anglePerCard = 360 / numCards;

    // Calculate shortest spin direction
    let diff = index - currentIndex;
    if (diff > numCards / 2) diff -= numCards;
    if (diff < -numCards / 2) diff += numCards;

    currentAngle -= (diff * anglePerCard); // Rotate the track
    currentIndex = index;

    // A. Rotate Track
    cardTrack.style.transform = `rotateY(${currentAngle}deg)`;

    // B. Highlight Active Card
    document.querySelectorAll('.course-card').forEach((c, i) => {
        if(i === currentIndex) {
            c.classList.add('active-card');
        } else {
            c.classList.remove('active-card');
        }
    });

    // C. Update Background
    document.querySelectorAll('.bg-slide').forEach((b, i) => {
        if(i === currentIndex) b.classList.add('active');
        else b.classList.remove('active');
    });

    // D. Update Text Content
    updateUI(index);
}

// 4. UPDATE TEXT & COLORS
function updateUI(index) {
    const course = courses[index];
    
    // Text Fade Effect
    titleEl.style.opacity = 0;
    descEl.style.opacity = 0;

    setTimeout(() => {
        titleEl.innerText = course.title;
        descEl.innerText = course.desc;
        
        // Update accent color (button & border line)
        document.documentElement.style.setProperty('--primary', course.color);
        
        // Update Button Text based on page
        if(actionBtn) {
            actionBtn.innerText = isLandingPage ? "LOGIN TO START" : "VIEW LESSONS";
            actionBtn.style.backgroundColor = course.color;
        }

        // Text Fade In
        titleEl.style.opacity = 1;
        descEl.style.opacity = 1;
    }, 200);
}

// 5. NAVIGATION
function enterCourse(id) {
    if(isLandingPage) {
        window.location.href = 'index.html'; // Go to login
    } else {
        window.location.href = `dashboard.html?course=${id}`; // Go to dashboard
    }
}

// Button Listeners
document.getElementById('prevBtn').onclick = () => {
    let nextIndex = (currentIndex - 1 + courses.length) % courses.length;
    rotateTo(nextIndex);
};

document.getElementById('nextBtn').onclick = () => {
    let nextIndex = (currentIndex + 1) % courses.length;
    rotateTo(nextIndex);
};

// Logout Helper
function logout() {
    if(confirm("Are you sure?")) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}