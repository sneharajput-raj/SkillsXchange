import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as chatApi from '../../api/chatApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePolling } from '../../hooks/usePolling';
import { getInitials, timeAgo } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { MessageSquare, Send, User, ChevronLeft } from 'lucide-react';

export function MessagesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [selectedConvoId, setSelectedConvoId] = useState(() => {
    const fromParam = searchParams.get('conversationId');
    return fromParam ? Number(fromParam) : null;
  });
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // Poll conversations every 6s
  usePolling(loadConversations, 6000);

  // Poll active messages every 3s
  usePolling(loadActiveMessages, 3000, Boolean(selectedConvoId));

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const fromParam = searchParams.get('conversationId');
    if (fromParam) {
      setSelectedConvoId(Number(fromParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedConvoId) {
      loadActiveMessages(true);
    }
  }, [selectedConvoId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function loadConversations() {
    try {
      const res = await chatApi.getConversations();
      const list = res?.data || [];
      setConversations(list);

      // Auto-select first conversation if none selected
      if (!selectedConvoId && list.length > 0) {
        setSelectedConvoId(list[0].id);
        setSearchParams({ conversationId: list[0].id });
      }
    } catch {
      // Ignore background poll errors
    } finally {
      setLoadingConvos(false);
    }
  }

  async function loadActiveMessages(initial = false) {
    if (!selectedConvoId) return;
    if (initial) setLoadingMessages(true);

    try {
      const res = await chatApi.getMessages(selectedConvoId, { page: 0, size: 50 });
      // Backend returns Page<MessageDto> sorted desc by createdAt; reverse for chronological order
      const pageContent = res?.data?.content || [];
      const chronological = [...pageContent].reverse();
      setMessages(chronological);
    } catch {
      // Ignore poll error
    } finally {
      if (initial) setLoadingMessages(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvoId) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const res = await chatApi.sendMessage(selectedConvoId, textToSend);
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
      }
      loadConversations(); // update last message snippet
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
      setMessageText(textToSend); // restore on error
    } finally {
      setSending(false);
    }
  }

  const activeConversation = conversations.find((c) => c.id === selectedConvoId);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Direct Messages</h1>
        <p className="mt-1 text-xs text-slate-500">
          Coordinate meeting logistics and discuss topic expectations with your peer partners.
        </p>
      </div>

      {/* 2-Pane Chat Card */}
      <div className="card h-[calc(100vh-14rem)] min-h-[500px] overflow-hidden flex flex-col md:flex-row">
        {/* Left Pane: Conversations List */}
        <div
          className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
            selectedConvoId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Conversations ({conversations.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConvos && conversations.length === 0 ? (
              <LoadingSpinner size="sm" message="Loading chats..." />
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active conversations yet. Visit Discover to chat with students!
              </div>
            ) : (
              conversations.map((convo) => {
                const isSelected = convo.id === selectedConvoId;
                return (
                  <button
                    key={convo.id}
                    type="button"
                    onClick={() => {
                      setSelectedConvoId(convo.id);
                      setSearchParams({ conversationId: convo.id });
                    }}
                    className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-100/70 bg-white'
                    }`}
                  >
                    {convo.partnerAvatarUrl ? (
                      <img
                        src={convo.partnerAvatarUrl}
                        alt={convo.partnerName}
                        className="h-10 w-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shrink-0">
                        {getInitials(convo.partnerName)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {convo.partnerName}
                        </span>
                        {convo.lastMessageTime && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {timeAgo(convo.lastMessageTime)}
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500 truncate">
                        {convo.lastMessage || 'No messages yet'}
                      </p>

                      {convo.unreadCount > 0 && (
                        <span className="mt-1 inline-block rounded-full bg-indigo-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                          {convo.unreadCount} new
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Message Thread */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            !selectedConvoId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedConvoId(null)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 md:hidden"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {activeConversation.partnerAvatarUrl ? (
                    <img
                      src={activeConversation.partnerAvatarUrl}
                      alt={activeConversation.partnerName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {getInitials(activeConversation.partnerName)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {activeConversation.partnerName}
                    </h3>
                    <Link
                      to={`/students/${activeConversation.partnerId}`}
                      className="text-[11px] text-indigo-600 hover:underline"
                    >
                      View Student Profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {loadingMessages ? (
                  <LoadingSpinner size="sm" message="Loading thread..." />
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No messages yet in this exchange. Say hello to {activeConversation.partnerName}!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.userId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <span className="mt-1 text-[10px] text-slate-400 px-1">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Send Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Message ${activeConversation.partnerName}...`}
                  className="input flex-1"
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="btn btn-primary px-3 py-2"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a conversation from the left to read messages or start coordinating your tutoring sessions."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
