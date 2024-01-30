import { OpenAIClient } from "@azure/openai";
import { ClientSecretCredential } from "@azure/identity";

import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';


export const config = {
    runtime: 'edge',
};

export const AZURE_OPENAI_MAX_TOKENS = parseInt(process.env.AZURE_OPENAI_MAX_TOKENS) || null; 
export const AZURE_OPENAI_MODEL_TOKEN_LIMIT = parseInt(process.env.AZURE_OPENAI_MODEL_TOKEN_LIMIT) || 3800; 
export const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || '';
export const AZURE_OPENAI_SUBSCRIPTION_ID = process.env.AZURE_OPENAI_SUBSCRIPTION_ID || '';
export const AZURE_OPENAI_SECRET = process.env.AZURE_OPENAI_SECRET || '';
export const AZURE_OPENAI_DEPLOYMENT_ID = process.env.AZURE_OPENAI_DEPLOYMENT_ID || '';
export const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID || '';


const countCharsAndTokens = async (prompt, messages) => {

    await init((imports) => WebAssembly.instantiate(wasm, imports));

    const encoder = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );
    
    var charCount = prompt.length
    var tokenCount = encoder.encode(prompt).length
    for (let i = 0; i <= messages.length-1; i++) {
        const message = messages[i];

        const contentLength = message.content.length
        charCount += contentLength;

        const tokens = encoder.encode(message.content)
        tokenCount += tokens.length
    }

    encoder.free()

    return { charCount, tokenCount }
}


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

        const { charCount, tokenCount } = await countCharsAndTokens(prompt, messages)

        if (tokenCount >= AZURE_OPENAI_MODEL_TOKEN_LIMIT) {
            const errorMsg = "Your conversation is currently above the maximum limit. The conversation is " 
                            + tokenCount + " tokens (which corresponds to roughly " + charCount
                            + " characters) and the maximum is " + AZURE_OPENAI_MODEL_TOKEN_LIMIT
                            + " tokens. \n\nPlease start a new conversation."
            return new Response(JSON.stringify({ content: errorMsg }), { status: 500 })
        }

        // const credential = new ClientSecretCredential(AZURE_TENANT_ID, AZURE_OPENAI_SUBSCRIPTION_ID, AZURE_OPENAI_SECRET);
        // const client = new OpenAIClient(AZURE_OPENAI_ENDPOINT, credential);

        // var result = null
        // if (AZURE_OPENAI_MAX_TOKENS) {
        //     result = await client.getChatCompletions(
        //         AZURE_OPENAI_DEPLOYMENT_ID, 
        //         messagesToSend,
        //         {
        //             maxTokens: AZURE_OPENAI_MAX_TOKENS, 
        //             temperature: temperature
        //         }
        //     );
            
        // } else {
        //     result = await client.getChatCompletions(
        //         AZURE_OPENAI_DEPLOYMENT_ID, 
        //         messagesToSend,
        //         {
        //             temperature: temperature
        //         }
        //     );
        // }

        // let content = result.choices[0].message.content
        // let content = "your last message was; " + messages.slice(-1)[0].content
        let content = 'Sure, here\'s an example of a for loop in Python:\n\n```python\nfruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n  print(fruit)\n```\n\nIn this example, we have a list of fruits called `fruits`. We use the `for` loop to iterate over each element in the list, assigning the current element to the variable `fruit` on each iteration. Then we print out the value of `fruit`. The output will be:\n\n```\napple\nbanana\ncherry\n```\n\nYou can replace the `fruits` list with any sequence (such as a string or a range of numbers) and modify the code inside the loop to perform different actions as needed.'

        return new Response(JSON.stringify({ content }), { status: 200 })
    } catch(err) {
        console.log(`An error was thrown; ${err}`)
        const errorMsg = "An error has occured trying to reach ChatGPT. If your conversation is very long try starting a new one, otherwise the system may be down."
        return new Response(JSON.stringify({ content: errorMsg }), { status: 500 })
    }
}