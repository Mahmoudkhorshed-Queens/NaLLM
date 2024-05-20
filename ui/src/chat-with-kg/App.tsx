import React, { useCallback, useEffect, useState, ChangeEvent } from "react";
import { useWebSocket, ReadyState } from "react-use-websocket";

import ChatContainer from "./ChatContainer";
import type { ChatMessageObject } from "./ChatMessage";
import ChatInput from "./ChatInput";
import KeyModal from "../components/keymodal";
import type { ConversationState, WebSocketRequest, WebSocketResponse } from "../../types/websocketTypes";

const SEND_REQUESTS = true;

const chatMessageObjects: ChatMessageObject[] = SEND_REQUESTS
  ? []
  : [
      {
        id: 0,
        type: "input",
        sender: "self",
        message:
          "This is the first message which has decently long text and would denote something typed by the user",
        complete: true,
      },
      {
        id: 1,
        type: "text",
        sender: "bot",
        message:
          "And here is another message which would denote a response from the server, which for now will only be text",
        complete: true,
      },
    ];

const URI =
  import.meta.env.VITE_KG_CHAT_BACKEND_ENDPOINT ??
  "ws://localhost:7860/text2text";

const HAS_API_KEY_URI =
  import.meta.env.VITE_HAS_API_KEY_ENDPOINT ??
  "http://localhost:7860/hasapikey";

const QUESTIONS_URI =
  import.meta.env.VITE_KG_CHAT_SAMPLE_QUESTIONS_ENDPOINT ??
  "http://localhost:7860/questionProposalsForCurrentDb";

function loadKeyFromStorage() {
  return localStorage.getItem("api_key");
}

const QUESTION_PREFIX_REGEXP = /^[0-9]{1,2}[\\w]*[\\.\\)\\-]*[\\w]*/;

function stripQuestionPrefix(question: string): string {
  if (question.match(QUESTION_PREFIX_REGEXP)) {
    return question.replace(QUESTION_PREFIX_REGEXP, "");
  }
  return question;
}

function App() {
  const [messages, setMessages] = useState<ChatMessageObject[]>(chatMessageObjects);
  const [apiKey, setApiKey] = useState<string | null>(loadKeyFromStorage());
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(!apiKey);

  const { sendMessage, lastMessage, readyState } = useWebSocket(URI, {
    queryParams: { apiKey: apiKey ?? "" },
    onOpen: () => console.log("Connected to WebSocket"),
    onClose: () => console.log("Disconnected from WebSocket"),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const response: WebSocketResponse = JSON.parse(lastMessage.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length, type: "text", sender: "bot", message: response.data, complete: true },
      ]);
    }
  }, [lastMessage]);

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessageObject = { id: messages.length, type: "input", sender: "self", message, complete: true };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    const request: WebSocketRequest = { message };
    sendMessage(JSON.stringify(request));
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("api_key", key);
  };

  const handleCloseModal = () => {
    setIsKeyModalOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with Knowledge Graph</h1>
      </header>
      <ChatContainer messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
      <KeyModal
        isOpen={isKeyModalOpen}
        apiKey={apiKey ?? ""}
        onRequestClose={handleCloseModal}
        onCloseModal={handleCloseModal}
        onApiKeyChanged={handleApiKeyChange}
      />
    </div>
  );
}

export default App;
