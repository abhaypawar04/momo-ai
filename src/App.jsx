import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import ai from "./gemini";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi! I'm MOMO Ai. Ask me anything about ai.",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askGemini = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage = { role: "user", text: prompt };

    setMessages((prev) => [...prev, userMessage]);

    const currentPrompt = prompt;
    setPrompt("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: currentPrompt,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response.text },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Something went wrong." },
      ]);
      console.log(err);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askGemini();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-900">
      {/* Soft background glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-20 h-96 w-96 rounded-full bg-sky-200 blur-[140px] opacity-60" />
        <div className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-indigo-200 blur-[140px] opacity-60" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 p-3 text-white shadow-lg">
              <Sparkles size={20} />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight"> MOMO AI</h1>
              <p className="text-sm text-gray-500">AI FOR EVERYONE</p>
            </div>
          </div>
        </div>
      </header>

      {/* CHAT */}
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 pb-40">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI avatar */}
            {msg.role === "assistant" && (
              <div className="rounded-full bg-blue-500 p-3 text-white shadow-md">
                <Bot size={18} />
              </div>
            )}

            {/* message bubble */}
            <div
              className={`max-w-3xl rounded-3xl px-6 py-4 text-[15px] leading-7 shadow-lg transition-all duration-200 ${
                msg.role === "user"
                  ? "rounded-br-md bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                  : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>

            {/* user avatar */}
            {msg.role === "user" && (
              <div className="rounded-full bg-gray-200 p-3 text-gray-700 shadow-sm">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {/* loading */}
        {loading && (
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500 p-3 text-white">
              <Bot size={18} />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-4 shadow-md">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* INPUT BAR */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/80 backdrop-blur-3xl">
        <div className="mx-auto flex max-w-5xl items-end gap-4 p-6">
          <textarea
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message MOMO AI..."
            className="min-h-[60px] flex-1 resize-none rounded-3xl border border-gray-200 bg-white px-5 py-4 text-gray-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />

          <button
            onClick={askGemini}
            disabled={loading}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transition hover:scale-105 hover:shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
