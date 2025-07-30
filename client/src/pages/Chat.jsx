import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, setToken } from "../States/slice.js";
import Contacts from "../components/Contacts";
import Interface from "../components/Interface";
import Input from "../components/Input";
import { ArrowLeft, LogOut, MessageCircle } from "lucide-react";

function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  const socket = useRef(null);
  const selectedContactRef = useRef(null);
  const token = useSelector((state) => state.token);
  const selfUser = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const socketUrl=import.meta.env.VITE_SOCKET_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Keep selected contact ref updated
  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  function sendMessage(text) {
    if (!selectedContact || !text.trim()) return;

    try {
      const newMessage = {
        sender: { id: selfUser._id, name: selfUser.name },
        text: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);

      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
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
      } else {
        setError("Connection lost. Message not sent.");
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Send message error:", err);
    }
  }

  function handleMessage() {
    if (socket.current) {
      socket.current.onmessage = (e) => {
        try {
          const messageData = JSON.parse(e.data);

          if (messageData.type === "onlineClient") {
            setOnlineUsers(messageData.clients || []);
            setError(null);
          } else if (messageData.type === "message") {
            const currentSelected = selectedContactRef.current;
            const selectedId = currentSelected?.id || currentSelected?._id;
            
            if (messageData.message.sender?.id === selectedId) {
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
        } catch (err) {
          console.error("Message handling error:", err);
          setError("Error processing message");
        }
      };
    }
  }

  function connectWs() {
    if (socket.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(`${socketUrl}`);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        ws.send(JSON.stringify({ type: "token", secret: token }));
      };

      ws.onclose = () => {
        setIsConnected(false);
        socket.current = null;
        setTimeout(connectWs, 2000);
      };

      ws.onerror = (err) => {
        setError("Connection error. Retrying...");
        setIsConnected(false);
      };

      socket.current = ws;
    } catch (err) {
      setError("Failed to connect. Retrying...");
      setTimeout(connectWs, 2000);
    }
  }

  async function getMessageHistory(userId) {
    try {
      const response = await fetch(`${apiUrl}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch message history");
      }

      const messageHistory = await response.json();

      const formattedMessages = messageHistory.map((msg) => ({
        sender: {
          id: msg.sender.id,
          name: msg.sender.name,
        },
        text: msg.text,
        timestamp: new Date(msg.createdAt).getTime(),
      }));

      setMessages(formattedMessages);
    } catch (err) {
      console.error("Message history error:", err);
      setError("Failed to load message history");
    }
  }

  async function getUsers() {
    try {
      const response = await fetch(`${apiUrl}/users`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();

      const filterUsers = users
        .filter((user) => user._id !== selfUser._id)
        .filter(
          (user) =>
            !onlineUsers.some((onlineUser) => onlineUser.id === user._id)
        );

      setOfflineUsers(filterUsers);
    } catch (err) {
      console.error("Get users error:", err);
      setError("Failed to load contacts");
    }
  }

  async function handleLogout() {
    try {
      await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      if (socket.current) {
        socket.current.close();
      }
      dispatch(setUser(null));
      dispatch(setToken(null));
      navigate("/");
    }
  }

  useEffect(() => {
    setMessages([]);
    setError(null);
    if (selectedContact) {
      getMessageHistory(selectedContact.id || selectedContact._id);
    }
  }, [selectedContact]);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  useEffect(() => {
    if (token) {
      connectWs();
      handleMessage();
    }

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [token]);

  return (
    <div className="flex h-screen w-screen bg-gray-900 overflow-hidden">
      {/* Contacts Panel */}
      <div
        className={`bg-gray-800 border-r border-gray-700 flex flex-col
          ${selectedContact ? "hidden lg:flex" : "flex"} 
          w-full lg:w-1/3 xl:w-1/4`}
      >
        {/* Contacts Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-blue-400" size={24} />
            <h1 className="text-lg font-semibold text-white">Contacts</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
            title="Logout"
          >
            <LogOut className="text-white" size={18} />
          </button>
        </div>

        {/* Connection Status */}
        {error && (
          <div className="p-3 bg-red-900/50 border-b border-red-700">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="p-3 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-gray-300">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          <Contacts
            setSelectedContact={setSelectedContact}
            onlineUsers={onlineUsers}
            selectedContact={selectedContact}
            offlineUsers={offlineUsers}
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div
        className={`flex flex-col bg-gray-900 relative
          ${selectedContact ? "flex" : "hidden lg:flex"} 
          w-full lg:w-2/3 xl:w-3/4`}
      >
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700 shrink-0">
              <button
                className="lg:hidden mr-3 p-1 rounded hover:bg-gray-700 transition-colors"
                onClick={() => setSelectedContact(null)}
              >
                <ArrowLeft className="text-white" size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {selectedContact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {selectedContact.name}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {onlineUsers.some(user => 
                      (user.id || user._id) === (selectedContact.id || selectedContact._id)
                    ) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <Interface messages={messages} selectedContact={selectedContact} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-4 bg-gray-800 border-t border-gray-700">
              <Input sendMessage={sendMessage} />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="hidden lg:flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-500">
                Select a contact to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;