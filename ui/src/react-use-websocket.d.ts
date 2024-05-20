// react-use-websocket.d.ts
declare module 'react-use-websocket' {
  import { ComponentType } from 'react';

  export type ReadyState = number;
  export type SendMessage = (message: string) => void;
  export type Options = {
    retryOnError?: boolean;
    reconnectAttempts?: number;
    reconnectInterval?: number;
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
    sendJsonMessage: (message: any) => void;
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
