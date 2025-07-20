import { useState } from "react";
import { SendHorizonal } from "lucide-react";

function Input({ sendMessage }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center bg-gray-800 rounded-lg p-2">
      <textarea
        className="flex-1 resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none p-2"
        rows={1}
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSend}
        className="p-2 rounded hover:bg-gray-700 transition"
      >
        <SendHorizonal className="text-white" />
      </button>
    </div>
  );
}

export default Input;
