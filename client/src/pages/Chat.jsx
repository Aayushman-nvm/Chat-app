import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Contacts from "../components/Contacts";
import Interface from "../components/Interface";
import Input from "../components/Input";
import { ArrowLeft } from "lucide-react";

function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const token = useSelector((state) => state.token);
  const selfUser = useSelector((state) => state.user);

  // TODO: Replace with your backend websocket initialization
  // function initializeWebSocket() {}

  // TODO: Replace with your backend send message functionality
  function sendMessage(text) {
    if (!selectedContact) return;
    const newMessage = {
      sender: { id: selfUser._id, name: selfUser.name },
      text, timestamp: Date.now()
    };
    setMessages((prev) => [...prev, newMessage]);
    // TODO: Send message via websocket here
    console.log("Selected Contact: ", selectedContact);
    socket.send(JSON.stringify({
      type: "message",
      recipient: { id: selectedContact.id, name: selectedContact.name },
      sender: { id: selfUser._id, name: selfUser.name },
      text: newMessage.text,
      timestamp: newMessage.timestamp,
    }))
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setSocket(ws);
    ws.onmessage = (e) => {
      console.log("New message!\n", e.data);
      const messageData = JSON.parse(e.data);
      console.log("MESSAGE DATE: ", messageData);
      if (messageData.type === "onlineClient") {
        setOnlineUsers(messageData.clients);
      } else if (messageData.type === "message") {
        const newMessage = {
          sender: { id: messageData.message.sender?.id, name: messageData.message.sender?.name },
          text: messageData.message.text, timestamp: Date.now()
        };
        console.log("New Message: ",newMessage);
        setMessages((prev) => [...prev, newMessage]);
        console.log(`Compareing: ${messageData.id === selfUser._id}`)
        console.log("Incoming message from be to fe: ", messageData.message);
      } else {
        console.log("Message data: ", messageData);
      }
    }
    ws.onopen = () => {
      const secret = token;
      ws.send(JSON.stringify({ type: "token", secret }));
    }

    return () => {
      ws.close();//duplication bug fixed... bug was occuring during every save of file/ re-rendering
    }
  }, [])

  useEffect(() => {
    console.log("Online users in fe: ", onlineUsers);
  }, [onlineUsers]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Contacts Panel */}
      <div
        className={`bg-gray-900 text-white overflow-y-auto p-2 
          ${selectedContact ? "hidden" : "block"} 
          lg:block lg:w-1/3`}
      >
        <Contacts setSelectedContact={setSelectedContact} onlineUsers={onlineUsers} selectedContact={selectedContact} />
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
