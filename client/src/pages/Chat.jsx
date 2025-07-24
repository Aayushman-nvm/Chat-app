import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Contacts from "../components/Contacts";
import Interface from "../components/Interface";
import Input from "../components/Input";
import { ArrowLeft } from "lucide-react";

function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef(null); // keep socket reference
  const token = useSelector((state) => state.token);
  const selfUser = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  //sending message from fe to be when both socets are connected
  function sendMessage(text) {
    if (!selectedContact) return;
    const newMessage = {
      sender: { id: selfUser._id, name: selfUser.name },
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    socket.current.send(
      JSON.stringify({
        type: "message",
        recipient: { id: selectedContact.id, name: selectedContact.name },
        sender: { id: selfUser._id, name: selfUser.name },
        text: newMessage.text,
        timestamp: newMessage.timestamp,
      })
    );
  }

  //setting online users, or messages based on the response given from be
  function handleMessage() {
    if (socket.current) {
      socket.current.onmessage = (e) => {
        console.log("New message!\n", e.data);
        const messageData = JSON.parse(e.data);
        console.log("MESSAGE DATA: ", messageData);
        if (messageData.type === "onlineClient") {
          setOnlineUsers(messageData.clients);
        } else if (messageData.type === "message") {
          const newMessage = {
            sender: {
              id: messageData.message.sender?.id,
              name: messageData.message.sender?.name,
            },
            text: messageData.message.text,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, newMessage]);
        } else {
          console.log("Unhandled message data: ", messageData);
        }
      };
    }
  }

  //modular function to connect to websocket
  function connectWs() {
    if (!socket.current) {
      const ws = new WebSocket("ws://localhost:3000");
      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({ type: "token", secret: token }));
      };
      ws.onclose = () => {
        console.warn("WebSocket closed. Reconnecting...");
        socket.current = null;
        setTimeout(connectWs, 2000);
      };
      socket.current = ws;
    }
  }

  //fetching old messages from db to show conversation history
  async function getMessageHistroy(userId) {
    const response = await fetch(`${apiUrl}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const messageHistory = await response.json();
    const formattedMessages = messageHistory.map((msg) => ({
      sender: {
        id: msg.sender.id,
        name: msg.sender.name,
      },
      text: msg.text,
      timestamp: new Date(msg.createdAt).getTime(),
    }));

    setMessages((prev) => [
      ...prev,
      ...formattedMessages
    ]);

    console.log("Message history: ", messageHistory);

  }

  useEffect(() => {
    if (selectedContact) {
      getMessageHistroy(selectedContact.id);
    }
  }, [selectedContact])

  useEffect(() => {
    connectWs();
    handleMessage();

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  useEffect(() => {
    console.log("Online users in FE: ", onlineUsers);
  }, [onlineUsers]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Contacts Panel */}
      <div
        className={`bg-gray-900 text-white overflow-y-auto p-2 
          ${selectedContact ? "hidden" : "block"} 
          lg:block lg:w-1/3`}
      >
        <Contacts
          setSelectedContact={setSelectedContact}
          onlineUsers={onlineUsers}
          selectedContact={selectedContact}
        />
      </div>

      {/* Chat Interface */}
      <div
        className={`relative flex flex-col bg-gray-800 text-white 
          ${selectedContact ? "block" : "hidden"} 
          lg:block lg:w-2/3`}
      >
        {/* Header with back button and name */}
        <div className="flex items-center p-3 bg-gray-900 border-b border-gray-700">
          <button
            className="lg:hidden mr-3"
            onClick={() => setSelectedContact(null)}
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">
            {selectedContact ? selectedContact.name : "No Contact Selected"}
          </h2>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <Interface messages={messages} selectedContact={selectedContact} />
        </div>

        {/* Fixed Input Box */}
        {selectedContact && (
          <div className="sticky bottom-0 p-3 bg-gray-900 border-t border-gray-700">
            <Input sendMessage={sendMessage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
