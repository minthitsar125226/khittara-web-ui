// --- ၁။ ဘာသာစကား Localization သတ်မှတ်ချက်များ ---
const translations = {
    en: {
        dashboard: "Dashboard",
        ai_chat: "AI Chat",
        lottery: "Lottery Analysis",
        settings: "Settings",
        ask_placeholder: "Message Khittara...",
        empower: "Empowering your vision with AI.",
        history: "History",
        dark_mode: "Dark Mode",
        lang: "Language",
        save: "Save Changes"
    },
    my: {
        dashboard: "ပင်မစာမျက်နှာ",
        ai_chat: "AI နှင့် စကားပြောရန်",
        lottery: "ထီဂဏန်း ခန့်မှန်းချက်",
        settings: "ဆက်တင်များ",
        ask_placeholder: "ဘာသိချင်ပါသလဲ...",
        empower: "သင်၏ အနာဂတ်အတွက် AI နှင့် ဖန်တီးပါ။",
        history: "မှတ်တမ်းများ",
        dark_mode: "ညဘက်အသုံးပြုပုံ",
        lang: "ဘာသာစကား",
        save: "သိမ်းဆည်းမည်"
    }
};

// --- ၂။ Sidebar Toggle Function (ခလုတ်နှိပ်ရင် ပွင့်/ပိတ် လုပ်ရန်) ---
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

// --- ၃။ Draggable Menu Toggle Button Logic (ခလုတ်ကို ရွှေ့လို့ရအောင် လုပ်ခြင်း) ---
const dragBtn = document.getElementById('menuToggleBtn');
let isDragging = false;
let startX, startY;

// Mouse အသုံးပြုသူများအတွက်
dragBtn.addEventListener('mousedown', (e) => {
    isDragging = false; // Mouse စနှိပ်ချိန်မှာ မရွှေ့သေးဘူးလို့ ယူဆမယ်
    startX = e.clientX;
    startY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
    if (startX === undefined) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // 5px ထက်ပိုရွေ့မှ Drag လုပ်နေတယ်လို့ သတ်မှတ်မယ် (မတော်တဆ နှိပ်မိတာနဲ့ မမှားအောင်)
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging = true;
        
        let newX = e.clientX - 27; // ခလုတ်ရဲ့ ဗဟိုကနေ ဆွဲရန်
        let newY = e.clientY - 27;

        // Screen အပြင်ထွက်မသွားအောင် ကန့်သတ်ခြင်း
        newX = Math.max(10, Math.min(window.innerWidth - 64, newX));
        newY = Math.max(10, Math.min(window.innerHeight - 64, newY));

        dragBtn.style.left = newX + 'px';
        dragBtn.style.top = newY + 'px';
    }
});

window.addEventListener('mouseup', () => {
    // Drag မလုပ်ဘဲ နှိပ်ရုံပဲ နှိပ်တာဆိုရင် Sidebar ဖွင့်မယ်
    if (!isDragging && startX !== undefined) {
        toggleSidebar();
    }
    startX = undefined;
    isDragging = false;
});

// Touch အသုံးပြုသူများအတွက် (Mobile)
dragBtn.addEventListener('touchstart', (e) => {
    isDragging = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (startX === undefined) return;
    isDragging = true;
    
    let newX = e.touches[0].clientX - 27;
    let newY = e.touches[0].clientY - 27;

    newX = Math.max(10, Math.min(window.innerWidth - 64, newX));
    newY = Math.max(10, Math.min(window.innerHeight - 64, newY));

    dragBtn.style.left = newX + 'px';
    dragBtn.style.top = newY + 'px';
}, { passive: true });

window.addEventListener('touchend', () => {
    if (!isDragging && startX !== undefined) {
        toggleSidebar();
    }
    startX = undefined;
    isDragging = false;
});

// --- ၄။ View Switch Logic (စာမျက်နှာများ ပြောင်းလဲခြင်း) ---
function switchView(viewName) {
    // View အားလုံးကို အရင်ဖျောက်မယ်
    const views = document.querySelectorAll('.view-container');
    views.forEach(v => {
        v.classList.remove('view-active');
        v.style.display = 'none';
    });

    // ရွေးချယ်လိုက်တဲ့ View ကို ပြမယ်
    const target = document.getElementById(viewName + 'View');
    if (target) {
        target.classList.add('view-active');
        target.style.display = 'flex';
    }

    // Sidebar မှာ Active ဖြစ်နေတာကို ပြောင်းမယ်
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active-tab'));
    if(event && event.currentTarget && event.currentTarget.classList.contains('sidebar-item')) {
        event.currentTarget.classList.add('active-tab');
    }

    // View ပြောင်းပြီးရင် Sidebar ကို အလိုအလျောက် ပြန်ပိတ်မယ်
    document.body.classList.remove('sidebar-open');
}

// --- ၅။ ဘာသာစကား အသုံးပြုခြင်း ---
function applyLanguage(lang) {
    const t = translations[lang] || translations.en;
    
    // Sidebar Labels
    const labels = document.querySelectorAll('.sidebar-label');
    if(labels.length >= 4) {
        labels[0].innerText = t.dashboard;
        labels[1].innerText = t.ai_chat;
        labels[2].innerText = t.lottery;
        labels[3].innerText = t.settings;
    }

    // Main Content
    const empowerPara = document.querySelector('#homeView p');
    if(empowerPara) empowerPara.innerText = t.empower;
    
    const initialInp = document.getElementById('initialInput');
    const chatInp = document.getElementById('chatInput');
    if(initialInp) initialInp.placeholder = t.ask_placeholder;
    if(chatInp) chatInp.placeholder = t.ask_placeholder;
    
    const histTitle = document.getElementById('historyTitle');
    if(histTitle) histTitle.innerText = t.history;

    // Modal
    const modTitle = document.getElementById('modalTitle');
    const dmLabel = document.getElementById('darkModeLabel');
    const langLabel = document.getElementById('langLabel');
    const saveBtn = document.getElementById('saveBtn');
    
    if(modTitle) modTitle.innerText = t.settings;
    if(dmLabel) dmLabel.innerText = t.dark_mode;
    if(langLabel) langLabel.innerText = t.lang;
    if(saveBtn) saveBtn.innerText = t.save;
}

// --- ၆။ Settings သိမ်းဆည်းခြင်းနှင့် Dark Mode ---
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    if(modal) {
        modal.classList.toggle('hidden');
        modal.style.display = modal.classList.contains('hidden') ? 'none' : 'flex';
    }
}

function saveSettings() {
    const lang = document.getElementById('langSelect').value;
    localStorage.setItem('language', lang);
    
    const apiKey = document.getElementById('apiKeyInput').value;
    localStorage.setItem('khittara_api_key', apiKey);
    
    applyLanguage(lang);
    toggleSettings();
}

// --- ၇။ စာမျက်နှာစဖွင့်ချိန်တွင် Restore လုပ်ခြင်း ---
window.addEventListener('DOMContentLoaded', () => {
    // သိမ်းထားတဲ့ Theme ပြန်ယူမယ်
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // သိမ်းထားတဲ့ ဘာသာစကား ပြန်ယူမယ်
    const savedLang = localStorage.getItem('language') || 'en';
    const langSelect = document.getElementById('langSelect');
    if(langSelect) langSelect.value = savedLang;
    applyLanguage(savedLang);

    // သိမ်းထားတဲ့ API Key ပြန်ထည့်မယ်
    const savedKey = localStorage.getItem('khittara_api_key');
    const apiInp = document.getElementById('apiKeyInput');
    if(apiInp && savedKey) apiInp.value = savedKey;
});
