import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Check, CheckCheck, Clock } from "lucide-react";

function Interface({ messages, selectedContact }) {
  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const selfUser = useSelector((state) => state.user);

  useEffect(() => {
    // Auto-scroll to the latest message with smooth behavior
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const shouldShowDateSeparator = (currentMessage, prevMessage) => {
    if (!prevMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const prevDate = new Date(prevMessage.timestamp).toDateString();
    
    return currentDate !== prevDate;
  };

  if (!selectedContact) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-gray-500" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            Select a contact to start chatting
          </h3>
          <p className="text-gray-500 text-sm">
            Choose someone from your contacts list to begin a conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={messagesContainerRef}
      className="flex flex-col h-full p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: '#374151 transparent'
      }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg font-medium">
                {selectedContact.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => {
            const isOwnMessage = msg.sender?.id === selfUser._id;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showDateSeparator = shouldShowDateSeparator(msg, prevMessage);
            const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
            const isLastInGroup = !nextMessage || 
              nextMessage.sender?.id !== msg.sender?.id ||
              (nextMessage.timestamp - msg.timestamp) > 300000; // 5 minutes

            return (
              <div key={index}>
                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                      {formatDate(msg.timestamp)}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-1`}>
                  <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl group`}>
                    {/* Sender Name (for received messages) */}
                    {!isOwnMessage && (index === 0 || messages[index - 1].sender?.id !== msg.sender?.id) && (
                      <div className="text-xs text-gray-400 mb-1 ml-3">
                        {msg.sender?.name || selectedContact.name}
                      </div>
                    )}

                    <div className={`relative px-4 py-2 rounded-2xl break-words text-sm leading-relaxed ${
                      isOwnMessage
                        ? "bg-blue-600 text-white ml-auto rounded-br-md"
                        : "bg-gray-700 text-white mr-auto rounded-bl-md"
                    } ${!isLastInGroup ? (isOwnMessage ? "rounded-br-2xl" : "rounded-bl-2xl") : ""}`}>
                      
                      {/* Message Text */}
                      <div className="whitespace-pre-wrap">
                        {msg.text}
                      </div>

                      {/* Message Time and Status */}
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        isOwnMessage ? "text-blue-200" : "text-gray-400"
                      }`}>
                        <span className="text-xs opacity-70">
                          {formatTime(msg.timestamp)}
                        </span>
                        {isOwnMessage && (
                          <div className="opacity-70">
                            <CheckCheck size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Scroll anchor */}
          <div ref={bottomRef} className="h-1" />
        </>
      )}
    </div>
  );
}

export default Interface;