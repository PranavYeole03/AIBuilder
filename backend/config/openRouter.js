const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
const model = "deepseek/deepseek-chat"

export const generateResponse = async (prompt) => {
  const res = await fetch(openRouterUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "You must return only valid raw JSON."
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1500
    }),
  });
  if (!res.ok) {
    const err = await res.text()
    throw new Error("OpenRouter err" + err)
  }
  const data = await res.json()
  return data.choices[0].message.content
}
