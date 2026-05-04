/**
 * Chat Logic for Khittara AI Hub
 */

let currentChatIndex = null;

// ၁။ Chat အသစ်စတင်ခြင်း
window.newChat = function() {
    currentChatIndex = null;
    document.getElementById('chatMessages').innerHTML = `
        <div class="flex flex-col items-center justify-center h-full opacity-50">
            <i class="fas fa-robot text-4xl mb-4"></i>
            <p>How can I help you today?</p>
        </div>
    `;
    window.switchView('chat');
};

// ၂။ Message ပို့ခြင်း
window.sendMessage = async function(inputId) {
    const inputElement = document.getElementById(inputId);
    const message = inputElement.value.trim();
    
    if (!message) return;

    // အကယ်၍ Home View ကနေ ပို့တာဆိုရင် Chat View ကို ပြောင်းမယ်
    if (inputId === 'initialInput') {
        window.switchView('chat');
        document.getElementById('chatMessages').innerHTML = ''; // Welcome screen ကို ဖယ်မယ်
    }

    // User Message ကို UI မှာ ပြခြင်း
    appendMessage('user', message);
    inputElement.value = '';

    // Keyboard ပိတ်သွားရင် သို့မဟုတ် စာရိုက်ပြီးရင် အောက်ဆုံးကို scroll ဆွဲပေးမယ်
    scrollToBottom();

    // AI ရဲ့ တုံ့ပြန်မှုကို ရယူခြင်း (Config/API ခေါ်ယူခြင်း)
    try {
        // Thinking Animation ပြမယ်
        const loadingId = appendLoading();
        
        // Gemini API ခေါ်ယူခြင်း (ai-config.js ထဲက function ကို သုံးမည်)
        const response = await getGeminiResponse(message);
        
        // Loading ဖယ်ပြီး AI message ထည့်မယ်
        removeLoading(loadingId);
        appendMessage('ai', response);
        
        // Chat History ကို Save လုပ်ခြင်း
        saveToHistory(message, response);
        
    } catch (error) {
        console.error("AI Error:", error);
        appendMessage('ai', "Sorry, I encountered an error. Please check your API key.");
    }
};

// ၃။ Message Bubble များ ထည့်သွင်းခြင်း
function appendMessage(role, text) {
    const container = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-6`;
    
    // AI ဆိုရင် Markdown format လုပ်မယ်
    const content = role === 'ai' ? marked.parse(text) : text;

    wrapper.innerHTML = `
        <div class="message-bubble shadow-sm ${role === 'user' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-zinc-800'}">
            ${content}
        </div>
    `;
    container.appendChild(wrapper);
    
    // Code highlighting (AI တုံ့ပြန်မှုထဲမှာ code ပါရင်)
    if (role === 'ai') {
        wrapper.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
    
    scrollToBottom();
}

// ၄။ Scroll Logic (Mobile မှာ အရေးကြီးသည်)
function scrollToBottom() {
    const container = document.getElementById('chatMessages');
    container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
    });
}

// ၅။ Loading/Thinking Animation
function appendLoading() {
    const id = 'loading-' + Date.now();
    const container = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = "flex justify-start mb-6";
    wrapper.innerHTML = `
        <div class="message-bubble bg-gray-100 dark:bg-zinc-800">
            <div class="flex space-x-1">
                <div class="dot w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
        </div>
    `;
    container.appendChild(wrapper);
    scrollToBottom();
    return id;
}

function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// ၆။ History ကို LocalStorage တွင် သိမ်းဆည်းခြင်း
function saveToHistory(userMsg, aiMsg) {
    let chats = JSON.parse(localStorage.getItem('chat_history') || '[]');
    
    // လက်ရှိ chat အသစ်ဆိုရင် အပေါ်ဆုံးမှာ ထည့်မယ်
    if (currentChatIndex === null) {
        chats.unshift({
            title: userMsg.substring(0, 30) + '...',
            messages: [{ role: 'user', text: userMsg }, { role: 'ai', text: aiMsg }]
        });
        currentChatIndex = 0;
    } else {
        // ရှိပြီးသား chat ထဲကို message ထပ်ထည့်မယ်
        chats[currentChatIndex].messages.push({ role: 'user', text: userMsg });
        chats[currentChatIndex].messages.push({ role: 'ai', text: aiMsg });
    }
    
    localStorage.setItem('chat_history', JSON.stringify(chats));
    
    // Sidebar က History UI ကို Update လုပ်ပေးဖို့ navigation.js ထဲက function ကို ခေါ်မယ်
    if (window.renderHistory) window.renderHistory();
}

// ၇။ ရှိပြီးသား Chat ကို ပြန်ဖွင့်ခြင်း
window.loadChat = function(index) {
    const chats = JSON.parse(localStorage.getItem('chat_history') || '[]');
    const chat = chats[index];
    if (!chat) return;

    currentChatIndex = index;
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    chat.messages.forEach(msg => {
        appendMessage(msg.role, msg.text);
    });

    window.switchView('chat');
};
