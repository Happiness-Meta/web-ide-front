export interface receiveMessageType {
  receive: ChatMessage[];
}

export interface ChatMessage {
  type: string;
  content: string;
  sender: string;
  // type: string;
  // email: string;
  // userImg: string;
  // containerId: string;
}
