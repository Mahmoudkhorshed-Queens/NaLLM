declare module 'react-use-websocket' {
    import { ComponentType } from 'react';
  
    export type ReadyState = number;
    export type SendMessage = (message: string) => void;
    export type Options = {
      fromSocketIO?: boolean;
      share?: boolean;
      onOpen?: () => void;
      onClose?: () => void;
      onMessage?: (message: WebSocketEventMap['message']) => void;
      onError?: (error: WebSocketEventMap['error']) => void;
      filter?: () => boolean;
    };
  
    export function useWebSocket(
      url: string,
      options?: Options
    ): {
      sendMessage: SendMessage;
      lastMessage: WebSocketEventMap['message'] | null;
      readyState: ReadyState;
    };
  

    export const ReadyState: {
      CONNECTING: number;
      OPEN: number;
      CLOSING: number;
      CLOSED: number;
    };
  
    const WebSocketComponent: ComponentType<{ url: string; options?: Options }>;
    export default WebSocketComponent;
  

}

import { useWebSocket, ReadyState } from 'react-use-websocket';
const URI = import.meta.env.VITE_KG_CHAT_BACKEND_ENDPOINT ?? "ws://localhost:7860/text2text";

const { sendJsonMessage, lastMessage, readyState } = useWebSocket(URI, {
  shouldReconnect: () => true,
  reconnectInterval: 5000,
});


  
  