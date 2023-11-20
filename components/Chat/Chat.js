import {
    useState,
    useRef,
    useCallback,
    useEffect,
  } from 'react';


import { ChatInput } from "./ChatInput"
import { ChatMessage } from "./ChatMessage"
import { InitialChat } from './InitialChat';

export const Chat = ({selectedConversation, updateSelectedConversation, onChangePrompt, onChangeTemperature}) => {

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
    

    const handleSend = (message, role) => {
        var updatedConversation = [
            ...selectedConversation, 
            {role: role, content: message}
        ]
        updateSelectedConversation(updatedConversation)
    }

    return (
        <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
            <div
                className="max-h-full overflow-x-hidden"
                ref={chatContainerRef}
            >
                
                {selectedConversation.length == 0 ? (
                    <>
                        <InitialChat onChangePrompt={onChangePrompt} onChangeTemperature={onChangeTemperature}/>
                    </>
                    
                ) : (
                    <>
                        {selectedConversation.map((message, index) => (
                            <ChatMessage message={message} key={index}/>
                        ))
                        }
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
            />
        </div>
    )
}