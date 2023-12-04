import {
    useRef,
    useEffect,
} from 'react';

import {
    IconRobot,  
} from '@tabler/icons-react';

import { ChatInput } from "./ChatInput"
import { ChatMessage } from "./ChatMessage"
import { InitialChat } from './InitialChat';

export const Chat = ({selectedConversation, handleSendChat, handleUpdateConversation, isInferring}) => {

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);

    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        textareaRef.current?.focus();
    };

    useEffect(() => {
        scrollToBottom()
    }, [selectedConversation]);
    

    const handleSend = (message) => {
        const updatedMessages = [...selectedConversation.messages];
        const updatedConversation = {
            ...selectedConversation,
            messages: [...updatedMessages, message]
        }

        handleSendChat(updatedConversation)
    }

    return (
        <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
            <div
                className="max-h-full overflow-x-hidden"
                ref={chatContainerRef}
            >
                
                { selectedConversation?.messages.length == 0 ? (
                    <>
                        <InitialChat 
                            onChangePrompt={(prompt) =>
                                handleUpdateConversation(selectedConversation, {
                                    key: 'prompt',
                                    value: prompt,
                                })
                            }
                            onChangeTemperature={(temperature) =>
                                handleUpdateConversation(selectedConversation, {
                                    key: 'temperature',
                                    value: temperature,
                                })
                              }
                        />
                    </>
                    
                ) : (
                    <>
                        {selectedConversation?.messages.map((message, index) => (
                            <ChatMessage message={message} key={index}/>
                        ))
                        }

                        {isInferring && (
                            <div className="group border-b border-black/10 bg-gray-50 text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100">
                                <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                                    <div className="min-w-[40px] items-end">
                                        <IconRobot size={30} />
                                    </div>
                                    {/* Below is a spinner for when inference is in progress*/}
                                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"/>
                                </div>
                            </div>
                        )}

                        <div
                            className="h-[162px] bg-white dark:bg-[#343541]"
                            ref={messagesEndRef}
                        />
                    </>
                )}
            </div>
            <ChatInput 
                sendMsg={handleSend}
                textareaRef={textareaRef}
                isInferring={isInferring}
            />
        </div>
    )
}