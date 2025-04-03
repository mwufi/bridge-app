import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://chatapp.vercel.app', // Optional. Site URL for rankings on openrouter.ai.
        'X-Title': 'Chat App', // Optional. Site title for rankings on openrouter.ai.
    },
});

export async function GET(request: Request) {
    // Get the thread ID from the URL
    const url = new URL(request.url);
    const threadId = url.pathname.split('/').pop();

    const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-2024-11-20",
        messages: [{ role: "user", content: "You are on the thread " + threadId + " and you are a helpful assistant." }],
    });
    console.log("AI said:", response.choices[0].message.content);
    return Response.json({ response, threadId });
}