"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChatWidget, type ChatUser, type ChatMessage } from "@/components/dashboard/chat-widget";
import { MessageSquare } from "lucide-react";

const mockUsers: ChatUser[] = [
  { id: "2", name: "Dr. Sarah Johnson", role: "Teacher", lastMessage: "Please review the exam schedule", unreadCount: 2 },
  { id: "3", name: "Prof. Michael Chen", role: "Teacher", lastMessage: "Lab equipment has arrived", unreadCount: 1 },
  { id: "4", name: "John Smith", role: "Student", lastMessage: "Thank you for the guidance" },
  { id: "5", name: "Alice Johnson", role: "Student", lastMessage: "Can I submit the assignment late?" },
  { id: "6", name: "Bob Williams", role: "Student", lastMessage: "When is the next class?" },
  { id: "7", name: "Emma Brown", role: "Student" },
  { id: "8", name: "David Davis", role: "Student", lastMessage: "Fee receipt attached" },
  { id: "9", name: "Dr. Lisa Park", role: "Teacher" },
  { id: "10", name: "Prof. David Wilson", role: "Teacher", lastMessage: "Meeting rescheduled to 4 PM" },
];

const mockMessages: Record<string, ChatMessage[]> = {
  "2": [
    { id: "m1", senderId: "2", content: "Hi, I wanted to discuss the upcoming mid-term exam schedule.", createdAt: "2025-01-15T10:00:00", isRead: true },
    { id: "m2", senderId: "1", content: "Sure, what about it?", createdAt: "2025-01-15T10:05:00", isRead: true },
    { id: "m3", senderId: "2", content: "Some students have requested a date change due to the science fair. Can we move it to the following week?", createdAt: "2025-01-15T10:10:00", isRead: false },
    { id: "m4", senderId: "1", content: "I'll check the calendar and get back to you by tomorrow.", createdAt: "2025-01-15T10:15:00", isRead: true },
    { id: "m5", senderId: "2", content: "Please review the exam schedule and let me know.", createdAt: "2025-01-15T10:20:00", isRead: false },
  ],
  "3": [
    { id: "m6", senderId: "3", content: "Good news! The new lab equipment has arrived.", createdAt: "2025-01-15T09:00:00", isRead: true },
    { id: "m7", senderId: "1", content: "That's great! When can we set it up?", createdAt: "2025-01-15T09:05:00", isRead: true },
    { id: "m8", senderId: "3", content: "Lab equipment has arrived. Setup scheduled for Saturday.", createdAt: "2025-01-15T09:10:00", isRead: false },
  ],
  "4": [
    { id: "m9", senderId: "4", content: "Thank you so much for the career guidance session yesterday!", createdAt: "2025-01-14T15:00:00", isRead: true },
    { id: "m10", senderId: "1", content: "You're welcome, John! Feel free to reach out anytime.", createdAt: "2025-01-14T15:10:00", isRead: true },
    { id: "m11", senderId: "4", content: "Thank you for the guidance", createdAt: "2025-01-14T15:15:00", isRead: true },
  ],
  "5": [
    { id: "m12", senderId: "5", content: "Hello, I was unable to complete the assignment on time due to illness. Can I submit it late?", createdAt: "2025-01-15T11:00:00", isRead: false },
  ],
};

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setMessages(mockMessages[userId] || []);
  };

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: "1",
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Communicate with students and teachers"
        icon={MessageSquare}
      />

      <ChatWidget
        users={mockUsers}
        messages={messages}
        currentUserId="1"
        selectedUserId={selectedUserId}
        onSelectUser={handleSelectUser}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
