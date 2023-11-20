import {
    useEffect,
    useRef,
    useState,
  } from 'react';

export const InitialChat = ({onChangeTemperature, onChangePrompt}) => {

    // --------- SystemPrompt stuff -------------
    console.log("COMPILED INIT CHAT")
        
    const [systemPrompt, setSystemPrompt] = useState("You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.");
    onChangePrompt(systemPrompt)

    const textareaRef = useRef(null);
    const maxLength = 128

    const handleSystemPromptChange = (event) => {
        const systemPrompt = event.target.value;
        const systemtPromptLength = systemPrompt.length
    
        if (systemtPromptLength > maxLength) {
          alert(`Prompt limit is ${maxLength}} characters. You have entered ${systemtPromptLength} characters.`);
          return;
        }
    
        setSystemPrompt(systemPrompt);
    
        if (systemPrompt.length > 0) {
          onChangePrompt(systemPrompt);
        }
    };

    useEffect(() => {
        if (textareaRef && textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
        }
    }, [systemPrompt]);

    // --------- Temperature stuff -----------

    const [temperature, setTemperature] = useState(0.5);
    onChangeTemperature(temperature)

    const handleTemperatureChange = (event) => {
        const newTemperature = parseFloat(event.target.value);
        setTemperature(newTemperature);
        onChangeTemperature(newTemperature);
    };


    return (
        <div className="mx-auto flex flex-col space-y-5 md:space-y-10 px-3 pt-5 md:pt-12 sm:max-w-[600px]"> 
            <div className="flex h-full flex-col space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-600">  

                {/* ---- SystemPrompt stuff ---- */}
                <div className="flex flex-col">
                    <label className="mb-2 text-left text-neutral-700 dark:text-neutral-400">
                        System Prompt
                    </label>
                    <textarea
                        ref={textareaRef}
                        className="w-full rounded-lg border border-neutral-200 bg-transparent px-4 py-3 text-neutral-900 dark:border-neutral-600 dark:text-neutral-100"
                        style={{
                        resize: 'none',
                        bottom: `${textareaRef?.current?.scrollHeight}px`,
                        maxHeight: '300px',
                        overflow: `${
                            textareaRef.current && textareaRef.current.scrollHeight > 400
                            ? 'auto'
                            : 'hidden'
                        }`,
                        }}
                        placeholder={
                            'Enter a prompt or type "/" to select a prompt...' || ''
                        }
                        value={systemPrompt || ''}
                        rows={1}
                        onChange={handleSystemPromptChange}
                    />
                </div>
                

                {/* ---- Temperature stuff ---- */}
                <div className="flex flex-col">
                    <label className="mb-2 text-left text-neutral-700 dark:text-neutral-400">
                        Temperature
                    </label>
                    <span className="text-[12px] text-black/50 dark:text-white/50 text-sm">
                        Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
                    </span>
                    <span className="mt-2 mb-1 text-center text-neutral-900 dark:text-neutral-100">
                        {temperature.toFixed(1)}
                    </span>
                    <input
                        className="cursor-pointer"
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={temperature}
                        onChange={handleTemperatureChange}
                    />
                    <ul className="w mt-2 pb-8 flex justify-between px-[24px] text-neutral-900 dark:text-neutral-100">
                        <li className="flex justify-center">
                            <span className="absolute">Precise</span>
                        </li>
                        <li className="flex justify-center">
                            <span className="absolute">Neutral</span>
                        </li>
                        <li className="flex justify-center">
                            <span className="absolute">Creative</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
