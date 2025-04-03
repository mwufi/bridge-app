import { ExpoRequest, ExpoResponse } from 'expo-router/server';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    const { id } = request.params || {};
    
    if (!id) {
      return Response.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    // Parse the request body to pass the user message along
    let userMessage = null;
    try {
      const body = await request.json();
      userMessage = body.message;
    } catch (e) {
      console.log('No message body or invalid JSON');
    }

    // Call the backend service to generate an AI response for the thread
    const response = await fetch(`http://localhost:8000/threads/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: userMessage ? JSON.stringify({ message: userMessage }) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to get AI response: ${errorData}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in chat API:', error);
    return Response.json({ 
      error: 'Failed to get AI response', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}