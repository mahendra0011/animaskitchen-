import fs from 'node:fs';

let key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
if (!key && fs.existsSync('.env')) {
  const match = fs.readFileSync('.env', 'utf-8').match(/VITE_GEMINI_API_KEY=["']?([^"'\r\n]+)/);
  if (match) key = match[1];
}

const models = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3-flash-preview',
  'gemini-pro-latest',
  'gemini-3.1-pro-preview',
  'gemma-4-26b-a4b-it',
  'gemma-4-31b-it'
];

async function testOne(model) {
  const start = Date.now();
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hi from Anima Kitchen in 5 words.' }] }]
      }),
      signal: AbortSignal.timeout(7000)
    });
    const data = await res.json();
    const ms = Date.now() - start;
    if (res.ok) {
      const txt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      console.log(`✅ [${model}] in ${ms}ms -> "${txt}"`);
      return { model, ok: true, ms, text: txt };
    } else {
      console.log(`❌ [${model}] (${res.status}): ${data.error?.message?.slice(0, 120)}`);
      return { model, ok: false, error: data.error?.message };
    }
  } catch (e) {
    console.log(`⚠️ [${model}] ${e.message}`);
    return { model, ok: false, error: e.message };
  }
}

async function main() {
  console.log('Testing models with user key...');
  for (const m of models) {
    await testOne(m);
  }
}
main();
