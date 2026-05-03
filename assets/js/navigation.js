window.toggleSidebar = function() {
    document.body.classList.toggle('sidebar-open');
};

const translations = {
    en: { dashboard: "Dashboard", ai_chat: "AI Chat", lottery: "Lottery Analysis", settings: "Settings", ask_placeholder: "Message Khittara...", empower: "Empowering your vision with AI.", history: "History", dark_mode: "Dark Mode", lang: "Language", save: "Save Changes" },
    my: { dashboard: "ပင်မစာမျက်နှာ", ai_chat: "AI နှင့် စကားပြောရန်", lottery: "ထီဂဏန်း ခန့်မှန်းချက်", settings: "ဆက်တင်များ", ask_placeholder: "ဘာသိချင်ပါသလဲ...", empower: "သင်၏ အနာဂတ်အတွက် AI နှင့် ဖန်တီးပါ။", history: "မှတ်တမ်းများ", dark_mode: "ညဘက်အသုံးပြုပုံ", lang: "ဘာသာစကား", save: "သိမ်းဆည်းမည်" }
};

// --- Reliable Drag & Click Logic ---
const dragBtn = document.getElementById('menuToggleBtn');
let isDragging = false;
let startX, startY;
let hasMoved = false;

function handleMenuAction() {
    if (!hasMoved) window.toggleSidebar();
}

// Mouse Logic
dragBtn.addEventListener('mousedown', (e) => {
    hasMoved = false; isDragging = true;
    startX = e.clientX; startY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        hasMoved = true;
        dragBtn.style.left = Math.max(10, Math.min(window.innerWidth - 64, e.clientX - 27)) + 'px';
        dragBtn.style.top = Math.max(10, Math.min(window.innerHeight - 64, e.clientY - 27)) + 'px';
    }
});

window.addEventListener('mouseup', () => {
    if (isDragging) { handleMenuAction(); isDragging = false; }
});

// Touch Logic (Mobile)
dragBtn.addEventListener('touchstart', (e) => {
    hasMoved = false; isDragging = true;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    hasMoved = true;
    dragBtn.style.left = Math.max(10, Math.min(window.innerWidth - 64, e.touches[0].clientX - 27)) + 'px';
    dragBtn.style.top = Math.max(10, Math.min(window.innerHeight - 64, e.touches[0].clientY - 27)) + 'px';
}, { passive: true });

window.addEventListener('touchend', () => {
    if (isDragging) { handleMenuAction(); isDragging = false; }
});

// Navigation & Settings
window.switchView = function(viewName) {
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
};

window.applyLanguage = function(lang) {
    const t = translations[lang] || translations.en;
    const labels = document.querySelectorAll('.sidebar-label');
    if(labels.length >= 4) {
        labels[0].innerText = t.dashboard; labels[1].innerText = t.ai_chat;
        labels[2].innerText = t.lottery; labels[3].innerText = t.settings;
    }
    if(document.querySelector('#homeView p')) document.querySelector('#homeView p').innerText = t.empower;
    if(document.getElementById('initialInput')) document.getElementById('initialInput').placeholder = t.ask_placeholder;
    if(document.getElementById('chatInput')) document.getElementById('chatInput').placeholder = t.ask_placeholder;
    if(document.getElementById('historyTitle')) document.getElementById('historyTitle').innerText = t.history;
    if(document.getElementById('modalTitle')) document.getElementById('modalTitle').innerText = t.settings;
    if(document.getElementById('saveBtn')) document.getElementById('saveBtn').innerText = t.save;
};

window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

window.toggleSettings = function() {
    const m = document.getElementById('settingsModal');
    if(m) { m.classList.toggle('hidden'); m.style.display = m.classList.contains('hidden') ? 'none' : 'flex'; }
};

window.saveSettings = function() {
    const l = document.getElementById('langSelect').value;
    localStorage.setItem('language', l);
    localStorage.setItem('khittara_api_key', document.getElementById('apiKeyInput').value);
    window.applyLanguage(l);
    window.toggleSettings();
};

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    const savedLang = localStorage.getItem('language') || 'en';
    if(document.getElementById('langSelect')) document.getElementById('langSelect').value = savedLang;
    window.applyLanguage(savedLang);
    const savedKey = localStorage.getItem('khittara_api_key');
    if(document.getElementById('apiKeyInput') && savedKey) document.getElementById('apiKeyInput').value = savedKey;
});
