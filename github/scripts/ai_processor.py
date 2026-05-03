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
    # ၁။ Repository ထဲမှာရှိသမျှ ဖိုင်စာရင်းကို ယူပါ (assets, js, css အကုန်ပါအောင်)
    all_files = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if not file.startswith('.') and not root.startswith('./.'):
                all_files.append(os.path.join(root, file))

    # ၂။ AI ကို ဘယ်ဖိုင်ပြင်ရမလဲ အရင်မေးပါ
    file_selection_prompt = f"""
    List of files in repository: {all_files}
    User request: "{issue_body}"
    Which file from the list should be modified? Return ONLY the file path.
    """
    file_to_edit = call_gemini(file_selection_prompt).strip().replace('`', '')

    if not os.path.exists(file_to_edit):
        print(f"Error: AI suggested {file_to_edit} but it doesn't exist.")
        return

    # ၃။ ရွေးချယ်လိုက်တဲ့ဖိုင်ကို ဖတ်ပြီး ပြင်ခိုင်းပါ
    with open(file_to_edit, "r") as f:
        original_code = f.read()

    edit_prompt = f"""
    File: {file_to_edit}
    Current Content:
    {original_code}

    User Request:
    {issue_body}

    Instruction: Provide the FULL updated content for {file_to_edit}. 
    Return ONLY the code. No explanations. No markdown blocks.
    """
    
    updated_code = call_gemini(edit_prompt)
    clean_code = re.sub(r'^```[a-z]*\n|```$', '', updated_code, flags=re.MULTILINE).strip()

    # ၄။ ပြင်ဆင်ပြီးသားကို ပြန်သိမ်းပါ
    with open(file_to_edit, "w") as f:
        f.write(clean_code)
    
    print(f"Successfully updated: {file_to_edit}")

if __name__ == "__main__":
    main()
