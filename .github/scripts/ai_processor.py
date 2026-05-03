import os
import requests
import json
import re

api_key = os.getenv("GEMINI_API_KEY")
issue_body = os.getenv("ISSUE_BODY")

def call_gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()['candidates'][0]['content']['parts'][0]['text']

def main():
    # ၁။ Repository ထဲက ဖိုင်အားလုံးကို စာရင်းလုပ်ပါ
    all_files = []
    for root, dirs, files in os.walk("."):
        for file in files:
            # မလိုအပ်တဲ့ folder တွေကို ဖယ်ထုတ်ပါ
            if not any(x in root for x in ['./.', './github', './node_modules']):
                all_files.append(os.path.join(root, file))

    # ၂။ ဘယ်ဖိုင်ကို ပြင်ရမလဲ AI ကို အရင်မေးပါ
    file_selection_prompt = f"""
    List of files in repo: {all_files}
    User request: "{issue_body}"
    Which file path should be modified? Return ONLY the exact file path from the list.
    """
    file_to_edit = call_gemini(file_selection_prompt).strip().replace('`', '')
    
    # ဖြတ်ထုတ်ထားတဲ့ path ထဲမှာ ရှေ့ဆုံးက ./ ပါရင် ဖယ်ပါ
    file_to_edit = file_to_edit.lstrip("./")

    if not os.path.exists(file_to_edit):
        print(f"Error: File not found: {file_to_edit}")
        return

    # ၃။ ရွေးချယ်လိုက်တဲ့ဖိုင်ကို ဖတ်ပြီး AI ကို ပြင်ခိုင်းပါ
    with open(file_to_edit, "r") as f:
        original_code = f.read()

    edit_prompt = f"""
    File: {file_to_edit}
    Code:
    {original_code}

    User Request: {issue_body}
    
    Instruction: Update the code based on the request. 
    Return ONLY the full updated code. Do not use markdown blocks.
    """
    
    updated_code = call_gemini(edit_prompt)
    clean_code = re.sub(r'^```[a-z]*\n|```$', '', updated_code, flags=re.MULTILINE).strip()

    # ၄။ ပြင်ဆင်ပြီးသားကို ပြန်သိမ်းပါ
    with open(file_to_edit, "w") as f:
        f.write(clean_code)
    
    print(f"Successfully updated: {file_to_edit}")

if __name__ == "__main__":
    main()
