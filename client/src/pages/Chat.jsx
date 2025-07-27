import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, setToken } from "../States/slice.js";
import Contacts from "../components/Contacts";
import Interface from "../components/Interface";
import Input from "../components/Input";
import { ArrowLeft } from "lucide-react";

function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const socket = useRef(null);
  const selectedContactRef = useRef(null); // Track selected contact reactively
  const token = useSelector((state) => state.token);
  const selfUser = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  // Keep selected contact ref updated
  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

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
        recipient: {
          id: selectedContact.id || selectedContact._id,
          name: selectedContact.name,
        },
        sender: { id: selfUser._id, name: selfUser.name },
        text: newMessage.text,
        timestamp: newMessage.timestamp,
      })
    );
  }

  function handleMessage() {
    if (socket.current) {
      socket.current.onmessage = (e) => {
        const messageData = JSON.parse(e.data);

        if (messageData.type === "onlineClient") {
          console.log("Clients? :", messageData);
          setOnlineUsers(messageData.clients);
        } else if (messageData.type === "message") {
          const currentSelected = selectedContactRef.current;

          console.log("Message from backend 000000");
          console.log("Message data check: ", messageData);
          console.log("Sender id: ", messageData.message.sender?.id);
          console.log("Selected contact: ", currentSelected);
          console.log("Selected contact id: ", currentSelected?.id);
          console.log("Selected offline contact: ", currentSelected?._id);
          console.log("USERS: ", onlineUsers);

          const selectedId = currentSelected?.id || currentSelected?._id;
          if (messageData.message.sender?.id === selectedId) {
            console.log("Message from backend");

            const newMessage = {
              sender: {
                id: messageData.message.sender?.id,
                name: messageData.message.sender?.name,
              },
              text: messageData.message.text,
              timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, newMessage]);
          }
        }
      };
    }
  }

  function connectWs() {
    if (!socket.current) {
      const ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "token", secret: token }));
      };

      ws.onclose = () => {
        socket.current = null;
        setTimeout(connectWs, 2000);
      };

      socket.current = ws;
    }
  }

  async function getMessageHistroy(userId) {
    const response = await fetch(`${apiUrl}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
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

    setMessages((prev) => [...prev, ...formattedMessages]);
  }

  async function getUsers() {
    const response = await fetch(`${apiUrl}/users`);
    const users = await response.json();

    const filterUsers = users
      .filter((user) => user._id !== selfUser._id)
      .filter(
        (user) =>
          !onlineUsers.some((onlineUser) => onlineUser.id === user._id)
      );

    setOfflineUsers(filterUsers);
  }

  async function handleLogout() {
    const res = await fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    setUser(null);
    setToken(null);
    navigate("/");
  }

  useEffect(() => {
    setMessages([]);
    if (selectedContact) {
      getMessageHistroy(selectedContact.id || selectedContact._id);
    }
  }, [selectedContact]);

  useEffect(() => {
    console.log("Online users: ", onlineUsers);
    getUsers();
  }, [onlineUsers]);

  useEffect(() => {
    connectWs();
    handleMessage();

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

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
          offlineUsers={offlineUsers}
        />
      </div>

      <button onClick={handleLogout}>LOGOUT</button>

      {/* Chat Interface */}
      <div
        className={`relative flex flex-col bg-gray-800 text-white 
          ${selectedContact ? "block" : "hidden"} 
          lg:block lg:w-2/3`}
      >
        {/* Header */}
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

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <Interface messages={messages} selectedContact={selectedContact} />
        </div>

        {/* Input */}
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
