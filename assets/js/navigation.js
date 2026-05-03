// ၁။ Sidebar ပွင့်/ပိတ် လုပ်ပေးတဲ့ function ကို Global သတ်မှတ်ခြင်း
window.toggleSidebar = function() {
    document.body.classList.toggle('sidebar-open');
    console.log('Sidebar toggled. Current state:', document.body.classList.contains('sidebar-open') ? 'open' : 'closed');
};

// ၂။ ဘာသာစကားအတွက် စာသားများ
const translations = {
    en: { dashboard: "Dashboard", ai_chat: "AI Chat", lottery: "Lottery Analysis", settings: "Settings", ask_placeholder: "Message Khittara...", empower: "Empowering your vision with AI.", history: "History", dark_mode: "Dark Mode", lang: "Language", save: "Save Changes" },
    my: { dashboard: "ပင်မစာမျက်နှာ", ai_chat: "AI နှင့် စကားပြောရန်", lottery: "ထီဂဏန်း ခန့်မှန်းချက်", settings: "ဆက်တင်များ", ask_placeholder: "ဘာသိချင်ပါသလဲ...", empower: "သင်၏ အနာဂတ်အတွက် AI နှင့် ဖန်တီးပါ။", history: "မှတ်တမ်းများ", dark_mode: "ညဘက်အသုံးပြုပုံ", lang: "ဘာသာစကား", save: "သိမ်းဆည်းမည်" }
};

// ၃။ Menu ခလုတ်ကို Drag လုပ်တာနဲ့ Click နှိပ်တာ ခွဲခြားတဲ့ Logic
const dragBtn = document.getElementById('menuToggleBtn');
let isDragging = false;
let startX, startY;
let startTime;
let hasMoved = false;

// Mouse သမားများအတွက်
dragBtn.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasMoved = false;
    startTime = Date.now(); // နှိပ်လိုက်တဲ့အချိန်မှတ်မယ်
    startX = e.clientX;
    startY = e.clientY;
    console.log('mousedown: started dragging detection.');
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // ၁၀ pixel ထက်ပိုရွေ့မှ Drag လုပ်တယ်လို့ သတ်မှတ်မယ်
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        hasMoved = true;
        dragBtn.style.left = Math.max(10, Math.min(window.innerWidth - 64, e.clientX - 27)) + 'px';
        dragBtn.style.top = Math.max(10, Math.min(window.innerHeight - 64, e.clientY - 27)) + 'px';
        // console.log('mousemove: dragging button.'); // Too verbose, uncomment only for specific drag debugging
    }
});

window.addEventListener('mouseup', () => {
    if (isDragging) {
        const duration = Date.now() - startTime;
        // ၂၀၀ မီလီစက္ကန့်ထက်နည်းရင် သို့မဟုတ် အများကြီးမရွေ့ရင် "Click" လို့ယူဆပြီး Sidebar ဖွင့်မယ်
        if (duration < 200 || !hasMoved) {
            console.log('mouseup: detected click, toggling sidebar.');
            window.toggleSidebar();
        } else {
            console.log('mouseup: detected drag, not toggling sidebar.');
        }
        isDragging = false;
    }
});

// Mobile (Touch) သမားများအတွက်
dragBtn.addEventListener('touchstart', (e) => {
    isDragging = true;
    hasMoved = false;
    startTime = Date.now();
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    console.log('touchstart: started dragging detection (mobile).');
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        hasMoved = true;
        dragBtn.style.left = Math.max(10, Math.min(window.innerWidth - 64, e.touches[0].clientX - 27)) + 'px';
        dragBtn.style.top = Math.max(10, Math.min(window.innerHeight - 64, e.touches[0].clientY - 27)) + 'px';
        // console.log('touchmove: dragging button (mobile).'); // Too verbose
    }
}, { passive: true });

window.addEventListener('touchend', () => {
    if (isDragging) {
        const duration = Date.now() - startTime;
        if (duration < 200 || !hasMoved) {
            console.log('touchend: detected tap, toggling sidebar (mobile).');
            window.toggleSidebar();
        } else {
            console.log('touchend: detected drag, not toggling sidebar (mobile).');
        }
        isDragging = false;
    }
});

// ၄။ View ပြောင်းတဲ့ Function
window.switchView = function(viewName) {
    console.log('Switching view to:', viewName);
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('view-active');
        v.style.display = 'none';
    });
    const target = document.getElementById(viewName + 'View');
    if (target) {
        target.classList.add('view-active');
        target.style.display = 'flex';
        console.log(`View ${viewName}View activated.`);
    } else {
        console.warn(`Target view ${viewName}View not found.`);
    }
    document.body.classList.remove('sidebar-open');
};

// ၅။ ဘာသာစကား ပြောင်းလဲခြင်း
window.applyLanguage = function(lang) {
    console.log('Applying language:', lang);
    const t = translations[lang] || translations.en;
    const labels = document.querySelectorAll('.sidebar-label');
    if(labels.length >= 4) {
        labels[0].innerText = t.dashboard;
        labels[1].innerText = t.ai_chat;
        labels[2].innerText = t.lottery;
        labels[3].innerText = t.settings;
    } else {
        console.warn('Could not find enough sidebar labels to apply translations.');
    }
    if(document.querySelector('#homeView p')) document.querySelector('#homeView p').innerText = t.empower;
    if(document.getElementById('initialInput')) document.getElementById('initialInput').placeholder = t.ask_placeholder;
    if(document.getElementById('chatInput')) document.getElementById('chatInput').placeholder = t.ask_placeholder;
    if(document.getElementById('historyTitle')) document.getElementById('historyTitle').innerText = t.history;
    if(document.getElementById('modalTitle')) document.getElementById('modalTitle').innerText = t.settings;
    if(document.getElementById('saveBtn')) document.getElementById('saveBtn').innerText = t.save;
};

// ၆။ Settings & Theme & Font Size
window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    console.log('Theme toggled. Current theme:', newTheme);
};

// New function to apply font size
window.applyFontSize = function(size) {
    console.log('Attempting to apply font size:', size);
    let fontSizeValue;
    switch(size) {
        case 'small':
            fontSizeValue = '14px'; // Base for small size
            break;
        case 'large':
            fontSizeValue = '18px'; // Base for large size
            break;
        case 'medium':
        default:
            fontSizeValue = '16px'; // Base for medium/default size
            break;
    }
    document.documentElement.style.setProperty('--base-font-size', fontSizeValue);
    console.log('CSS Variable --base-font-size set to:', fontSizeValue);
};

window.toggleSettings = function() {
    console.log('Toggling settings modal...');
    const modal = document.getElementById('settingsModal');
    if(modal) {
        modal.classList.toggle('hidden');
        modal.style.display = modal.classList.contains('hidden') ? 'none' : 'flex';

        // When opening the settings modal, ensure the select elements reflect the current saved state
        if (!modal.classList.contains('hidden')) {
            console.log('Settings modal opened. Populating fields...');
            // Language selection
            const langSelect = document.getElementById('langSelect');
            if (langSelect) {
                langSelect.value = localStorage.getItem('language') || 'en';
                console.log('Lang select populated with:', langSelect.value);
            } else {
                console.warn('Language select element (langSelect) not found.');
            }

            // API Key input
            const apiKeyInput = document.getElementById('apiKeyInput');
            if (apiKeyInput) { 
                const savedKey = localStorage.getItem('khittara_api_key');
                if (savedKey) apiKeyInput.value = savedKey;
                console.log('API Key input populated with saved key (if any).');
            } else {
                console.warn('API Key input element (apiKeyInput) not found.');
            }

            // Font size selection
            const fontSizeSelect = document.getElementById('fontSizeSelect');
            if (fontSizeSelect) {
                fontSizeSelect.value = localStorage.getItem('font-size') || 'medium';
                console.log('Font size select populated with:', fontSizeSelect.value);
            } else {
                console.warn('Font size select element (fontSizeSelect) not found.');
            }
        } else {
            console.log('Settings modal closed.');
        }
    } else {
        console.error('Settings modal element (settingsModal) not found!');
    }
};

window.saveSettings = function() {
    console.log('Saving settings...');
    // Save Language setting
    const langSelect = document.getElementById('langSelect');
    const lang = langSelect ? langSelect.value : 'en'; // Default to 'en' if element not found
    localStorage.setItem('language', lang);
    window.applyLanguage(lang); // Apply language change immediately
    console.log('Language setting saved:', lang);

    // Save API Key setting
    const apiKeyInput = document.getElementById('apiKeyInput');
    if (apiKeyInput) {
        localStorage.setItem('khittara_api_key', apiKeyInput.value);
        console.log('API Key setting saved (value length:', apiKeyInput.value.length, ')');
    } else {
        console.warn('API Key input element (apiKeyInput) not found during save.');
    }

    // Save Font Size setting
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const fontSize = fontSizeSelect ? fontSizeSelect.value : 'medium'; // Default to 'medium'
    localStorage.setItem('font-size', fontSize);
    window.applyFontSize(fontSize); // Apply font size change immediately
    console.log('Font size setting saved:', fontSize);

    window.toggleSettings(); // Close the settings modal
    console.log('Settings saved and modal closed.');
};

// ၇။ စာမျက်နှာ စဖွင့်ချိန်မှာ လုပ်ရမည့်အလုပ်များ
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Initializing application...');

    // Apply saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        console.log('Applied dark mode from localStorage.');
    } else {
        console.log('No dark mode preference saved or it is light mode.');
    }

    // Apply saved language
    const savedLang = localStorage.getItem('language') || 'en';
    const langSelect = document.getElementById('langSelect');
    if(langSelect) {
        langSelect.value = savedLang; // Set select box value
        console.log('Language select box initialized to:', savedLang);
    } else {
        console.warn('Language select element (langSelect) not found on DOMContentLoaded.');
    }
    window.applyLanguage(savedLang); // Apply text translations
    console.log('Applied language on load:', savedLang);

    // Load saved API Key (no need to apply, just populate the input if it exists)
    const savedKey = localStorage.getItem('khittara_api_key');
    const apiKeyInput = document.getElementById('apiKeyInput');
    if(apiKeyInput && savedKey) {
        apiKeyInput.value = savedKey;
        console.log('API Key input initialized with saved key.');
    } else if (!apiKeyInput) {
        console.warn('API Key input element (apiKeyInput) not found on DOMContentLoaded.');
    } else {
        console.log('No API Key saved.');
    }

    // Apply saved font size
    const savedFontSize = localStorage.getItem('font-size') || 'medium';
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    if (fontSizeSelect) {
        fontSizeSelect.value = savedFontSize; // Set select box value
        console.log('Font size select box initialized to:', savedFontSize);
    } else {
        console.warn('Font size select element (fontSizeSelect) not found on DOMContentLoaded.');
    }
    window.applyFontSize(savedFontSize); // Apply font size to the document
    console.log('Applied font size on load:', savedFontSize);

    console.log('Application initialization complete.');
});