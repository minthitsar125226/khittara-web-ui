let currentChatId = null;

function newChat() {
    currentChatId = Date.now().toString();
    document.getElementById('chatMessages').innerHTML = '';
    switchView('chat');
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
    msgDiv.innerHTML = `<div class="${role === 'user' ? 'bg-gold-500 text-white shadow-lg' : 'bg-gray-100 text-gray-800 prose'} p-6 rounded-[2rem] max-w-[85%]">${htmlContent}</div>`;
    document.getElementById('chatMessages').appendChild(msgDiv);
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
    msgDiv.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
}

async function processAI(prompt) {
    showThinking();
    try {
        const aiResponse = await AI_CONFIG.fetchAIResponse(prompt);
        hideThinking();
        appendMessage('ai', aiResponse);
    } catch (error) {
        hideThinking();
        appendMessage('ai', `Error: ${error.message}`);
    }
}

function showThinking() {
    if(document.getElementById('thinkingIndicator')) return;
    const div = document.createElement('div');
    div.id = 'thinkingIndicator';
    div.className = 'flex justify-start mb-8';
    div.innerHTML = `<div class="bg-gray-50 p-4 rounded-3xl flex items-center space-x-3"><i class="fas fa-microchip thinking-glow"></i><span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Khittara is thinking...</span></div>`;
    document.getElementById('chatMessages').appendChild(div);
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}

function hideThinking() {
    const el = document.getElementById('thinkingIndicator');
    if (el) el.remove();
}
