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
import { getCurrentDate } from '../utils/date'

import { v4 as uuidv4 } from 'uuid';


export default function Home() {
  
  // Conversation states
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null);
  // const [currentSystemPrompt, setCurrentSystemPrompt] = useState(null)
  // const [currentTemperature, setCurrentTemperature] = useState(null)

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
    } else {  
      // If we did not have a conversation saved then we init a new one
      const newConversation = {
        id: uuidv4(),
        name: `New Conversation ${conversations.length + 1}`,
        dateCreated: getCurrentDate(),
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

  // const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Generic function to update some attribute, e.g. temperature or prompt
  const handleUpdateConversation = (conversation, data) => {
      const updatedConversation = {
        ...conversation,
        [data.key]: data.value,
      };

      const updatedConversations = conversations.map((c) => {
        if (c.id === updatedConversation.id) {
          return updatedConversation;
        }
    
        return c;
      });

      handleSaveConversations(updatedConversations)
      handleSaveSelectedConversation(updatedConversation)
  };

  // The "main" send function to send messages to chat & update accordingly
  const handleSendChat = async (conversation) => {
    // We update the conversation with the one we sent
    // const sendingConversation = {
    //   ...selectedConversation,
    //   prompt: currentSystemPrompt,
    //   temperature: currentTemperature
    // }
    handleSaveSelectedConversation(conversation)

    // sleep(500000)

    const messages = conversation.messages
    const chatBody = {
      messages: messages,
      prompt: conversation.prompt,
      temperature: conversation.temperature,
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

    if (conversation.messages.length === 1) {
      const content = conversation.messages[0].content
      const customName = content.length > 20 ? content.substring(0, 20) + '...' : content;
      conversation.name = customName
    }

    if (!response.ok) {
      // We do not save the last message sent from us if something went wrong
      messages.pop()
      console.log({messages})

      updatedConversation = {
        ...conversation,
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
        ...conversation,
        messages: [...updatedMessages]
      }
      handleSaveSelectedConversation(updatedConversation)
    }

    // Save the selectedConversation in our conversationS as well
    const updatedConversations = conversations.map(
      (c) => {
        if (c.id === conversation.id) {
          return updatedConversation;
        }
        return c;
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
                handleSendChat={handleSendChat}
                handleUpdateConversation={handleUpdateConversation}
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