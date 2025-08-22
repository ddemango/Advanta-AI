import { Request, Response } from 'express';

export async function POST(req: Request, res: Response) {
  const { item, moods = [], timeWindow = 120 } = req.body;
  
  if (!item) {
    return res.status(400).json({ error: 'item required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    const primary = moods[0] || 'entertaining';
    return res.json({
      reason: `Fits your ${primary} mood and ~${item.runtime || 'flex'} min window without spoilers.`,
    });
  }

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const systemPrompt = 'Return ONE spoiler-safe reason under 20 words. Mention mood/length, never reveal twists.';
    const userPrompt = `Title: ${item.title}\nMoods: ${moods.join(', ')}\nTime: ${timeWindow} min\nOverview: ${item.overview || ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 40,
      }),
    });

    const json = await response.json();
    const explanation = json.choices?.[0]?.message?.content?.trim() || 'Great mood and length fit.';
    
    res.json({ reason: explanation });
  } catch {
    res.json({ reason: 'Great mood and length fit.' });
  }
}