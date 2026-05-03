/**
 * Khittara AI - Main Chat Logic
 * Handles: Messaging, History, AI Processing, UI Updates
 */

let currentChatId = null;

// စာမျက်နှာ စဖွင့်ချင်းမှာ History list ကို ဆွဲတင်မယ်
window.addEventListener('DOMContentLoaded', () => {
    loadHistoryUI();
});

/**
 * စကားဝိုင်းအသစ် စတင်ခြင်း
 */
function newChat() {
    currentChatId = Date.now().toString(); // Unique ID တစ်ခု သတ်မှတ်
    document.getElementById('chatMessages').innerHTML = ''; // စာဟောင်းတွေ ရှင်းထုတ်
    switchView('chat'); // Chat screen ကို ပြောင်း
    
    // Sidebar မှာ Active ပြောင်းခြင်း
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active-tab'));
    // Start New Chat ခလုတ်ရှိလျှင် highlight ပြချင်ပါက ဤနေရာတွင် ထည့်နိုင်သည်
}

/**
 * မက်ဆေ့ခ်ျ ပို့ခြင်း logic
 * @param {string} inputId - 'initialInput' (Home) သို့မဟုတ် 'chatInput' (Chat)
 */
function sendMessage(inputId) {
    const input = document.getElementById(inputId);
    const val = input.value.trim();
    
    if (!val) return; // စာမရှိရင် ဘာမှမလုပ်ဘူး

    // လက်ရှိ Chat ID မရှိသေးရင် အသစ်တစ်ခု ဆောက်မယ်
    if (!currentChatId) {
        currentChatId = Date.now().toString();
    }

    // Home screen ကနေ စာရိုက်လိုက်တာဆိုရင် Chat view ကို အရင်ပြောင်းမယ်
    if (inputId === 'initialInput') {
        switchView('chat');
    }

    // User ရိုက်လိုက်တဲ့ စာကို UI မှာ အရင်ပြမယ်
    appendMessage('user', val);
    
    // AI ဆီက အဖြေတောင်းမယ်
    processAI(val);
    
    // Input box ကို ရှင်းမယ်
    input.value = '';
}

/**
 * AI ဆီက အဖြေကို fetch လုပ်ပြီး UI မှာ ပြခြင်း
 */
async function processAI(prompt) {
    showThinking(); // တွေးနေတဲ့ Icon ပြမယ်
    
    try {
        // AI_CONFIG သည် ai-config.js ထဲတွင် ရှိရမည်
        const aiResponse = await AI_CONFIG.fetchAIResponse(prompt);
        hideThinking(); // Icon ပြန်ဖျောက်မယ်
        
        if (aiResponse) {
            appendMessage('ai', aiResponse);
        } else {
            appendMessage('ai', "တောင်းပန်ပါတယ်၊ အဖြေပြန်ပေးဖို့ အခက်အခဲရှိနေပါတယ်။");
        }
    } catch (error) {
        hideThinking();
        console.error("AI Error:", error);
        appendMessage('ai', "Error: API Key သို့မဟုတ် Internet ချိတ်ဆက်မှုကို စစ်ဆေးပေးပါဗျ။");
    }
}

/**
 * UI ပေါ်တွင် စာသားများ ထည့်သွင်းခြင်း
 */
function appendMessage(role, text) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-8 opacity-0 transition-opacity duration-300`;
    
    // AI ဆိုလျှင် Markdown ပြောင်းမယ်၊ User ဆိုလျှင် ရိုးရိုးပြမယ်
    const displayContent = role === 'ai' ? marked.parse(text) : text;
    
    div.innerHTML = `
        <div class="message-bubble ${role === 'user' ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200'}">
            ${displayContent}
        </div>
    `;

    container.appendChild(div);
    
    // Fade-in animation လေးဖြစ်အောင်
    setTimeout(() => div.classList.remove('opacity-0'), 10);

    // အောက်ဆုံးကို auto scroll ဆင်းမယ်
    container.scrollTop = container.scrollHeight;

    // Code highlight လုပ်ဖို့ (AI message ဖြစ်လျှင်)
    if (role === 'ai') {
        div.querySelectorAll('pre code').forEach((block) => {
            if (typeof hljs !== 'undefined') hljs.highlightElement(block);
        });
    }

    // History ထဲ သိမ်းမယ်
    saveToHistory(role, text);
}

/**
 * Thinking Animation (Dots) ပြခြင်း
 */
function showThinking() {
    if(document.getElementById('thinkingIndicator')) return;
    
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.id = 'thinkingIndicator';
    div.className = 'flex justify-start mb-8';
    div.innerHTML = `
        <div class="bg-gray-100 dark:bg-zinc-800 p-4 rounded-2xl flex items-center space-x-2">
            <div class="dot"></div><div class="dot"></div><div class="dot"></div>
        </div>`;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function hideThinking() {
    const el = document.getElementById('thinkingIndicator');
    if (el) el.remove();
}

/**
 * LocalStorage တွင် သိမ်းခြင်း
 */
function saveToHistory(role, text) {
    let history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    
    if (!history[currentChatId]) {
        // စကားဝိုင်းအသစ်ဆိုလျှင် ပထမဆုံးစာကို Title အဖြစ်ယူမယ်
        history[currentChatId] = { 
            title: text.substring(0, 25) + (text.length > 25 ? '...' : ''), 
            messages: [] 
        };
    }
    
    history[currentChatId].messages.push({ role, text });
    localStorage.setItem('khittara_history', JSON.stringify(history));
    
    loadHistoryUI(); // Sidebar history ကို update လုပ်မယ်
}

/**
 * Sidebar တွင် History စာရင်းပြခြင်း
 */
function loadHistoryUI() {
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    const list = document.getElementById('chatHistoryList');
    if (!list) return;

    list.innerHTML = '';
    
    // နောက်ဆုံးပြောထားတာကို အပေါ်မှာပြမယ်
    Object.keys(history).reverse().forEach(id => {
        const item = document.createElement('div');
        item.className = `p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-sm truncate mb-1 transition-colors ${currentChatId === id ? 'bg-gray-100 dark:bg-zinc-800 text-yellow-600' : 'text-gray-500'}`;
        item.innerHTML = `<i class="far fa-comment-alt mr-3"></i> ${history[id].title}`;
        item.onclick = () => loadExistingChat(id);
        list.appendChild(item);
    });
}

/**
 * History ထဲက chat တစ်ခုကို ပြန်ဖွင့်ခြင်း
 */
function loadExistingChat(id) {
    currentChatId = id;
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    const chatData = history[id];
    
    if (!chatData) return;

    document.getElementById('chatMessages').innerHTML = '';
    switchView('chat');

    chatData.messages.forEach(msg => {
        // History ကနေပြန်ဆွဲတာမို့လို့ saveToHistory ထပ်မဖြစ်အောင် logic ခွဲဖို့လိုနိုင်ပေမဲ့ 
        // appendMessage ထဲမှာ saveToHistory ပါနေတာမို့ လောလောဆယ် ရိုးရိုးပဲ UI ထည့်မယ်
        renderHistoryMessage(msg.role, msg.text);
    });
    
    loadHistoryUI(); // highlight ပြောင်းဖို့
}

// History အတွက် သီးသန့် render (Save history ထပ်မလုပ်ဖို့)
function renderHistoryMessage(role, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-8`;
    const displayContent = role === 'ai' ? marked.parse(text) : text;
    
    div.innerHTML = `
        <div class="message-bubble ${role === 'user' ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200'}">
            ${displayContent}
        </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    
    if (role === 'ai') {
        div.querySelectorAll('pre code').forEach((block) => {
            if (typeof hljs !== 'undefined') hljs.highlightElement(block);
        });
    }
}
