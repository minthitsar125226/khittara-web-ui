let currentChatId = null;

function newChat() {
    currentChatId = Date.now().toString();
    document.getElementById('chatMessages').innerHTML = '';
    switchView('chat');
    setTimeout(() => document.getElementById('chatInput').focus(), 100);
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

function appendMessage(role, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-6`;
    const content = role === 'ai' ? marked.parse(text) : text;
    div.innerHTML = `<div class="${role === 'user' ? 'bg-gold-500 text-white' : 'bg-gray-100 dark:bg-zinc-800'} p-4 rounded-2xl max-w-[80%] shadow-sm">${content}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    saveToHistory(role, text);
}

function saveToHistory(role, text) {
    let history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    if (!history[currentChatId]) history[currentChatId] = { title: text.substring(0,20), messages: [] };
    history[currentChatId].messages.push({ role, text });
    localStorage.setItem('khittara_history', JSON.stringify(history));
    loadHistoryUI();
}

function loadHistoryUI() {
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    const list = document.getElementById('chatHistoryList');
    list.innerHTML = '';
    Object.keys(history).reverse().forEach(id => {
        const item = document.createElement('div');
        item.className = 'p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-sm truncate mb-1';
        item.innerHTML = `<i class="far fa-comment-alt mr-2"></i> ${history[id].title}`;
        item.onclick = () => loadChat(id);
        list.appendChild(item);
    });
}

function loadChat(id) {
    currentChatId = id;
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    document.getElementById('chatMessages').innerHTML = '';
    history[id].messages.forEach(m => appendMessage(m.role, m.text));
}

window.onload = loadHistoryUI;
