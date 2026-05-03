const translations = {
    en: { dashboard: "Dashboard", ai_chat: "AI Chat", lottery: "Lottery Analysis", settings: "Settings", ask_placeholder: "Message Khittara...", empower: "Empowering your vision with AI.", history: "History", dark_mode: "Dark Mode", lang: "Language", save: "Save Changes" },
    my: { dashboard: "ပင်မစာမျက်နှာ", ai_chat: "AI နှင့် စကားပြောရန်", lottery: "ထီဂဏန်း ခန့်မှန်းချက်", settings: "ဆက်တင်များ", ask_placeholder: "ဘာသိချင်ပါသလဲ...", empower: "သင်၏ အနာဂတ်အတွက် AI နှင့် ဖန်တီးပါ။", history: "မှတ်တမ်းများ", dark_mode: "ညဘက်အသုံးပြုပုံ", lang: "ဘာသာစကား", save: "သိမ်းဆည်းမည်" }
};

function toggleSidebar() { document.body.classList.toggle('sidebar-open'); }

function switchView(viewName) {
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('view-active');
        v.style.display = 'none';
    });
    const target = document.getElementById(viewName + 'View');
    if (target) {
        target.classList.add('view-active');
        target.style.display = 'flex';
    }
    document.body.classList.remove('sidebar-open');
}

// Draggable Logic
const dragBtn = document.getElementById('menuToggleBtn');
let isDragging = false, startX, startY, initialX, initialY;

dragBtn.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', drag);
window.addEventListener('mouseup', stopDrag);
dragBtn.addEventListener('touchstart', (e) => startDrag(e.touches[0]), {passive: false});
window.addEventListener('touchmove', (e) => drag(e.touches[0]), {passive: false});
window.addEventListener('touchend', stopDrag);

function startDrag(e) {
    isDragging = false;
    startX = e.clientX; startY = e.clientY;
    initialX = dragBtn.offsetLeft; initialY = dragBtn.offsetTop;
}
function drag(e) {
    if (startX === undefined) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging = true;
        dragBtn.style.left = Math.max(10, Math.min(window.innerWidth - 60, initialX + dx)) + 'px';
        dragBtn.style.top = Math.max(10, Math.min(window.innerHeight - 60, initialY + dy)) + 'px';
    }
}
function stopDrag() {
    if (!isDragging && startX !== undefined) toggleSidebar();
    startX = undefined;
}

function applyLanguage(lang) {
    const t = translations[lang] || translations.en;
    document.querySelectorAll('.sidebar-label').forEach((el, i) => {
        el.innerText = [t.dashboard, t.ai_chat, t.lottery, t.settings][i];
    });
    document.querySelector('#homeView p').innerText = t.empower;
    document.getElementById('initialInput').placeholder = t.ask_placeholder;
    document.getElementById('chatInput').placeholder = t.ask_placeholder;
    document.getElementById('historyTitle').innerText = t.history;
    document.getElementById('modalTitle').innerText = t.settings;
    document.getElementById('saveBtn').innerText = t.save;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function toggleSettings() {
    const m = document.getElementById('settingsModal');
    m.classList.toggle('hidden');
    m.style.display = m.classList.contains('hidden') ? 'none' : 'flex';
}

function saveSettings() {
    const l = document.getElementById('langSelect').value;
    localStorage.setItem('language', l);
    localStorage.setItem('khittara_api_key', document.getElementById('apiKeyInput').value);
    applyLanguage(l);
    toggleSettings();
}

window.onload = () => {
    const l = localStorage.getItem('language') || 'en';
    document.getElementById('langSelect').value = l;
    applyLanguage(l);
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
};
