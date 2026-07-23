// Variable to store selected Form details in memory
let currentFormData = {};

// 1. Fetch JSON data dynamically and render 5 clean Topic Cards
async function loadForm(formName) {
    const topicsContainer = document.getElementById('topics-container');
    const noteView = document.getElementById('note-view');
    
    // Switch panels
    noteView.classList.add('hidden');
    topicsContainer.classList.remove('hidden');
    topicsContainer.innerHTML = '<p class="placeholder-text">Retrieving lessons from secure database...</p>';

    try {
        const response = await fetch(`data/${formName}.json`);
        if (!response.ok) throw new Error("Data retrieval failed");
        
        currentFormData = await response.json();
        topicsContainer.innerHTML = ''; // Wipe loading note

        // Loop and build the 5 topic icon elements
        Object.keys(currentFormData).forEach((key, index) => {
            const topic = currentFormData[key];
            const card = document.createElement('div');
            card.className = 'topic-icon-card';
            
            card.innerHTML = `
                <div class="icon-wrapper">
                    <svg viewBox="0 0 24 24" class="svg-icon">
                        <path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.2 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8V4m0 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span class="topic-number">Topic 0${index + 1}</span>
                <h3 class="topic-title">${topic.title}</h3>
                <p class="topic-subtitle">${topic.subtitle}</p>
            `;
            
            // Assign selection action
            card.onclick = () => displayNote(key);
            topicsContainer.appendChild(card);
        });

    } catch (error) {
        topicsContainer.innerHTML = `
            <div class="placeholder-text">
                <p style="color:#ef4444; font-weight:600;">Data connection error.</p>
                <p style="font-size:0.9rem; margin-top:5px;">Ensure database file is compiled under the data folder.</p>
            </div>`;
        console.error(error);
    }
}

// 2. Decode content payload on clicking a Topic Icon
function displayNote(topicKey) {
    const topicsContainer = document.getElementById('topics-container');
    const noteView = document.getElementById('note-view');
    const noteBody = document.getElementById('note-body');

    const topic = currentFormData[topicKey];
    if (topic) {
        // Decode the secure data payload instantly to viewport
        const decodedHTML = decodeUTF8Base64(topic.content);
        
        noteBody.innerHTML = `<h1>${topic.title}</h1>` + decodedHTML;
        
        // Hide icons, reveal text view
        topicsContainer.classList.add('hidden');
        noteView.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

// 3. Close active note view and return to current 5 Topic icons
function closeNote() {
    document.getElementById('note-view').classList.add('hidden');
    document.getElementById('topics-container').classList.remove('hidden');
}

// Safely Decrypt UTF-8 Encrypted/Encoded Base64 blocks
function decodeUTF8Base64(base64Str) {
    try {
        return decodeURIComponent(atob(base64Str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch (e) {
        return atob(base64Str);
    }
}

// Sidebar Utility items (Syllabus, etc.)
function loadExtra(type) {
    const topicsContainer = document.getElementById('topics-container');
    const noteView = document.getElementById('note-view');
    noteView.classList.add('hidden');
    topicsContainer.classList.remove('hidden');
    
    topicsContainer.innerHTML = `
        <div class="placeholder-text">
            <h2 style="text-transform: capitalize;">${type.replace('-', ' ')} Directory</h2>
            <p>Access privileges required. Supplemental resources are loading in encrypted formats soon.</p>
        </div>
    `;
}

/* ==========================================
   BROWSER COPY AND INSPECT LOCKS
   ========================================== */

// Blocks standard context clicks (right click)
document.addEventListener('contextmenu', e => e.preventDefault());

// Blocks main developer inspecting shortcuts
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
