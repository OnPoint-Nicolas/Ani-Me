import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Minimize2 } from "lucide-react";

const CHAT_KEY = "ani-me-chat";

const getStoredMessages = () => {
  try {
    const data = localStorage.getItem(CHAT_KEY);
    return data
      ? JSON.parse(data)
      : [
          {
            id: 1,
            sender: "Sakura",
            text: "Hey!",
            time: "14:32",
            isOwn: false,
          },
        ];
  } catch {
    return [];
  }
};

const ChatWidget = ({ isOpen, onToggle, chatPartner = "Sakura Tanaka" }) => {
  const [messages, setMessages] = useState(getStoredMessages);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}`;

    const newMsg = {
      id: Date.now(),
      sender: "Du",
      text: input,
      time: timeStr,
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: chatPartner.split(" ")[0],
        text: "Okay.",
        time: timeStr,
        isOwn: false,
      };

      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-72 bg-black text-white">
      <div className="flex justify-between p-2 border-b">
        <MessageCircle />
        <button onClick={onToggle}>
          <X />
        </button>
      </div>

      {!minimized && (
        <div className="p-2 space-y-2">
          {messages.map((m) => (
            <div key={m.id} className={m.isOwn ? "text-right" : "text-left"}>
              <p>{m.text}</p>
            </div>
          ))}

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full mt-2 text-black"
          />

          <button onClick={sendMessage}>Senden</button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;