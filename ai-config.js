// AI Configuration & Logic
const AI_CONFIG = {
    // LocalStorage ကနေ data တွေ ဆွဲထုတ်ခြင်း
    getApiKey: () => localStorage.getItem('khittara_api_key'),
    getModel: () => localStorage.getItem('khittara_model') || 'gemini-2.5-flash',
    
    // API Call လုပ်မည့် Function
    async fetchAIResponse(prompt) {
        const apiKey = this.getApiKey();
        const modelName = this.getModel();
        
        if (!apiKey) throw new Error("API Key မတွေ့ပါ။");

        // model path ကို သန့်စင်ခြင်း
        const cleanModel = modelName.includes('/') ? modelName.split('/').pop() : modelName;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        return data.candidates[0].content.parts[0].text;
    }
};
