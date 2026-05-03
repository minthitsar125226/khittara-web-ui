let currentChatId = null;

function newChat() {
    currentChatId = Date.now().toString();
    document.getElementById('chatMessages').innerHTML = '';
    switchView('chat');
    // Sidebar highlight for New Chat
    document.querySelectorAll('.sidebar-icon').forEach(t => t.classList.remove('active-tab'));
    document.querySelector('[onclick="newChat()"]').classList.add('active-tab');
    setTimeout(() => document.getElementById('chatInput').focus(), 100);
}

function startChat() {
    const val = document.getElementById('initialInput').value.trim();
    if (!val) return;
    newChat();
    appendMessage('user', val);
    processAI(val);
    document.getElementById('initialInput').value = '';
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const val = input.value.trim();
    if (!val) return;
    if (!currentChatId) currentChatId = Date.now().toString();
    appendMessage('user', val);
    processAI(val);
    input.value = '';
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-8`;
    const htmlContent = role === 'ai' ? marked.parse(text) : text;
    msgDiv.innerHTML = `<div class="${role === 'user' ? 'bg-gold-500 text-white shadow-lg' : 'bg-gray-100 text-gray-800 prose'} p-5 rounded-[2rem] max-w-[85%]">${htmlContent}</div>`;
    document.getElementById('chatMessages').appendChild(msgDiv);
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
    
    saveToHistory(role, text);
    msgDiv.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
}

function saveToHistory(role, text) {
    let history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    if (!history[currentChatId]) {
        history[currentChatId] = { title: text.substring(0, 20) + '...', messages: [] };
    }
    history[currentChatId].messages.push({ role, text });
    localStorage.setItem('khittara_history', JSON.stringify(history));
    loadHistoryList();
}

function loadHistoryList() {
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    const list = document.getElementById('historyList');
    if (!list) return;
    list.innerHTML = '';
    
    Object.keys(history).reverse().slice(0, 5).forEach(id => {
        const item = document.createElement('div');
        item.className = 'sidebar-icon';
        item.style.fontSize = '10px';
        item.innerHTML = `<i class="far fa-comment-dots text-gold-500"></i><span class="sidebar-label">${history[id].title}</span>`;
        item.onclick = () => loadChat(id);
        list.appendChild(item);
    });
}

function loadChat(id) {
    currentChatId = id;
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    document.getElementById('chatMessages').innerHTML = '';
    switchView('chat');
    history[id].messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-8`;
        const content = msg.role === 'ai' ? marked.parse(msg.text) : msg.text;
        msgDiv.innerHTML = `<div class="${msg.role === 'user' ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-800 prose'} p-5 rounded-[2rem] max-w-[85%]">${content}</div>`;
        document.getElementById('chatMessages').appendChild(msgDiv);
    });
}

async function processAI(prompt) {
    showThinking();
    try {
        const aiResponse = await AI_CONFIG.fetchAIResponse(prompt);
        hideThinking();
        appendMessage('ai', aiResponse);
    } catch (error) {
        hideThinking();
        appendMessage('ai', `Error: Check API Key/Connection`);
    }
}

function showThinking() {
    if(document.getElementById('thinkingIndicator')) return;
    const div = document.createElement('div');
    div.id = 'thinkingIndicator';
    div.className = 'flex justify-start mb-8';
    div.innerHTML = `<div class="bg-gray-50 p-4 rounded-3xl flex items-center space-x-3"><i class="fas fa-microchip thinking-glow"></i><span class="text-[10px] font-bold text-gray-400">KHITTARA IS THINKING...</span></div>`;
    document.getElementById('chatMessages').appendChild(div);
}

function hideThinking() {
    const el = document.getElementById('thinkingIndicator');
    if (el) el.remove();
}
