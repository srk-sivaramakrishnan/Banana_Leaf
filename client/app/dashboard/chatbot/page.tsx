'use client';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { StopCircle, Send, Leaf } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const baseURL = process.env.NEXT_PUBLIC_BASEURL;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function Page() {
  // No custom props: extraClasses is hardcoded or can be derived
  const extraClasses = '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAssistantTyping, setAssistantTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I’m your Banana Leaf assistant. How can I help you today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 500);
  }, []);

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value.substring(0, 500)); // optional char limit
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text) return;

    const userMessage: Message = { role: 'user', content: text, timestamp: getCurrentTime() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setAssistantTyping(true);

    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${baseURL}/chatbot/generating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from backend');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: getCurrentTime(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again later.',
        timestamp: getCurrentTime(),
      };

      setMessages(prev => [...prev, errorMessage]);
      console.error('Error sending message:', error);
    } finally {
      setAssistantTyping(false);
    }
  };

  const handleStop = () => {
    setAssistantTyping(false);
  };

  return (
    <DashboardLayout>
      <div className={`bg-gray-50 rounded-xl w-full max-w-7xl p-4 mx-auto ${extraClasses}`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-500" />
            <h1 className="text-xl font-semibold text-gray-800">Banana Leaf Assistant</h1>
          </div>
          <div className="text-sm text-gray-500">
            {isAssistantTyping ? 'Generating...' : 'Active'}
          </div>
        </div>

        {/* Chat history */}
        <div className="h-[450px] overflow-y-auto py-4 px-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2">
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <Leaf className="h-4 w-4 text-green-600" />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-green-500 text-white rounded-tr-none'
                      : 'text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">You</span>
                  </div>
                )}
              </div>
              {msg.timestamp && (
                <span className="text-xs text-gray-400 mt-1 px-2">{msg.timestamp}</span>
              )}
            </div>
          ))}
          {isAssistantTyping && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <Leaf className="h-4 w-4 text-green-600" />
              </div>
              <div className="px-4 py-3 rounded-2xl text-gray-800 rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

      </div>

      {/* Input area */}
      <div className="mt-12 mx-auto max-w-5xl rounded-xl p-4 border bg-white border-gray-200 flex items-end space-x-2">
        <TextareaAutosize
          ref={textareaRef}
          minRows={3}
          maxRows={6}
          placeholder="Type your message here..."
          value={inputText}
          disabled={isAssistantTyping}
          className="flex-grow min-h-[80px] bg-transparent outline-none text-gray-800 text-sm md:text-base placeholder-gray-400 px-3 py-2 resize-none overflow-hidden"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-end pb-1">
          {isAssistantTyping ? (
            <button
              onClick={handleStop}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              title="Stop"
            >
              <StopCircle className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              className={`p-2 rounded-full transition-colors ${inputText.trim() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'
                }`}
              title="Send"
              disabled={!inputText.trim()}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

    </DashboardLayout>
  );
}
