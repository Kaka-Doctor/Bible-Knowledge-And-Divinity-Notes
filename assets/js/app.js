// Variable to store dynamic database notes
let currentFormData = {};

// Cache dashboard containers
const homeDashboard = document.getElementById('homepage-dashboard');
const submenuContainer = document.getElementById('submenu-container');
const submenuGrid = document.getElementById('submenu-grid');
const submenuTitle = document.getElementById('submenu-title');
const noteViewPanel = document.getElementById('note-view-panel');
const noteBody = document.getElementById('note-body');

/* ==========================================
   HISTORY ROUTER & NAVIGATION ENGINE
   ========================================== */

// 1. Initialize homepage state in history on first load
window.addEventListener('load', () => {
    history.replaceState({ view: 'home' }, "");
});

// 2. Navigation Actions (Pushes a state into history and updates UI)
function navigateToForm(formName) {
    history.pushState({ view: 'submenu', type: 'form', name: formName }, "");
    renderFormUI(formName);
}

function navigateToSchemes() {
    history.pushState({ view: 'submenu', type: 'schemes' }, "");
    renderSchemesUI();
}

function navigateToLogbooks() {
    history.pushState({ view: 'submenu', type: 'logbooks' }, "");
    renderLogbooksUI();
}

function navigateToPDF() {
    history.pushState({ view: 'submenu', type: 'pdf' }, "");
    renderPDFUI();
}

function navigateToNote(topicKey) {
    history.pushState({ view: 'note', key: topicKey }, "");
    renderNoteUI(topicKey);
}

// 3. Listen to Native Phone/Browser Back Button Presses (PopState Event)
window.addEventListener('popstate', (event) => {
    if (event.state) {
        handleStateNavigation(event.state);
    } else {
        // Fallback to homepage if no state is logged
        renderHomeUI();
    }
});

// Decides what UI to show depending on the current active history state
function handleStateNavigation(state) {
    if (state.view === 'home') {
        renderHomeUI();
    } else if (state.view === 'submenu') {
        if (state.type === 'form') renderFormUI(state.name);
        else if (state.type === 'schemes') renderSchemesUI();
        else if (state.type === 'logbooks') renderLogbooksUI();
        else if (state.type === 'pdf') renderPDFUI();
    } else if (state.view === 'note') {
        renderNoteUI(state.key);
    }
}

/* ==========================================
   UI RENDERING ENGINES (No History Pushes)
   ========================================== */

// Show Home Dashboard
function renderHomeUI() {
    homeDashboard.classList.remove('hidden');
    submenuContainer.classList.add('hidden');
    noteViewPanel.classList.add('hidden');
}

// Show Submenu Area
function renderSubmenuUI() {
    homeDashboard.classList.add('hidden');
    submenuContainer.classList.remove('hidden');
    noteViewPanel.classList.add('hidden');
}

// Render Form Topics Cards
async function renderFormUI(formName) {
    submenuTitle.innerText = formName.replace('form', 'Form ').toUpperCase() + " NOTES";
    submenuGrid.innerHTML = '<p class="placeholder-text">Retrieving chapters from database...</p>';
    renderSubmenuUI();

    try {
        const response = await fetch(`data/${formName}.json`);
        if (!response.ok) throw new Error("Data retrieval failed");
        
        currentFormData = await response.json();
        submenuGrid.innerHTML = ''; 

        Object.keys(currentFormData).forEach((key, index) => {
            const topic = currentFormData[key];
            const card = document.createElement('div');
            card.className = 'menu-card note-card';
            
            card.innerHTML = `
                <div class="card-icon">📖</div>
                <span style="font-size:0.75rem; font-weight:700; color:#94a3b8;">CHAPTER 0${index + 1}</span>
                <h3>${topic.title}</h3>
                <p>${topic.subtitle}</p>
            `;
            
            // Navigate to note details
            card.onclick = () => navigateToNote(key);
            submenuGrid.appendChild(card);
        });

    } catch (error) {
        submenuGrid.innerHTML = `<p class="placeholder-text" style="color:#ef4444;">Form files are currently loading into the repository.</p>`;
        console.error(error);
    }
}

// Render Schemes list
function renderSchemesUI() {
    submenuTitle.innerText = "BUY BIBLE SCHEMES";
    renderSubmenuUI();
    
    const schemesData = [
        { title: "Form One Scheme of Work", desc: "Complete term 1-3 compiled reference schedules.", link: "https://pay.example.com/form1-schemes" },
        { title: "Form Two Scheme of Work", desc: "Detailed breakdown of syllabus structures.", link: "https://pay.example.com/form2-schemes" },
        { title: "Form Three Scheme of Work", desc: "Comprehensive structural syllabus layout.", link: "https://pay.example.com/form3-schemes" },
        { title: "Form Four Scheme of Work", desc: "Complete assessment guide schedules.", link: "https://pay.example.com/form4-schemes" }
    ];

    submenuGrid.innerHTML = '';
    schemesData.forEach(scheme => {
        const card = document.createElement('div');
        card.className = 'menu-card market-card';
        card.innerHTML = `
            <div class="card-icon">💼</div>
            <h3>${scheme.title}</h3>
            <p>${scheme.desc}</p>
            <a href="${scheme.link}" target="_blank" class="buy-btn">Get Schemes Now</a>
        `;
        submenuGrid.appendChild(card);
    });
}

// Render Logbooks list
function renderLogbooksUI() {
    submenuTitle.innerText = "BUY BIBLE LOGBOOKS";
    renderSubmenuUI();

    const logbooksData = [
        { title: "Student Evaluation Logbook", desc: "Systematic record templates for academic checks.", link: "https://pay.example.com/student-logbook" },
        { title: "Teacher Divinity Logbook", desc: "Syllabus trackers and lesson completion books.", link: "https://pay.example.com/teacher-logbook" }
    ];

    submenuGrid.innerHTML = '';
    logbooksData.forEach(log => {
        const card = document.createElement('div');
        card.className = 'menu-card market-card';
        card.innerHTML = `
            <div class="card-icon">📊</div>
            <h3>${log.title}</h3>
            <p>${log.desc}</p>
            <a href="${log.link}" target="_blank" class="buy-btn">Order Logbook</a>
        `;
        submenuGrid.appendChild(card);
    });
}

// Render PDF Reference files
function renderPDFUI() {
    submenuTitle.innerText = "REFERENCE DOWNLOADS";
    renderSubmenuUI();

    const pdfData = [
        { title: "National Syllabus", desc: "Official Bible Knowledge Course Outline Booklet.", path: "documents/syllabus.pdf" },
        { title: "Divinity Study Guide", desc: "Advanced theological notes & structural guide.", path: "documents/study_guide.pdf" },
        { title: "Reference Handbook", desc: "General supplementary handbook for examinations.", path: "documents/reference_handbook.pdf" }
    ];

    submenuGrid.innerHTML = '';
    pdfData.forEach(pdf => {
        const card = document.createElement('div');
        card.className = 'menu-card pdf-card';
        card.innerHTML = `
            <div class="card-icon">📄</div>
            <h3>${pdf.title}</h3>
            <p>${pdf.desc}</p>
            <a href="${pdf.path}" target="_blank" class="view-btn">View/Download PDF</a>
        `;
        submenuGrid.appendChild(card);
    });
}

// Render Decoded Note
function renderNoteUI(topicKey) {
    const topic = currentFormData[topicKey];
    if (topic) {
        const decodedHTML = decodeUTF8Base64(topic.content);
        noteBody.innerHTML = `<h1>${topic.title}</h1>` + decodedHTML;
        
        homeDashboard.classList.add('hidden');
        submenuContainer.classList.add('hidden');
        noteViewPanel.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

// Safe Base64 UTF-8 Decrypter
function decodeUTF8Base64(base64Str) {
    try {
        return decodeURIComponent(atob(base64Str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch (e) {
        return atob(base64Str);
    }
}

/* ==========================================
   COPY AND INSPECTION PROTECTION SCRIPTS
   ========================================== */
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', function(e) {
    if (
        e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'a') || 
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J')
    ) {
        e.preventDefault();
        return false;
    }
});
