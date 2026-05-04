/**
 * Chat & History Management
 */

let currentChatId = null;

window.newChat = function() {
    currentChatId = Date.now().toString();
    document.getElementById('chatMessages').innerHTML = `
        <div class="flex flex-col items-center justify-center h-full opacity-20 select-none">
            <i class="fas fa-robot text-6xl mb-4"></i>
            <p class="font-bold">Khittara AI Hub</p>
        </div>
    `;
    window.switchView('chat');
};

window.sendMessage = function(inputId) {
    const input = document.getElementById(inputId);
    const val = input.value.trim();
    if (!val) return;

    if (!currentChatId) currentChatId = Date.now().toString();
    if (inputId === 'initialInput') {
        window.switchView('chat');
        document.getElementById('chatMessages').innerHTML = '';
    }

    appendMessageUI('user', val);
    input.value = '';
    processAI(val);
};

async function processAI(prompt) {
    showThinking();
    try {
        const response = await AI_CONFIG.fetchAIResponse(prompt);
        hideThinking();
        appendMessageUI('ai', response);
        saveToHistory('ai', response);
    } catch (e) {
        hideThinking();
        appendMessageUI('ai', "API Error. Please check your key in Settings.");
    }
}

function appendMessageUI(role, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-6 px-2`;
    
    const content = role === 'ai' ? marked.parse(text) : text;
    div.innerHTML = `
        <div class="message-bubble ${role === 'user' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-zinc-800 shadow-sm'}">
            ${content}
        </div>
    `;
    
    container.appendChild(div);
    scrollToBottom();
    div.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
    if(role === 'user') saveToHistory('user', text);
}

function showThinking() {
    if(document.getElementById('thinkingIndicator')) return;
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.id = 'thinkingIndicator';
    div.className = 'flex justify-start mb-6 px-2';
    div.innerHTML = `<div class="bg-gray-100 dark:bg-zinc-800 p-4 rounded-2xl flex space-x-1">
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.2s"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.4s"></div>
    </div>`;
    container.appendChild(div);
    scrollToBottom();
}

function hideThinking() {
    const el = document.getElementById('thinkingIndicator');
    if (el) el.remove();
}

function saveToHistory(role, text) {
    let history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    if (!history[currentChatId]) {
        history[currentChatId] = { title: text.substring(0, 30) + "...", messages: [] };
    }
    history[currentChatId].messages.push({ role, text });
    localStorage.setItem('khittara_history', JSON.stringify(history));
    window.renderHistory();
}

window.renderHistory = function() {
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    const list = document.getElementById('chatHistoryList');
    if(!list) return;
    list.innerHTML = '';
    
    Object.keys(history).sort((a,b) => b-a).forEach(id => {
        const item = document.createElement('div');
        item.className = 'group flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer mb-1 transition-all';
        item.innerHTML = `
            <div class="flex items-center flex-1 overflow-hidden" onclick="loadChat('${id}')">
                <i class="far fa-comment-alt mr-3 text-gray-400 text-xs"></i>
                <span class="text-sm truncate">${history[id].title}</span>
            </div>
            <button onclick="deleteChat(event, '${id}')" class="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fas fa-trash-alt text-xs"></i>
            </button>
        `;
        list.appendChild(item);
    });
};

window.deleteChat = function(e, id) {
    e.stopPropagation();
    if(confirm('Delete this history?')) {
        let history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
        delete history[id];
        localStorage.setItem('khittara_history', JSON.stringify(history));
        if (currentChatId === id) window.newChat();
        window.renderHistory();
    }
};

window.loadChat = function(id) {
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    if(!history[id]) return;
    currentChatId = id;
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    history[id].messages.forEach(m => appendMessageUI(m.role, m.text));
    window.switchView('chat');
};

function scrollToBottom() {
    const container = document.getElementById('chatMessages');
    container.scrollTop = container.scrollHeight;
}

// Mobile Keyboard Adjust
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        if (!document.getElementById('chatView').classList.contains('hidden')) {
            document.body.style.height = window.visualViewport.height + 'px';
            scrollToBottom();
        }
    });
}

document.addEventListener('DOMContentLoaded', window.renderHistory);
