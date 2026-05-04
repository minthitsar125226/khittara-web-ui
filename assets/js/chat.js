let currentChatId = null;

// Draggable Input Logic (Keep as before)
const dragArea = document.getElementById('draggableInput');
const dragHandle = document.getElementById('dragHandle');
let isDragging = false, startY, initialBottom;

if(dragHandle) {
    dragHandle.addEventListener('mousedown', startDrag);
    dragHandle.addEventListener('touchstart', startDrag, { passive: false });
}

function startDrag(e) {
    isDragging = true;
    startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    initialBottom = parseInt(window.getComputedStyle(dragArea).bottom);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

function onDrag(e) {
    if (!isDragging) return;
    if (e.type === 'touchmove') e.preventDefault();
    const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = startY - currentY;
    dragArea.style.bottom = `${Math.max(20, Math.min(window.innerHeight - 150, initialBottom + deltaY))}px`;
}
function stopDrag() { isDragging = false; }

/**
 * Sidebar Dynamic Switcher
 * Home ရောက်ရင် History ဖျောက်မယ်၊ Chat ရောက်ရင် ပြမယ်။
 */
const originalSwitchView = window.switchView;
window.switchView = function(viewId) {
    const historySection = document.getElementById('historySection');
    if (viewId === 'home') {
        historySection.classList.add('hidden');
    } else {
        historySection.classList.remove('hidden');
        window.renderHistory();
    }
    // Call original navigation function
    if(typeof window.navToView === 'function') window.navToView(viewId); 
    else {
        document.querySelectorAll('.view-container').forEach(v => v.classList.add('hidden'));
        document.getElementById(viewId + 'View').classList.remove('hidden');
    }
};

window.newChat = function() {
    currentChatId = Date.now().toString();
    document.getElementById('chatMessages').innerHTML = `<div class="flex flex-col items-center justify-center h-full opacity-10"><i class="fas fa-comment-dots text-7xl mb-4"></i><p class="font-bold">Chat Started</p></div>`;
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
    input.value = ''; input.style.height = '40px'; 
    processAI(val);
};

async function processAI(prompt) {
    showThinking();
    try {
        const response = await AI_CONFIG.fetchAIResponse(prompt);
        hideThinking();
        appendMessageUI('ai', response);
    } catch (e) {
        hideThinking();
        appendMessageUI('ai', "Error: Check settings.");
    }
}

function appendMessageUI(role, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-5 px-1`;
    div.innerHTML = `<div class="message-bubble shadow-sm ${role === 'user' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-zinc-800'}">${role === 'ai' ? marked.parse(text) : text}</div>`;
    container.appendChild(div);
    scrollToBottom();
    div.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
    if(role === 'user') saveToHistory(role, text);
}

function showThinking() {
    if(document.getElementById('thinkingIndicator')) return;
    const div = document.createElement('div');
    div.id = 'thinkingIndicator';
    div.className = 'flex justify-start mb-5 px-1';
    div.innerHTML = `<div class="bg-gray-100 dark:bg-zinc-800 p-3 rounded-2xl flex space-x-1"><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.2s"></div><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.4s"></div></div>`;
    document.getElementById('chatMessages').appendChild(div);
    scrollToBottom();
}

function hideThinking() { const el = document.getElementById('thinkingIndicator'); if (el) el.remove(); }

function saveToHistory(role, text) {
    let history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    if (!history[currentChatId]) history[currentChatId] = { title: text.substring(0, 30).replace(/\n/g, " ") + "...", messages: [] };
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
        item.className = 'group flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer mb-1';
        item.innerHTML = `<div class="flex items-center flex-1 overflow-hidden" onclick="loadChat('${id}')"><i class="far fa-comment-alt mr-3 text-gray-400 text-xs"></i><span class="text-xs truncate dark:text-gray-300">${history[id].title}</span></div><button onclick="deleteChat(event, '${id}')" class="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><i class="fas fa-trash-alt text-[10px]"></i></button>`;
        list.appendChild(item);
    });
};

window.deleteChat = function(e, id) {
    e.stopPropagation();
    if(confirm('Delete history?')) {
        let history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
        delete history[id]; localStorage.setItem('khittara_history', JSON.stringify(history));
        if (currentChatId === id) window.newChat();
        window.renderHistory();
    }
};

window.loadChat = function(id) {
    const history = JSON.parse(localStorage.getItem('khittara_history') || '{}');
    if(!history[id]) return;
    currentChatId = id; window.switchView('chat'); document.getElementById('chatMessages').innerHTML = '';
    history[id].messages.forEach(m => appendMessageUI(m.role, m.text));
};

function scrollToBottom() { const container = document.getElementById('chatMessages'); container.scrollTop = container.scrollHeight; }

document.addEventListener('DOMContentLoaded', () => {
    window.renderHistory();
    // Initial hide if on home
    if(document.getElementById('homeView').classList.contains('view-active') || !document.getElementById('homeView').classList.contains('hidden')) {
        document.getElementById('historySection').classList.add('hidden');
    }
});
