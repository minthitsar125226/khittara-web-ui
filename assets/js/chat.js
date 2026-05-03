let currentChatId = null;

function newChat() {
    currentChatId = Date.now().toString();
    document.getElementById('chatMessages').innerHTML = '';
    window.switchView('chat');
}

function sendMessage(inputId) {
    const input = document.getElementById(inputId);
    const val = input.value.trim();
    if (!val) return;

    if (!currentChatId) currentChatId = Date.now().toString();
    window.switchView('chat');
    
    appendMessageUI('user', val);
    processAI(val);
    input.value = '';
}

async function processAI(prompt) {
    showThinking();
    try {
        const response = await AI_CONFIG.fetchAIResponse(prompt);
        hideThinking();
        appendMessageUI('ai', response);
        saveToHistory('ai', response);
    } catch (e) {
        hideThinking();
        appendMessageUI('ai', "API Error. Please check your key in settings.");
    }
}

function appendMessageUI(role, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-6`;
    
    const content = role === 'ai' ? marked.parse(text) : text;
    div.innerHTML = `<div class="message-bubble ${role === 'user' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-zinc-800'}">${content}</div>`;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    div.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
    
    if(role === 'user') saveToHistory('user', text);
}

function showThinking() {
    if(document.getElementById('thinkingIndicator')) return;
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.id = 'thinkingIndicator';
    div.className = 'flex justify-start mb-6';
    div.innerHTML = `<div class="bg-gray-100 dark:bg-zinc-800 p-4 rounded-2xl flex items-center"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function hideThinking() {
    const el = document.getElementById('thinkingIndicator');
    if (el) el.remove();
}

function saveToHistory(role, text) {
    let history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    if (!history[currentChatId]) history[currentChatId] = { title: text.substring(0, 20) + "...", messages: [] };
    history[currentChatId].messages.push({ role, text });
    localStorage.setItem('khittara_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    const list = document.getElementById('chatHistoryList');
    if(!list) return;
    list.innerHTML = '';
    Object.keys(history).reverse().forEach(id => {
        const item = document.createElement('div');
        item.className = 'p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-xs truncate mb-1 text-gray-500';
        item.innerHTML = `<i class="far fa-comment-alt mr-2"></i> ${history[id].title}`;
        item.onclick = () => {
            currentChatId = id;
            document.getElementById('chatMessages').innerHTML = '';
            history[id].messages.forEach(m => appendMessageUI(m.role, m.text));
            window.switchView('chat');
        };
        list.appendChild(item);
    });
}

window.addEventListener('DOMContentLoaded', renderHistory);
