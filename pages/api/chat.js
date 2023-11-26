import { OpenAIClient } from "@azure/openai";
import { ClientSecretCredential } from "@azure/identity";

export const config = {
    runtime: 'edge',
};

export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";
export const DEFAULT_TEMPERATURE = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || "1");


export const AZURE_OPENAI_MAX_TOKENS = parseInt(process.env.AZURE_OPENAI_MAX_TOKENS) || null; 
export const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || '';
export const AZURE_OPENAI_SUBSCRIPTION_ID = process.env.AZURE_OPENAI_SUBSCRIPTION_ID || '';
export const AZURE_OPENAI_SECRET = process.env.AZURE_OPENAI_SECRET || '';
export const AZURE_OPENAI_DEPLOYMENT_ID = process.env.AZURE_OPENAI_DEPLOYMENT_ID || '';
export const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID || '';


export default async function handler(req) {
    try {
        const body = await req.json()
        const {messages, prompt, temperature} = body

        console.log("Received prompt & temperature;", {prompt}, {temperature})

        var messagesToSend = [
            {
                role: 'system',
                content: prompt,
            },
            ...messages,
        ]

        // console.log({messagesToSend})

        // const credential = new ClientSecretCredential(AZURE_TENANT_ID, AZURE_OPENAI_SUBSCRIPTION_ID, AZURE_OPENAI_SECRET);
        // const client = new OpenAIClient(AZURE_OPENAI_ENDPOINT, credential);

        // const result = await client.getChatCompletions(
        //     AZURE_OPENAI_DEPLOYMENT_ID, 
        //     messagesToSend,
        //     {
        //         maxTokens: AZURE_OPENAI_MAX_TOKENS, 
        //         temperature: temperature
        //     }
        // );

        // let content = result.choices[0].message.content
        // console.log(messages.slice(-1)[0].content)
        let content = "your last message was; " + messages.slice(-1)[0].content
        // let content = 'Sure, here\'s an example of a for loop in Python:\n\n```python\nfruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n  print(fruit)\n```\n\nIn this example, we have a list of fruits called `fruits`. We use the `for` loop to iterate over each element in the list, assigning the current element to the variable `fruit` on each iteration. Then we print out the value of `fruit`. The output will be:\n\n```\napple\nbanana\ncherry\n```\n\nYou can replace the `fruits` list with any sequence (such as a string or a range of numbers) and modify the code inside the loop to perform different actions as needed.'

        return new Response(JSON.stringify({content}, 200))
    } catch {
        return new Response(JSON.stringify("An error has occured trying to reach ChatGPT."), 500)
    }
}