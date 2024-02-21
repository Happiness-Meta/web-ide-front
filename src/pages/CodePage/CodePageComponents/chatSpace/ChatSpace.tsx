import editorStore from "../../../../store/CodePageStore/editorStore";
import styles from "./ChatSpace.module.css";
import Stomp, { Client } from "stompjs";
import { useEffect, useRef, useState } from "react";
import userAxiosWithAuth from "../../../../utils/useAxiosWIthAuth";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import axios from "axios";

interface ChatMessage {
  sender: string;
  content: string;
  type: "JOIN" | "LEAVE" | "CHAT";
}

function ChatSpace() {
  const { repoId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { rightSpace } = editorStore();
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [cookies] = useCookies(["token", "nickname"]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<Client | null>(null);
  const [entered, setEntered] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [nowExistUser, setNowExistUser] = useState("");

  const requestChatInitialData = async () => {
    try {
      const response = await userAxiosWithAuth.get(`/chat/${repoId}/messages`);
      setMessages((prevMessages) => [...prevMessages, ...response.data.results]);
      console.log(messages);
      setInitialDataLoaded(true);
      console.log("이거 리스폰스", response);
    } catch (error) {
      console.error("이거 나오면 엑시오스 에러", error);
    }
  };

  //전체 불러왔을 때 채팅량이 많아지면 어떻게 할 것인가? (더 불러오기 같은것들)
  //전체 다 구현할 것 / 스크롤로 미리 불러오되 버튼 누르면 보여지게 한다든지
  //한번에 다 불러올 때의 문제점 생각해본다. -> 시간상 못 구현, 앞으로 구현 예정이라고 답해도 ok

  useEffect(() => {
    if (!initialDataLoaded) {
      requestChatInitialData();
    }
  }, [repoId, initialDataLoaded]);

  //useEffect를 두번 쓰는 이유?

  useEffect(() => {
    // userName을 cookies에서 가져온 nickname으로 초기화
    setUserName(cookies.nickname);
    console.log("이건 닉네임인가? ", userName);

    if (!rightSpace) {
      connect();
      console.log("rightSpace");
    }
  }, [rightSpace, cookies.nickname]);

  const connect = async () => {
    if (clientRef.current === null) {
      // 웹 소켓 fallback (소켓 통신 멈췄을 때, http로도 메시지 전송 받을 수 있게 함)
      const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
      const client = Stomp.over(socket);
      console.log("여기까지는 오게 됨");
      client.connect({}, onConnected, onError);
      clientRef.current = client;

      try {
        const response = await userAxiosWithAuth.get(`/api/repos/${repoId}`);
        console.log("data id:", response.data.data.id);
      } catch (error) {
        console.error("Error creating new repository:", error);
      }
    }
  };

  const onConnected = () => {
    console.log("웹소켓 연결 완료");
    setConnected(true);

    if (!entered) {
      clientRef.current?.send(
        `/pub/chat/enter/${repoId}`,
        {},
        JSON.stringify({ sender: userName, type: "JOIN" })
      );
      setEntered(true);
      setNowExistUser(cookies.nickname);
    }
    clientRef.current?.subscribe(`/sub/repo/${repoId}`, onMessageReceived);
    console.log("구독 완료");
  };

  const onError = (error: any) => {
    console.error("연결 실패", error);
  };

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setUserName(cookies.nickname);
    if (currentMessage.trim() && clientRef.current) {
      const chatMessage = {
        sender: userName,
        content: currentMessage,
        type: "CHAT",
      };
      clientRef.current?.send(`/pub/chat/send/${repoId}`, {}, JSON.stringify(chatMessage));
      console.log("클라이언트 메시지 전송 메서드 내부 유저아이디:", userName);
      console.log("클라이언트 메시지 전송 메서드 내부 메시지 리스트", messages);
      setCurrentMessage("");
    }
  };

  // todo: 지금 여기 부분에서 메시지를 받을 때 실행이 안됨.
  const onMessageReceived = (payload: any) => {
    const message: ChatMessage = JSON.parse(payload.body);
    console.log("방금 받아낸 메시지", message);
    setMessages((prevMessages) => [...prevMessages, message]);
    console.log("상태관리 되고 있는 메시지 리스트", messages);
  };

  return (
    <div className={styles.chattingWrapper}>
      <div className={styles.chattingSpace}>
        <div className={styles.chatHeader}></div>
        {!connected && (
          <div className={styles.messages} ref={messagesEndRef}>
            Connecting...
          </div>
        )}
        <ul className={styles.messageArea}>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`${message.sender === userName ? styles.myMessage : styles.testMessage}`}
            >
              {message.type === "CHAT" && (
                <div
                  className={`${
                    message.sender === userName ? styles.mysenderWrapper : styles.senderWrapper
                  }`}
                >
                  <div
                    className={`${
                      message.sender === userName ? styles.mysenderName : styles.senderName
                    }`}
                  >
                    <strong>{message.sender}</strong>
                  </div>
                  <div className={styles.chat_bubble}>{message.content}</div>
                </div>
              )}
              <div className={styles.senderNoticeWrapper}>
                {message.type === "JOIN" && nowExistUser ? (
                  <div className={styles.senderEntranceNotice}>
                    {message.sender} 님이 참가했습니다.
                  </div>
                ) : (
                  <></>
                )}
                {message.type === "LEAVE" && (
                  <div className={styles.senderOutNotice}>{message.sender} 님이 퇴장했습니다.</div>
                )}
              </div>
            </li>
          ))}
        </ul>
        <form className={styles.messageForm} name="messageForm" onSubmit={sendMessage}>
          <input
            type="text"
            id="message"
            placeholder="Type a message..."
            autoComplete="off"
            className={styles.messageInput}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
export default ChatSpace;
