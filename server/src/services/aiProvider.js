import { config } from '../config/env.js';

// FR-07: provider-specific code stays in this file so swapping Groq changes one adapter and .env.
export async function requestJson({ model, system, user }) {
  if (!config.ai.apiKey) return null;
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.ai.timeoutMs);
    try {
      const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.ai.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, temperature: 0.2, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
        signal: controller.signal
      });
      if (response.status === 429 && attempt === 0) { await new Promise((resolve) => setTimeout(resolve, 250)); continue; }
      if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new Error('AI provider returned no content');
      const cleaned = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      lastError = error;
      if (error.name === 'AbortError') break;
    } finally {
      clearTimeout(timeout);
    }
  }
  console.warn(`[ai] unavailable: ${lastError?.message || 'unknown error'}`);
  return null;
}
