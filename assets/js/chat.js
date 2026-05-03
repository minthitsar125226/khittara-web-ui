let currentChatId = null;

function newChat() {
    currentChatId = Date.now().toString();
    document.getElementById('chatMessages').innerHTML = '';
    switchView('chat');
}

function sendMessage(inputId) {
    const input = document.getElementById(inputId);
    const val = input.value.trim();
    if (!val) return;
    if (!currentChatId) currentChatId = Date.now().toString();
    if (inputId === 'initialInput') switchView('chat');
    appendMessage('user', val);
    processAI(val);
    input.value = '';
}

async function processAI(prompt) {
    showThinking();
    try {
        const aiResponse = await AI_CONFIG.fetchAIResponse(prompt);
        hideThinking();
        appendMessage('ai', aiResponse || "No response from AI.");
    } catch (e) {
        hideThinking();
        appendMessage('ai', "Error: Check your API Key.");
    }
}

function appendMessage(role, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-8`;
    const content = role === 'ai' ? marked.parse(text) : text;
    div.innerHTML = `<div class="message-bubble ${role === 'user' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-zinc-800'} shadow-sm">${content}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    saveToHistory(role, text);
}

function showThinking() {
    if(document.getElementById('thinkingIndicator')) return;
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.id = 'thinkingIndicator';
    div.className = 'flex justify-start mb-8';
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
    if (!history[currentChatId]) history[currentChatId] = { title: text.substring(0, 20), messages: [] };
    history[currentChatId].messages.push({ role, text });
    localStorage.setItem('khittara_history', JSON.stringify(history));
    loadHistoryUI();
}

function loadHistoryUI() {
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    const list = document.getElementById('chatHistoryList');
    if (!list) return;
    list.innerHTML = '';
    Object.keys(history).reverse().forEach(id => {
        const item = document.createElement('div');
        item.className = 'p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-sm truncate mb-1';
        item.innerHTML = `<i class="far fa-comment-alt mr-3 text-yellow-500"></i> ${history[id].title}`;
        item.onclick = () => {
            currentChatId = id;
            document.getElementById('chatMessages').innerHTML = '';
            history[id].messages.forEach(m => {
                const container = document.getElementById('chatMessages');
                const div = document.createElement('div');
                div.className = `flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-8`;
                const content = m.role === 'ai' ? marked.parse(m.text) : m.text;
                div.innerHTML = `<div class="message-bubble ${m.role === 'user' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-zinc-800'}">${content}</div>`;
                container.appendChild(div);
            });
            switchView('chat');
        };
        list.appendChild(item);
    });
}
window.onload = loadHistoryUI;
