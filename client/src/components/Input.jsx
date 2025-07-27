import { useState } from "react";
import { Send, Smile } from "lucide-react";

function Input({ sendMessage }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || isSending) return;
    
    setIsSending(true);
    try {
      await sendMessage(trimmedText);
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex items-end space-x-3 bg-gray-700 rounded-2xl p-3 border border-gray-600 focus-within:border-blue-500 transition-colors">
      {/* Emoji Button */}
      <button
        type="button"
        className="p-2 rounded-full hover:bg-gray-600 transition-colors shrink-0"
        title="Add emoji"
      >
        <Smile className="text-gray-400 hover:text-gray-300" size={20} />
      </button>

      {/* Text Input */}
      <textarea
        className="flex-1 resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none py-2 px-1 min-h-[40px] max-h-[120px] leading-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        rows={1}
        placeholder="Type a message..."
        value={text}
        onChange={handleTextChange}
        onKeyPress={handleKeyPress}
        disabled={isSending}
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 transparent'
        }}
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!text.trim() || isSending}
        className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shrink-0 group"
        title="Send message"
      >
        <Send 
          className={`text-white transition-transform ${
            isSending ? 'animate-pulse' : 'group-hover:translate-x-0.5'
          }`} 
          size={18} 
        />
      </button>
    </div>
  );
}

export default Input;