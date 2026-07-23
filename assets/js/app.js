// Variable to store dynamic database notes
let currentFormData = {};

// Cache dashboard containers
const homeDashboard = document.getElementById('homepage-dashboard');
const submenuContainer = document.getElementById('submenu-container');
const submenuGrid = document.getElementById('submenu-grid');
const submenuTitle = document.getElementById('submenu-title');
const noteViewPanel = document.getElementById('note-view-panel');
const noteBody = document.getElementById('note-body');

// 1. Navigation Flow control
function showHomepage() {
    homeDashboard.classList.remove('hidden');
    submenuContainer.classList.add('hidden');
    noteViewPanel.classList.add('hidden');
}

function showSubmenu() {
    homeDashboard.classList.add('hidden');
    submenuContainer.classList.remove('hidden');
    noteViewPanel.classList.add('hidden');
}

function showNote() {
    homeDashboard.classList.add('hidden');
    submenuContainer.classList.add('hidden');
    noteViewPanel.classList.remove('hidden');
}

function backToSubmenu() {
    showSubmenu();
}

// 2. Fetch Form Data (1 to 6) and populate topic cards
async function loadForm(formName) {
    submenuTitle.innerText = formName.replace('form', 'Form ').toUpperCase() + " NOTES";
    submenuGrid.innerHTML = '<p class="placeholder-text">Retrieving chapters from database...</p>';
    showSubmenu();

    try {
        const response = await fetch(`data/${formName}.json`);
        if (!response.ok) throw new Error("Data retrieval failed");
        
        currentFormData = await response.json();
        submenuGrid.innerHTML = ''; // Clear loading indicator

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
            
            // Assign selection action to display the specific chapter notes
            card.onclick = () => displayNote(key);
            submenuGrid.appendChild(card);
        });

    } catch (error) {
        submenuGrid.innerHTML = `<p class="placeholder-text" style="color:#ef4444;">Form files are currently loading into the repository.</p>`;
        console.error(error);
    }
}

// 3. Decode notes to reader panel
function displayNote(topicKey) {
    const topic = currentFormData[topicKey];
    if (topic) {
        const decodedHTML = decodeUTF8Base64(topic.content);
        noteBody.innerHTML = `<h1>${topic.title}</h1>` + decodedHTML;
        showNote();
        window.scrollTo(0, 0);
    }
}

// 4. Load Bible Schemes (Custom dynamic list of buying links)
function loadSchemesMenu() {
    submenuTitle.innerText = "BUY BIBLE SCHEMES";
    showSubmenu();
    
    // Custom list of schemes items
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

// 5. Load Bible Logbooks (Custom dynamic list of buying links)
function loadLogbooksMenu() {
    submenuTitle.innerText = "BUY BIBLE LOGBOOKS";
    showSubmenu();

    // Custom list of logbooks
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

// 6. Load PDF Reference Menu (3 direct PDF links to repository files)
function loadPDFMenu() {
    submenuTitle.innerText = "REFERENCE DOWNLOADS";
    showSubmenu();

    // Array containing paths to your PDF folders in GitHub
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
