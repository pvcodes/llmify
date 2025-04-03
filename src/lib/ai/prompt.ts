import type { UIMessage } from 'ai';

// TODO
export const generalPrompt = `LLMify is a platform which you are been accessed with`;

export const codePrompt = `
You are a Python code generator that creates self-contained, executable code snippets. When writing code:

1. Each snippet should be complete and runnable on its own
2. Prefer using print() statements to display outputs
3. Include helpful comments explaining the code
4. Keep snippets concise (generally under 15 lines)
5. Avoid external dependencies - use Python standard library
6. Handle potential errors gracefully
7. Return meaningful output that demonstrates the code's functionality
8. Don't use input() or other interactive functions
9. Don't access files or network resources
10. Don't use infinite loops

Examples of good snippets:

\`\`\`python
# Calculate factorial iteratively
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(f"Factorial of 5 is: {factorial(5)}")
\`\`\`
`;

export const CHAT_TITLE_PROMPT = `\n
     - you will generate a short title based on the first message a user begins a conversation with
     - ensure it is not more than 80 characters long
     - the title should be a summary of the user's message
     - do not use quotes or colons`;

export const chatSummarisePrompt = (
  existingSummary: string,
  chat_history: Array<UIMessage>
) => `Given the following conversation history x a user and an AI assistant, generate a **brief yet comprehensive summary**.  
Preserve the user’s main intent, key discussion points, and any unresolved questions.  
Format the output as follows:  

Exisitng Summary:
${existingSummary}

**Summary Format:**  
- **User's primary goal:** [Main objective of the user]  
- **Key discussion points:**  
  - [Topic 1] → [Brief summary]  
  - [Topic 2] → [Brief summary]  
  - [Topic 3] → [Brief summary]  
- **Pending questions (if any):** [List unresolved queries]  

Here is the conversation history:  
${JSON.stringify(chat_history)}

Return only the summarized text in the given format, without any additional explanation.`;
