import Head from "next/head";
import { useState, useEffect, useRef } from "react";

// Used to parse message contents as markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Promptbar } from "../components/Prompt/Promptbar";
import { Conversationbar } from "../components/Conversation/Conversationbar";
import { Chat } from "../components/Chat/Chat";

import { saveSelectedConversation, saveConversations } from '../utils/conversation'
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '../utils/constants'

import { v4 as uuidv4 } from 'uuid';


export default function Home() {
  
  // Conversation states
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState(null)
  const [currentTemperature, setCurrentTemperature] = useState(null)

  // PromptBar states
  const [prompts, setPrompts] = useState([]);
  
  // THINGS TO DO THERE IS A STATE CHANGE OF THE MAIN PAGE (or on first render)
  useEffect(() => {
    const loadedPrompts = localStorage.getItem('prompts');
    if (loadedPrompts) {
        setPrompts(JSON.parse(loadedPrompts))
    }

    const loadedConversations = localStorage.getItem('conversations');
    if (loadedConversations) {
      setConversations(JSON.parse(loadedConversations))
    }

    const loadedSelectedConversation = localStorage.getItem('selectedConversation')
    if (loadedSelectedConversation) {
      // If we had a conversation saved then we load in its state
      const parsedLoadedConversation = JSON.parse(loadedSelectedConversation)
      setSelectedConversation(parsedLoadedConversation)
      setCurrentSystemPrompt(parsedLoadedConversation.prompt)
      setCurrentTemperature(parsedLoadedConversation.temperature)
    } else {  
      // If we did not have a conversation saved then we init a new one
      const newConversation = {
        id: uuidv4(),
        name: 'New Conversation',
        messages: [],
        prompt: DEFAULT_SYSTEM_PROMPT,
        temperature: DEFAULT_TEMPERATURE
      };
      setSelectedConversation(newConversation)
    }

  }, []); 


  // Function to save conversationS, both in cookies and memory
  const handleSaveConversations = (conversations) => {
    saveConversations(conversations)
    setConversations(conversations)
  }

  // Function to save selected conversation, both in cookies and memory
  const handleSaveSelectedConversation = (selectedConversation) => {
    saveSelectedConversation(selectedConversation)
    setSelectedConversation(selectedConversation)
  }

  // The "main" send function to send messages to chat & update accordingly
  const handleUpdateConversation = async (conversation) => {
    // We update the conversation with the one we sent
    const sendingConversation = {
      ...selectedConversation,
      prompt: currentSystemPrompt,
      temperature: currentTemperature
    }
    handleSaveSelectedConversation(sendingConversation)

    const messages = conversation.messages
    const chatBody = {
      messages: messages,
      prompt: currentSystemPrompt,
      temperature: currentTemperature,
    };

    const body = JSON.stringify(chatBody);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });



    var updatedConversation = null
    if (!response.ok) {
      // We do not save the last message sent from us if something went wrong
      messages.pop()
      console.log({messages})

      updatedConversation = {
        ...sendingConversation,
        messages: [...messages]
      }
      handleSaveSelectedConversation(updatedConversation)
      alert('We had trouble reaching GPT currently, please try again later.');
    }
    else {
      // If everything went fine we update our conversation with what GPT responded
      const responeBody = await response.json()

      const updatedMessages = [
        ...messages,
        {content: responeBody.content, role: "assistant"}
      ]
      updatedConversation = {
        ...sendingConversation,
        messages: [...updatedMessages]
      }
      handleSaveSelectedConversation(updatedConversation)
    }

    // Save the selectedConversation in our conversationS as well
    const updatedConversations = conversations.map(
      (conversation) => {
        if (conversation.id === selectedConversation.id) {
          return updatedConversation;
        }
        return conversation;
      },
    );
    if (updatedConversations.length === 0) {
      updatedConversations.push(updatedConversation);
    }
    handleSaveConversations(updatedConversations);
  }

  
  return (
    <>
      <Head>
        <title>GPT Chatbot</title>
        <meta
          name="description"
          content={
            "GPT Chatbot: A simple ChatGPT-powered chatbot" +
            " built with Next.js and Tailwind CSS"
          }
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
          className={`flex h-screen w-screen flex-col text-sm text-white dark:text-white`}
        >
        <div className="flex h-full w-full pt-[48px] sm:pt-0">
            <Conversationbar
              conversations={conversations}
              selectedConversation={selectedConversation}
              handleSaveSelectedConversation={handleSaveSelectedConversation}
              handleSaveConversations={handleSaveConversations}
            />

            <div className="flex flex-1">
              <Chat 
                selectedConversation={selectedConversation} 
                updateSelectedConversation={handleUpdateConversation}
                onChangePrompt={setCurrentSystemPrompt}
                onChangeTemperature={setCurrentTemperature}
              />
            </div>

            <Promptbar
              prompts={prompts}
              setPrompts={setPrompts}
            />
        </div>
      </main>
    </>
  );
}