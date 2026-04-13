"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { useAuth } from "@/lib/auth-context";
import { apiGet, apiPost } from "@/lib/fetcher";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  userId: string;
  name: string;
  lastMessage?: string;
  unreadCount: number;
}

const mockConversations: Conversation[] = [
  { userId: "s1", name: "Alice Brown", lastMessage: "Thank you for the feedback!", unreadCount: 1 },
  { userId: "s2", name: "Bob Wilson", lastMessage: "I have a question about the assignment.", unreadCount: 0 },
  { userId: "s3", name: "Carol Davis", lastMessage: "Can I schedule office hours?", unreadCount: 2 },
  { userId: "s4", name: "David Lee", lastMessage: "Submitted my lab report.", unreadCount: 0 },
  { userId: "s5", name: "Emma Johnson", lastMessage: "Will be absent tomorrow.", unreadCount: 0 },
  { userId: "s6", name: "Frank Garcia", lastMessage: "Extra credit opportunity?", unreadCount: 0 },
  { userId: "s7", name: "Grace Martinez", lastMessage: "Got my grade, thank you!", unreadCount: 0 },
  { userId: "s8", name: "Henry Anderson", lastMessage: "Study group formation", unreadCount: 1 },
];

const mockMessages: Record<string, Message[]> = {
  s1: [
    { id: "m1", senderId: "s1", receiverId: "me", senderName: "Alice Brown", content: "Hello Professor, I had a question about the last lecture.", isRead: true, createdAt: "2025-01-14T10:00:00" },
    { id: "m2", senderId: "me", receiverId: "s1", senderName: "You", content: "Of course! What would you like to know?", isRead: true, createdAt: "2025-01-14T10:05:00" },
    { id: "m3", senderId: "s1", receiverId: "me", senderName: "Alice Brown", content: "I'm having trouble understanding eigenvalue decomposition.", isRead: true, createdAt: "2025-01-14T10:08:00" },
    { id: "m4", senderId: "me", receiverId: "s1", senderName: "You", content: "We'll cover that in more detail next class. I recommend reading Chapter 6 as well.", isRead: true, createdAt: "2025-01-14T10:15:00" },
    { id: "m5", senderId: "s1", receiverId: "me", senderName: "Alice Brown", content: "Thank you for the feedback!", isRead: false, createdAt: "2025-01-15T09:00:00" },
  ],
  s2: [
    { id: "m6", senderId: "s2", receiverId: "me", senderName: "Bob Wilson", content: "I have a question about the assignment.", isRead: true, createdAt: "2025-01-13T14:00:00" },
  ],
  s3: [
    { id: "m7", senderId: "s3", receiverId: "me", senderName: "Carol Davis", content: "Can I schedule office hours?", isRead: false, createdAt: "2025-01-15T11:00:00" },
  ],
};

export default function TeacherMessages() {
  useRequireAuth("teacher");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<Conversation[]>("/api/messages");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setConversations(data);
        } else {
          setConversations(mockConversations);
        }
      } catch {
        setConversations(mockConversations);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const msgs = mockMessages[selectedConversation] || [];
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [selectedConversation]);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: user?.id || "me",
      receiverId: selectedConversation,
      senderName: "You",
      content: newMessage.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Communicate with your students
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversation List */}
          <div
            className={cn(
              "w-full border-r sm:w-80",
              selectedConversation ? "hidden sm:block" : "block"
            )}
          >
            <div className="border-b p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-56px)]">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.userId}
                  className={cn(
                    "flex w-full items-center gap-3 border-b px-3 py-3 text-left transition-colors hover:bg-muted/50",
                    selectedConversation === conv.userId && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                  onClick={() => setSelectedConversation(conv.userId)}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      {getInitials(conv.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold">{conv.name}</p>
                      {conv.unreadCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="truncate text-xs text-muted-foreground">
                        {conv.lastMessage}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex flex-1 flex-col",
              !selectedConversation ? "hidden sm:flex" : "flex"
            )}
          >
            {selectedConversation ? (
              <>
                <div className="flex items-center gap-3 border-b px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      {getInitials(
                        conversations.find((c) => c.userId === selectedConversation)?.name || "U"
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">
                      {conversations.find((c) => c.userId === selectedConversation)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isMe = msg.senderId === "me" || msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            isMe ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2.5",
                              isMe
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            )}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={cn(
                                "mt-1 text-[10px]",
                                isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                              )}
                            >
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="border-t p-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!newMessage.trim()}
                      className="bg-primary"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                <MessageSquare className="h-16 w-16 opacity-20" />
                <p className="text-sm font-medium">Select a conversation</p>
                <p className="text-xs">Choose a student to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
