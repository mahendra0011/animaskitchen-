import json
import re

transcript_path = r"C:\Users\mahen\Downloads\animakitchen-main\animakitchen-main\extract_prompt.py"
# Let's inspect user input #37 or #38 in transcript
transcript_file = r"C:\Users\mahen\.gemini\antigravity-ide\brain\37524c76-84b3-48e8-9b1a-e4a2464cbd2b\.system_generated\logs\transcript_full.jsonl"
with open(transcript_file, "r", encoding="utf-8") as f:
    for line in f:
        if '"USER_INPUT"' in line:
            data = json.loads(line)
            content = data.get("content", "")
            if "Order Booking Menu" in content:
                print("Found match! Content len:", len(content))
                # Search for </body> or </main> or end of base64
                img_end = content.find('"/>', content.find('<img src="data:image'))
                if img_end != -1:
                    after_img = content[img_end:]
                    print("Length after img:", len(after_img))
                    with open("public/after_img_content.html", "w", encoding="utf-8") as out:
                        out.write(after_img)
                else:
                    # Maybe it's closed with >
                    img_end = content.find('>', content.find('<img src="data:image'))
                    after_img = content[img_end:]
                    print("Length after img (>):", len(after_img))
                    with open("public/after_img_content.html", "w", encoding="utf-8") as out:
                        out.write(after_img)
