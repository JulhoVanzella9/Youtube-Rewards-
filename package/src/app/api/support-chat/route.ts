import { convertToModelMessages, streamText, UIMessage } from 'ai'

export const maxDuration = 30

// Support context for the AI assistant
const SYSTEM_PROMPT = `You are the TikCash virtual support assistant. Be friendly, professional, and helpful.

IMPORTANT INFORMATION:
- Support email: accesssupport.ai@gmail.com
- TikCash is a platform for courses and rewards
- Refund policy: 30 days after purchase
- To request a refund: send an email to accesssupport.ai@gmail.com with your purchase code

RULES:
1. ALWAYS respond in English
2. Be concise and direct
3. For refund questions, direct them to email: accesssupport.ai@gmail.com
4. For technical issues, suggest restarting the app or clearing cache
5. For payment questions, explain that the processing time is up to 7 business days
6. Never promise something you cannot deliver
7. If you don't know how to answer, direct them to the support email

QUICK RESPONSES:
- Refund: "Please contact us at accesssupport.ai@gmail.com with your purchase code and reason for the refund."
- Withdrawal: "Withdrawals are processed within 7 business days. Please verify your bank details are correct."
- Access: "If you're having access issues, try logging out and back into the app."
- Courses: "Our courses remain available permanently after purchase."

Keep responses short (maximum 3 sentences) unless you need to explain something more complex.`

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
      providerOptions: {
        openai: {
          max_tokens: 500,
          temperature: 0.7,
        },
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Support chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Support chat error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
