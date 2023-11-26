import Head from "next/head";
import { useState, useEffect, useRef } from "react";

// Used to parse message contents as markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Promptbar } from "../components/Prompt/Promptbar";
import { Conversationbar } from "../components/Conversation/Conversationbar";
import { Chat } from "../components/Chat/Chat";

export default function Home() {
  
  // Conversation states
  const [conv, setConv] = useState([]);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState(null)
  const [currentTemperature, setCurrentTemperature] = useState(null)

  // PromptBar states
  const [prompts, setPrompts] = useState([]);
  
  // THINGS TO DO THERE IS A STATE CHANGE OF THE MAIN PAGE
  useEffect(() => {
    const loadedPrompts = localStorage.getItem('prompts');
    if (loadedPrompts) {
        setPrompts(JSON.parse(loadedPrompts))
    }
  }, []); 

  const handleUpdateConversation = async (messages) => {
    // First we update the messages with the one we sent
    setConv(messages)

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


    if (!response.ok) {
      alert('We had trouble reaching ChatGPT currently, sorry.');
    }
    else {
      const responeBody = await response.json()

      const updatedMessages = [
        ...messages,
        {role: "assistant", content: responeBody.content}
      ]

      // Later we update the messages with the one chat sent
      setConv(updatedMessages)
    }
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
      {/* <main className="mx-auto h-screen max-w-full sm:max-w-3xl"> */}
        {/* <div className="py-8"> */}
        {/* <div className="flex h-full w-full pt-[48px] sm:pt-0"> */}

        <div className="flex h-full w-full pt-[48px] sm:pt-0">
            <Conversationbar/>

            <div className="flex flex-1">
            <Chat 
              selectedConversation={conv} 
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
        {/* </div> */}
        {/* </div> */}
      </main>
    </>
  );
}