const translations = {
    en: {
        dashboard: "Dashboard",
        ai_chat: "AI Chat",
        lottery: "Lottery Analysis",
        settings: "Settings",
        ask_placeholder: "Ask Khittara anything...",
        empower: "Empowering your vision with AI.",
        new_chat: "New Chat",
        history: "History",
        dark_mode: "Dark Mode",
        lang: "Language",
        save: "Save Changes",
        signin: "Sign In",
        signup: "Sign Up"
    },
    my: {
        dashboard: "ပင်မစာမျက်နှာ",
        ai_chat: "AI နှင့် စကားပြောရန်",
        lottery: "ထီဂဏန်း ခန့်မှန်းချက်",
        settings: "ဆက်တင်များ",
        ask_placeholder: "ဘာသိချင်ပါသလဲ...",
        empower: "သင်၏ အနာဂတ်အတွက် AI နှင့် ဖန်တီးပါ။",
        new_chat: "စကားဝိုင်းအသစ်",
        history: "မှတ်တမ်းများ",
        dark_mode: "ညဘက်အသုံးပြုပုံ",
        lang: "ဘာသာစကား",
        save: "သိမ်းဆည်းမည်",
        signin: "အကောင့်ဝင်ရန်",
        signup: "အကောင့်ဖွင့်ရန်"
    }
};

function applyLanguage(lang) {
    const t = translations[lang] || translations.en;
    const labels = document.querySelectorAll('.sidebar-label');
    labels[0].innerText = t.dashboard;
    labels[1].innerText = t.ai_chat;
    labels[2].innerText = t.lottery;
    labels[3].innerText = t.settings;

    document.querySelector('#homeView p').innerText = t.empower;
    document.getElementById('initialInput').placeholder = t.ask_placeholder;
    document.getElementById('chatInput').placeholder = t.ask_placeholder;
    document.getElementById('historyTitle').innerText = t.history;
    
    // Modal
    document.getElementById('modalTitle').innerText = t.settings;
    document.getElementById('darkModeLabel').innerText = t.dark_mode;
    document.getElementById('langLabel').innerText = t.lang;
    document.getElementById('saveBtn').innerText = t.save;
    document.getElementById('signInBtn').innerText = t.signin;
    document.getElementById('signUpBtn').innerText = t.signup;
}

function switchView(viewName) {
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('view-active'));
    document.getElementById(viewName + 'View').classList.add('view-active');
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active-tab'));
    if(event) event.currentTarget.classList.add('active-tab');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('hidden');
    modal.style.display = modal.classList.contains('hidden') ? 'none' : 'flex';
}

function saveSettings() {
    const lang = document.getElementById('langSelect').value;
    localStorage.setItem('language', lang);
    localStorage.setItem('khittara_api_key', document.getElementById('apiKeyInput').value);
    applyLanguage(lang);
    toggleSettings();
}

window.addEventListener('DOMContentLoaded', () => {
    const lang = localStorage.getItem('language') || 'en';
    document.getElementById('langSelect').value = lang;
    applyLanguage(lang);
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
});
