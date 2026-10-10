import json
import re

transcript_path = r"C:\Users\mahen\.gemini\antigravity-ide\brain\37524c76-84b3-48e8-9b1a-e4a2464cbd2b\.system_generated\logs\transcript_full.jsonl"
user_inputs = []
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        if '"USER_INPUT"' in line:
            user_inputs.append(line)

print("Found user inputs:", len(user_inputs))
if user_inputs:
    data = json.loads(user_inputs[-1])
    content = data.get("content", "")
    print("Raw content len:", len(content))
    clean = re.sub(r'data:image/[^;]+;base64,[^\"]+', '[BASE64_IMAGE]', content)
    clean = re.sub(r'data:image/[^;]+;base64,[^\']+', '[BASE64_IMAGE]', clean)
    with open("public/clean_user_request.html", "w", encoding="utf-8") as out:
        out.write(clean)
    print("Saved clean content, length:", len(clean))
