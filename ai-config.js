// AI Configuration & Logic - Khittara AI
const AI_CONFIG = {
    getApiKey: () => localStorage.getItem('khittara_api_key'),
    getModel: () => localStorage.getItem('khittara_model') || 'gemini-2.5-flash',
    
    async fetchAIResponse(prompt) {
        const apiKey = this.getApiKey();
        const modelName = this.getModel();
        
        if (!apiKey) throw new Error("Settings ထဲတွင် API Key အရင်ထည့်ပေးပါ။");

        const cleanModel = modelName.includes('/') ? modelName.split('/').pop() : modelName;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    role: "user",
                    parts: [{ 
                        text: `You are Khittara AI. Provide a helpful and well-formatted response using Markdown. 
                               Prompt: ${prompt}` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI ဆီမှ အဖြေမရရှိပါ။");
        }
        
        return data.candidates[0].content.parts[0].text;
    }
};
