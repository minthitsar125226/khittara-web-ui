/**
 * Navigation & Settings Logic for Khittara AI Hub
 */

// ၁။ Sidebar ဖွင့်/ပိတ်ခြင်း (Toggle Sidebar)
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar.classList.contains('-translate-x-full')) {
        // Sidebar ဖွင့်မည်
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        // Sidebar ပိတ်မည်
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
};

// ၂။ Settings Modal ဖွင့်/ပိတ်ခြင်း
window.toggleSettings = function() {
    const modal = document.getElementById('settingsModal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

// ၃။ View များအကြား ကူးပြောင်းခြင်း (Home <-> Chat)
window.switchView = function(viewName) {
    const homeView = document.getElementById('homeView');
    const chatView = document.getElementById('chatView');
    
    if (viewName === 'home') {
        homeView.classList.remove('hidden');
        chatView.classList.add('hidden');
    } else if (viewName === 'chat') {
        homeView.classList.add('hidden');
        chatView.classList.remove('hidden');
    }
    
    // Sidebar ကို အလိုအလျောက်ပြန်ပိတ်ပေးခြင်း
    const sidebar = document.getElementById('mainSidebar');
    if (!sidebar.classList.contains('-translate-x-full')) {
        window.toggleSidebar();
    }
};

// ၄။ Slider တန်ဖိုးများကို CSS Variables အဖြစ် ပြောင်းလဲပေးခြင်း
function applyStyles(fontSize, iconSize, logoSize) {
    const root = document.documentElement;

    // Font Size Mapping
    const fonts = ["14px", "16px", "20px"];
    root.style.setProperty('--base-font-size', fonts[fontSize]);

    // Icon Size Mapping
    const icons = ["18px", "24px", "32px"];
    root.style.setProperty('--base-icon-size', icons[iconSize]);

    // Logo Size Mapping (Scale for visual)
    const logos = ["0.8", "1.0", "1.3"];
    root.style.setProperty('--base-logo-scale', logos[logoSize]);
}

// ၅။ Settings များ သိမ်းဆည်းခြင်း (Save Settings)
window.saveSettings = function() {
    const fontSize = document.getElementById('fontSizeSlider').value;
    const iconSize = document.getElementById('iconSizeSlider').value;
    const logoSize = document.getElementById('logoSizeSlider').value;
    const apiKey = document.getElementById('apiKeyInput').value;

    // UI ပေါ်တွင် ချက်ချင်းသက်ရောက်စေခြင်း
    applyStyles(fontSize, iconSize, logoSize);

    // API Key နှင့် Settings များကို LocalStorage တွင် သိမ်းခြင်း
    localStorage.setItem('khittara_settings', JSON.stringify({
        fontSize, iconSize, logoSize
    }));
    
    if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
    }

    // Modal ကို ပိတ်ခြင်း
    window.toggleSettings();
    
    // အောင်မြင်ကြောင်း အသိပေးချက် (Optional)
    console.log("Settings saved successfully.");
};

// ၆။ စာမျက်နှာ စဖွင့်ချင်းတွင် သိမ်းထားသော Settings များ ပြန်ခေါ်ခြင်း
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('khittara_settings');
    const savedKey = localStorage.getItem('gemini_api_key');

    if (savedData) {
        const { fontSize, iconSize, logoSize } = JSON.parse(savedData);
        
        // Slider များ၏ နေရာကို ပြန်သတ်မှတ်ခြင်း
        document.getElementById('fontSizeSlider').value = fontSize;
        document.getElementById('iconSizeSlider').value = iconSize;
        document.getElementById('logoSize
