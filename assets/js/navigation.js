/**
 * Navigation & Settings Logic for Khittara AI Hub
 */

// ၁။ Sidebar ဖွင့်/ပိတ်ခြင်း (Toggle Sidebar)
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    // အလုပ်ပိုသေချာအောင် translate-x-0 ကို အတင်းထည့်ပေးခြင်း
    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0'); // အသစ်ထည့်ထားသည်
        overlay.classList.remove('hidden');
        overlay.classList.add('block');
    } else {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0'); // အသစ်ထည့်ထားသည်
        overlay.classList.add('hidden');
        overlay.classList.remove('block');
    }
};

// ၂။ Settings Modal ဖွင့်/ပိတ်ခြင်း
window.toggleSettings = function() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
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

    const fonts = ["14px", "16px", "20px"];
    root.style.setProperty('--base-font-size', fonts[fontSize]);

    const icons = ["18px", "24px", "32px"];
    root.style.setProperty('--base-icon-size', icons[iconSize]);

    const logos = ["0.8", "1.0", "1.3"];
    root.style.setProperty('--base-logo-scale', logos[logoSize]);
}

// ၅။ Settings များ သိမ်းဆည်းခြင်း
window.saveSettings = function() {
    const fontSize = document.getElementById('fontSizeSlider').value;
    const iconSize = document.getElementById('iconSizeSlider').value;
    const logoSize = document.getElementById('logoSizeSlider').value;
    const apiKey = document.getElementById('apiKeyInput').value;

    applyStyles(fontSize, iconSize, logoSize);

    localStorage.setItem('khittara_settings', JSON.stringify({
        fontSize, iconSize, logoSize
    }));
    
    if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
    }

    window.toggleSettings();
};

// ၆။ စဖွင့်ချင်းမှာ Settings တွေ ပြန်ခေါ်ခြင်း (အချောသတ်ပြီးသား)
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('khittara_settings');
    const savedKey = localStorage.getItem('gemini_api_key');

    if (savedData) {
        const { fontSize, iconSize, logoSize } = JSON.parse(savedData);
        
        if(document.getElementById('fontSizeSlider')) document.getElementById('fontSizeSlider').value = fontSize;
        if(document.getElementById('iconSizeSlider')) document.getElementById('iconSizeSlider').value = iconSize;
        if(document.getElementById('logoSizeSlider')) document.getElementById('logoSizeSlider').value = logoSize;
        
        applyStyles(fontSize, iconSize, logoSize);
    }
    
    if (savedKey && document.getElementById('apiKeyInput')) {
        document.getElementById('apiKeyInput').value = savedKey;
    }
});
