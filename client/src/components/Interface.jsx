import { useEffect, useRef } from "react";

function Interface({ messages, selectedContact }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the latest message
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedContact) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a contact to start chatting
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${
            msg.sender === "me"
              ? "bg-blue-600 text-white self-end ml-auto"
              : "bg-gray-700 text-white self-start mr-auto"
          }`}
        >
          {msg.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default Interface;
