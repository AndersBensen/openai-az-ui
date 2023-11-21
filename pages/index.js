import Head from "next/head";
import { useState, useEffect, useRef } from "react";

// Used to parse message contents as markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Promptbar } from "../components/Prompt/Promptbar";
import { Converationbar } from "../components/Conversation/Conversationbar";
import { Chat } from "../components/Chat/Chat";

export default function Home() {
  
  const [conv, setConv] = useState([]);

  const [currentSystemPrompt, setCurrentSystemPrompt] = useState(null)
  const [currentTemperature, setCurrentTemperature] = useState(null)


  // REMOVE THIS -- START
  // var selectedConversation = [
  //     // {   
  //     //     role: "user",
  //     //     content: "FIRST MSG YALL"
  //     // },
  //     // {
  //     //     role: "assistant",
  //     //     content: "HI THERE",
  //     // },
  //     // {   
  //     //     role: "user",
  //     //     content: "HI BACK U"
  //     // },
  //     // {
  //     //     role: "assistant",
  //     //     content: "AWWW SHIT"
  //     // }
  // ]
  // if (conv == null) {
  //   setConv(selectedConversation)
  // }
  // REMOVE THIS -- END

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

      console.log("response body; ",responeBody)

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
            <Converationbar/>

            <div className="flex flex-1">
            <Chat 
              selectedConversation={conv} 
              updateSelectedConversation={handleUpdateConversation}
              onChangePrompt={setCurrentSystemPrompt}
              onChangeTemperature={setCurrentTemperature}
            />
            </div>
            <Promptbar/>

        </div>
        {/* </div> */}
        {/* </div> */}
      </main>
    </>
  );
}