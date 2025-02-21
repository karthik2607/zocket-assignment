import { useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function TaskChatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setResponse("Error connecting to chatbot.");
    }
    setLoading(false);
  };

  const handleSampleQuestionClick = (question: string) => {
    setMessage(question);
  };

  return (
    <div className="flex justify-center items-center w-[40%] h-[50%] p-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 text-white">
        <h2 className="text-2xl font-bold text-center mb-4">Task Chatbot</h2>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your tasks..."
        ></textarea>

        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-white/20">
          <div className="flex gap-2 mt-2 overflow-x-auto"></div>
          <button
            onClick={() =>
              handleSampleQuestionClick("What are my pending tasks?")
            }
            className="cursor-pointer hover:text-gray-200 bg-gray-800 px-3 py-1 rounded-lg text-sm text-gray-400 whitespace-nowrap"
          >
            What are my pending tasks?
          </button>
          <button
            onClick={() =>
              handleSampleQuestionClick("Show me the most urgent tasks.")
            }
            className="cursor-pointer hover:text-gray-200 bg-gray-800 px-3 py-1 rounded-lg text-sm text-gray-400 whitespace-nowrap"
          >
            Show me the most urgent tasks.
          </button>
          <button
            onClick={() =>
              handleSampleQuestionClick("Which tasks are due today?")
            }
            className="cursor-pointer hover:text-gray-200 bg-gray-800 px-3 py-1 rounded-lg text-sm text-gray-400 whitespace-nowrap"
          >
            Which tasks are due today?
          </button>
          <button
            onClick={() => handleSampleQuestionClick("List completed tasks.")}
            className="cursor-pointer hover:text-gray-200 bg-gray-800 px-3 py-1 rounded-lg text-sm text-gray-400 whitespace-nowrap"
          >
            List completed tasks.
          </button>
        </div>
        {response && (
          <div className="mt-4 p-3 bg-gray-900/50 border border-white/20 rounded-lg">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}

        <button
          className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Send"}
        </button>
      </div>
    </div>
  );
}
