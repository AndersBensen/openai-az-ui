export const DEFAULT_SYSTEM_PROMPT =
    process.env.DEFAULT_SYSTEM_PROMPT ||
    "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const DEFAULT_TEMPERATURE = 
    parseFloat(process.env.DEFAULT_TEMPERATURE || "0.5");

export const DEFAULT_PROMPT_MAX_LENGTH = 
    parseInt(process.env.DEFAULT_PROMPT_MAX_LENGTH || "256");

export const DEFAULT_INPUT_MAX_LENGTH = 
    parseInt(process.env.DEFAULT_INPUT_MAX_LENGTH || "12000");
