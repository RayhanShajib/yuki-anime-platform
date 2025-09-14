"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { MdCancel, MdSend } from "react-icons/md";

type CommentType = {
  id: number;
  text: string;
  timestamp: Date;
  replies: CommentType[];
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  user: {
    name: string;
    avatar: string;
  };
};

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return `1 year ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return `1 month ago`;
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return `1 day ago`;
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return `1 hour ago`;
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return `1 minute ago`;
  if (seconds > 1) return `${seconds} seconds ago`;
  if (seconds === 1) return `1 second ago`;
  return "Just now";
}

// Generate random user data for demo purposes
function generateRandomUser() {
  const names = [
    "Alex Johnson",
    "Sarah Chen",
    "Mike Wilson",
    "Emma Davis",
    "Chris Taylor",
    "Lisa Wang",
    "David Brown",
    "Rachel Kim",
    "Tom Anderson",
    "Maria Garcia",
    "James Lee",
    "Sophie Miller",
    "Ryan Clark",
    "Amy Zhang",
    "John Smith",
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b25c?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
  ];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
  };
}

export const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [commentInput, setCommentInput] = useState("");
  // Demo avatar for input
  const inputAvatar =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [showReply, setShowReply] = useState<Record<number, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [replyPreviews, setReplyPreviews] = useState<Record<number, boolean>>(
    {}
  );

  // Format text with bold, italic, and quotes
  function formatText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold: **text**
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic: *text*
      .replace(/""(.*?)""/g, '<span class="text-blue-300">"$1"</span>'); // Double quotes: ""text""
  }

  // Apply formatting to comment text with buttons
  function applyCommentFormatting(type: "bold" | "italic" | "quote") {
    const textarea = document.getElementById(
      "comment-input"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);

    let newText = "";
    let newCursorPos = selectionEnd;

    switch (type) {
      case "bold":
        if (selectedText) {
          newText =
            value.substring(0, selectionStart) +
            `**${selectedText}**` +
            value.substring(selectionEnd);
          newCursorPos = selectionEnd + 4;
        } else {
          newText =
            value.substring(0, selectionStart) +
            "****" +
            value.substring(selectionEnd);
          newCursorPos = selectionStart + 2;
        }
        break;

      case "italic":
        if (selectedText) {
          newText =
            value.substring(0, selectionStart) +
            `*${selectedText}*` +
            value.substring(selectionEnd);
          newCursorPos = selectionEnd + 2;
        } else {
          newText =
            value.substring(0, selectionStart) +
            "**" +
            value.substring(selectionEnd);
          newCursorPos = selectionStart + 1;
        }
        break;

      case "quote":
        if (selectedText) {
          newText =
            value.substring(0, selectionStart) +
            `""${selectedText}""` +
            value.substring(selectionEnd);
          newCursorPos = selectionEnd + 4;
        } else {
          newText =
            value.substring(0, selectionStart) +
            '""""' +
            value.substring(selectionEnd);
          newCursorPos = selectionStart + 2;
        }
        break;
    }

    setCommentInput(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  // Apply formatting to reply text with buttons
  function applyReplyFormatting(
    type: "bold" | "italic" | "quote",
    commentId: number
  ) {
    const textarea = document.querySelector(
      `[data-reply-id="${commentId}"]`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);

    let newText = "";
    let newCursorPos = selectionEnd;

    switch (type) {
      case "bold":
        if (selectedText) {
          newText =
            value.substring(0, selectionStart) +
            `**${selectedText}**` +
            value.substring(selectionEnd);
          newCursorPos = selectionEnd + 4;
        } else {
          newText =
            value.substring(0, selectionStart) +
            "****" +
            value.substring(selectionEnd);
          newCursorPos = selectionStart + 2;
        }
        break;

      case "italic":
        if (selectedText) {
          newText =
            value.substring(0, selectionStart) +
            `*${selectedText}*` +
            value.substring(selectionEnd);
          newCursorPos = selectionEnd + 2;
        } else {
          newText =
            value.substring(0, selectionStart) +
            "**" +
            value.substring(selectionEnd);
          newCursorPos = selectionStart + 1;
        }
        break;

      case "quote":
        if (selectedText) {
          newText =
            value.substring(0, selectionStart) +
            `""${selectedText}""` +
            value.substring(selectionEnd);
          newCursorPos = selectionEnd + 4;
        } else {
          newText =
            value.substring(0, selectionStart) +
            '""""' +
            value.substring(selectionEnd);
          newCursorPos = selectionStart + 2;
        }
        break;
    }

    setReplyInputs((prev) => ({ ...prev, [commentId]: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  function addComment(text: string) {
    const comment: CommentType = {
      id: Date.now(),
      text,
      timestamp: new Date(),
      replies: [],
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
      user: generateRandomUser(),
    };
    setComments((prev) => [comment, ...prev]);
  }

  function addReply(parentId: number, text: string) {
    setComments((prev) => {
      const add = (comms: CommentType[]): CommentType[] =>
        comms.map((c) =>
          c.id === parentId
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  {
                    id: Date.now(),
                    text,
                    timestamp: new Date(),
                    replies: [],
                    likes: 0,
                    dislikes: 0,
                    liked: false,
                    disliked: false,
                    user: generateRandomUser(),
                  },
                ],
              }
            : { ...c, replies: add(c.replies) }
        );
      return add(prev);
    });
    setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
    setShowReply((prev) => ({ ...prev, [parentId]: false }));
  }

  function handleLike(id: number) {
    setComments((prev) => {
      const update = (comms: CommentType[]): CommentType[] =>
        comms.map((c) => {
          if (c.id === id) {
            if (c.liked) {
              return {
                ...c,
                likes: c.likes - 1,
                liked: false,
              };
            } else {
              return {
                ...c,
                likes: c.likes + 1,
                liked: true,
                dislikes: c.disliked ? c.dislikes - 1 : c.dislikes,
                disliked: false,
              };
            }
          }
          return { ...c, replies: update(c.replies) };
        });
      return update(prev);
    });
  }

  function handleDislike(id: number) {
    setComments((prev) => {
      const update = (comms: CommentType[]): CommentType[] =>
        comms.map((c) => {
          if (c.id === id) {
            if (c.disliked) {
              return {
                ...c,
                dislikes: c.dislikes - 1,
                disliked: false,
              };
            } else {
              return {
                ...c,
                dislikes: c.dislikes + 1,
                disliked: true,
                likes: c.liked ? c.likes - 1 : c.likes,
                liked: false,
              };
            }
          }
          return { ...c, replies: update(c.replies) };
        });
      return update(prev);
    });
  }

  function totalComments(comms: CommentType[]): number {
    return comms.reduce((acc, c) => acc + 1 + totalComments(c.replies), 0);
  }

  function renderComment(comment: CommentType, level = 0): React.ReactNode {
    return (
      <div
        key={comment.id}
        className={`bg-transparent py-1 shadow ${
          level > 0 ? "pl-[30px]" : ""
        }`}>
        <div className="flex items-start space-x-3 mb-2">
          <Image
            src={comment.user.avatar}
            alt={comment.user.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-white font-medium text-sm">
                {comment.user.name}
              </h4>
              <span className="text-gray-400 text-xs">
                {timeAgo(comment.timestamp)}
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              {formatDateTime(comment.timestamp)}
            </p>
            <div>
              <div
                className="text-white mb-2 mt-3"
                dangerouslySetInnerHTML={{ __html: formatText(comment.text) }}
              />
              <div className="flex items-center space-x-4">
                <button
                  className={`like-btn flex items-center ${
                    comment.liked ? "text-white" : "text-gray-500"
                  } hover:text-white`}
                  onClick={() => handleLike(comment.id)}>
                  <FaRegThumbsUp className="mr-1" size={18} />
                  {comment.likes}
                </button>
                <button
                  className={`dislike-btn flex items-center ${
                    comment.disliked ? "text-white" : "text-gray-500"
                  } hover:text-white`}
                  onClick={() => handleDislike(comment.id)}>
                  <FaRegThumbsDown className="mr-1" size={18} />
                  {comment.dislikes}
                </button>
                <button
                  className="text-blue-500 hover:underline reply-btn"
                  onClick={() =>
                    setShowReply((prev) => ({
                      ...prev,
                      [comment.id]: !prev[comment.id],
                    }))
                  }>
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        {showReply[comment.id] && (
          <div className="mt-2 ml-8 sm:ml-[20px] flex flex-col reply-form">
            {replyPreviews[comment.id] ? (
              <div
                className="bg-[#20272E] p-2 min-h-[80px] text-white border border-gray-600 rounded-t-xl"
                dangerouslySetInnerHTML={{
                  __html:
                    formatText(replyInputs[comment.id] || "") ||
                    '<span class="text-gray-500">Preview will appear here...</span>',
                }}
              />
            ) : (
              <textarea
                data-reply-id={comment.id}
                className="bg-[#20272E] p-2 flex-grow reply-input focus:outline-none text-white rounded-t-xl"
                placeholder="Write a reply..."
                value={replyInputs[comment.id] || ""}
                onChange={(e) =>
                  setReplyInputs((prev) => ({
                    ...prev,
                    [comment.id]: e.target.value,
                  }))
                }
              />
            )}
            <div className="bg-[#1A1F25] rounded-b-xl p-1 flex justify-between gap-2 flex-wrap">
              <div className="flex flex-wrap items-center">
                <button
                  onClick={() => applyReplyFormatting("bold", comment.id)}
                  className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md font-bold"
                  title="Bold">
                  <strong>B</strong>
                </button>
                <button
                  onClick={() => applyReplyFormatting("italic", comment.id)}
                  className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md italic"
                  title="Italic">
                  <em>I</em>
                </button>
                <button
                  onClick={() => applyReplyFormatting("quote", comment.id)}
                  className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md"
                  title="Quote">
                  &quot;&quot;
                </button>
                <button
                  onClick={() =>
                    setReplyPreviews((prev) => ({
                      ...prev,
                      [comment.id]: !prev[comment.id],
                    }))
                  }
                  className={`${
                    replyPreviews[comment.id]
                      ? "bg-[#111418b5]"
                      : "hover:bg-[#111418b5]"
                  } text-[#888B8D] px-1.5 py-1 rounded text-sm`}
                  title={
                    replyPreviews[comment.id] ? "Show Editor" : "Show Preview"
                  }>
                  View
                </button>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  id="cancel-comment"
                  className="flex items-center justify-center"
                  onClick={() => setCommentInput("")}>
                  <MdCancel size={19} className="text-[#888B8D]" />
                </button>
                <button
                  className="text-white reply-submit flex justify-center"
                  onClick={() => {
                    if ((replyInputs[comment.id] || "").trim()) {
                      addReply(comment.id, replyInputs[comment.id].trim());
                    }
                  }}>
                  <MdSend size={20} className="text-[#888B8D]" />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => renderComment(reply, level + 1))}
        </div>
      </div>
    );
  }

  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === "newest"
      ? b.timestamp.getTime() - a.timestamp.getTime()
      : a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Comments</h2>
      <div className="mb-4 flex justify-between items-center flex-wrap">
        <p className="text-white mb-4">{totalComments(comments)} comments</p>
        <select
          id="sort-select"
          className="border-b border-b-blue-600 p-2 text-gray-500 focus:outline-none"
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value as "newest" | "oldest")
          }>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="mb-4 flex flex-col">
        <div className="flex items-start gap-3">
          <Image
            src={inputAvatar}
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
            priority
            unoptimized
          />
          <div className="flex-1 flex flex-col flex-wrap">
            {showPreview ? (
              <div
                className="bg-[#20272E] rounded-t-xl p-2 min-h-[100px] text-white border border-gray-600"
                dangerouslySetInnerHTML={{
                  __html:
                    formatText(commentInput) ||
                    '<span class="text-gray-500">Preview will appear here...</span>',
                }}
              />
            ) : (
              <textarea
                id="comment-input"
                className="bg-[#20272E] rounded-t-xl p-2 flex-grow focus:outline-none text-white w-full"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
            )}
            <div className="bg-[#1A1F25] rounded-b-xl p-1 flex justify-between gap-4 flex-wrap">
              <div className="flex items-center flex-wrap">
                <button
                  onClick={() => applyCommentFormatting("bold")}
                  className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md font-bold"
                  title="Bold"
                  type="button">
                  <strong>B</strong>
                </button>
                <button
                  onClick={() => applyCommentFormatting("italic")}
                  className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md italic"
                  title="Italic"
                  type="button">
                  <em>I</em>
                </button>
                <button
                  onClick={() => applyCommentFormatting("quote")}
                  className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md"
                  title="Quote"
                  type="button">
                  &quot;&quot;
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`${
                    showPreview ? "bg-[#111418b5]" : "hover:bg-[#111418b5]"
                  } text-[#888B8D] px-1.5 py-1 rounded text-sm`}
                  title={showPreview ? "Show Editor" : "Show Preview"}
                  type="button">
                  View
                </button>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  id="cancel-comment"
                  className="text-white flex items-center justify-center"
                  onClick={() => setCommentInput("")}
                  type="button">
                  <MdCancel size={19} className="text-[#888B8D]" />
                </button>
                <button
                  id="submit-comment"
                  className="text-white flex justify-center"
                  onClick={() => {
                    if (commentInput.trim()) {
                      addComment(commentInput.trim());
                      setCommentInput("");
                    }
                  }}
                  type="button">
                  <MdSend size={20} className="text-[#888B8D]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 overflow-auto">
        {sortedComments.map((comment) => renderComment(comment))}
      </div>
    </div>
  );
};
