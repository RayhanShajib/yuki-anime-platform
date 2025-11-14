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
// Return a deterministic fallback user for locally created comments when
// there's no authenticated user available. This avoids showing random demo
// names/avatars in production.
function generateRandomUser() {
  return {
    name: "Guest",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
  };
}

type CommentSectionProps = {
  // Optional external comments (API response) to initialize the section
  comments?: Array<any>;
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments: externalComments,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [commentInput, setCommentInput] = useState("");
  const inputAvatar =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [showReply, setShowReply] = useState<Record<number, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [replyPreviews, setReplyPreviews] = useState<Record<number, boolean>>(
    {}
  );

  // If parent passes external comments (API response), map and initialize.
  // Accept both: an array of comments or a paginated object { results: [] }.
  React.useEffect(() => {
    if (!externalComments) return;

    const list: any[] = Array.isArray(externalComments)
      ? externalComments
      : Array.isArray((externalComments as any).results)
      ? (externalComments as any).results
      : [];

    if (!list.length) {
      setComments([]);
      return;
    }

    const mapped = list.map((c: any) => {
      // 'user' can be a string (username) or an object with details.
      const userName =
        typeof c.user === "string"
          ? c.user
          : c.user?.username || c.user?.name || "User";

      const userAvatar =
        typeof c.user === "object"
          ? c.user?.avatar || c.user?.profile_picture
          : undefined;

      return {
        id: c.id,
        text: c.content || c.text || c.body || "",
        timestamp: new Date(c.created_at || c.timestamp || Date.now()),
        replies: Array.isArray(c.replies)
          ? c.replies.map((r: any) => ({
              id: r.id,
              text: r.content || r.text || r.body || "",
              timestamp: new Date(r.created_at || r.timestamp || Date.now()),
              replies: [],
              likes: r.likes_count || 0,
              dislikes: r.dislikes_count || 0,
              liked: !!r.liked,
              disliked: !!r.disliked,
              user: {
                name:
                  typeof r.user === "string"
                    ? r.user
                    : r.user?.username || r.user?.name || "User",
                avatar:
                  r.user?.avatar || r.user?.profile_picture ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
              },
            }))
          : [],
        likes: c.likes_count || 0,
        dislikes: c.dislikes_count || 0,
        liked: !!c.liked,
        disliked: !!c.disliked,
        user: {
          name: userName,
          avatar:
            userAvatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
        },
      } as CommentType;
    });

    setComments(mapped);
  }, [externalComments]);

  // Format text with bold, italic, quotes, and spoilers
  function formatText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/""(.*?)""/g, '<span class="text-blue-300">"$1"</span>')
      .replace(
        /\|\|(.*?)\|\|/g,
        `<span class="spoiler rounded px-1 cursor-pointer select-none relative inline-block" style="background: #1A1F25; color: transparent; text-shadow: none; -webkit-text-stroke: 0;" onclick="this.style.background='transparent';this.style.color='white';this.classList.add('revealed');">$1</span>`
      );
  }

  // Formatting for main comment
  function applyCommentFormatting(
    type: "bold" | "italic" | "quote" | "spoiler"
  ) {
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
        newText = selectedText
          ? value.substring(0, selectionStart) +
            `**${selectedText}**` +
            value.substring(selectionEnd)
          : value.substring(0, selectionStart) +
            "****" +
            value.substring(selectionEnd);
        newCursorPos = selectionStart + 2;
        break;

      case "italic":
        newText = selectedText
          ? value.substring(0, selectionStart) +
            `*${selectedText}*` +
            value.substring(selectionEnd)
          : value.substring(0, selectionStart) +
            "**" +
            value.substring(selectionEnd);
        newCursorPos = selectionStart + 1;
        break;

      case "quote":
        newText = selectedText
          ? value.substring(0, selectionStart) +
            `""${selectedText}""` +
            value.substring(selectionEnd)
          : value.substring(0, selectionStart) +
            '""""' +
            value.substring(selectionEnd);
        newCursorPos = selectionStart + 2;
        break;

      case "spoiler":
        newText = selectedText
          ? value.substring(0, selectionStart) +
            `||${selectedText}||` +
            value.substring(selectionEnd)
          : value.substring(0, selectionStart) +
            "||||" +
            value.substring(selectionEnd);
        newCursorPos = selectionStart + 2;
        break;
    }

    setCommentInput(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }
  // Formatting for reply
  function applyReplyFormatting(
    type: "bold" | "italic" | "quote" | "spoiler",
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
        newText = selectedText
          ? value.substring(0, selectionStart) +
            `**${selectedText}**` +
            value.substring(selectionEnd)
          : value.substring(0, selectionStart) +
            "****" +
            value.substring(selectionEnd);
        newCursorPos = selectionStart + 2;
        break;

      case "italic":
        newText = selectedText
          ? value.substring(0, selectionStart) +
            `*${selectedText}*` +
            value.substring(selectionEnd)
          : value.substring(0, selectionStart) +
            "**" +
            value.substring(selectionEnd);
        newCursorPos = selectionStart + 1;
        break;

      case "quote":
        newText = selectedText
          ? value.substring(0, selectionStart) +
            `""${selectedText}""` +
            value.substring(selectionEnd)
          : value.substring(0, selectionStart) +
            '""""' +
            value.substring(selectionEnd);
        newCursorPos = selectionStart + 2;
        break;

      case "spoiler":
        newText = selectedText
          ? value.substring(0, selectionStart) +
            `||${selectedText}||` +
            value.substring(selectionEnd)
          : value.substring(0, selectionStart) +
            "||||" +
            value.substring(selectionEnd);
        newCursorPos = selectionStart + 2;
        break;
    }

    setReplyInputs((prev) => ({ ...prev, [commentId]: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  // ---- COMMENT HANDLERS ----
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
              return { ...c, likes: c.likes - 1, liked: false };
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
              return { ...c, dislikes: c.dislikes - 1, disliked: false };
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

  // ---- RENDER COMMENT ----
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
                  className="text-pink hover:underline reply-btn"
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

        {/* Reply Box */}
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
              <div
                style={{
                  background:
                    "linear-gradient(to right, #000000 0%, #1a0e26 50%, #000000 100%)",
                  padding: "2px",
                  borderRadius: "0.75rem 0.75rem 0 0",
                }}>
                <textarea
                  data-reply-id={comment.id}
                  className="bg-purple p-2 flex-grow reply-input focus:outline-none text-white rounded-t-xl border-0 w-full"
                  placeholder="Write a reply..."
                  value={replyInputs[comment.id] || ""}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
                />
              </div>
            )}
            <div className="bg-[#2d2341] rounded-b-xl p-1 flex justify-between gap-2 flex-wrap">
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
                  onClick={() => applyReplyFormatting("spoiler", comment.id)}
                  className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md"
                  title="Spoiler">
                  S
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
                  <MdSend size={19} className="text-[#888B8D]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies.length > 0 && (
          <div className="ml-4 mt-2">
            {comment.replies.map((r) => renderComment(r, level + 1))}
          </div>
        )}
      </div>
    );
  }

  // ---- SORTED COMMENTS ----
  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === "newest"
      ? b.timestamp.getTime() - a.timestamp.getTime()
      : a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div className="bg-transparent p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl text-white font-semibold">
          Comments ({totalComments(comments)})
        </h3>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="bg-[#1e1434] text-white px-2 py-1 rounded-md text-sm focus:outline-none">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Input Box */}
      <div className="flex items-start space-x-3 mb-6">
        <Image
          src={inputAvatar}
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col flex-1">
          {showPreview ? (
            <div
              className="bg-[#20272E] p-2 min-h-[80px] text-white border border-gray-600 rounded-t-xl"
              dangerouslySetInnerHTML={{
                __html:
                  formatText(commentInput) ||
                  '<span class="text-gray-500">Preview will appear here...</span>',
              }}
            />
          ) : (
            <textarea
              id="comment-input"
              className="bg-purple p-2 w-full min-h-[80px] text-white rounded-t-xl focus:outline-none border border-[#1e1434]"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
          )}
          <div className="bg-[#1e1434] rounded-b-xl p-1 flex justify-between gap-2 flex-wrap">
            <div className="flex flex-wrap items-center">
              <button
                onClick={() => applyCommentFormatting("bold")}
                className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md font-bold"
                title="Bold">
                <strong>B</strong>
              </button>
              <button
                onClick={() => applyCommentFormatting("italic")}
                className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md italic"
                title="Italic">
                <em>I</em>
              </button>
              <button
                onClick={() => applyCommentFormatting("quote")}
                className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md"
                title="Quote">
                &quot;&quot;
              </button>
              <button
                onClick={() => applyCommentFormatting("spoiler")}
                className="hover:bg-[#111418b5] text-[#888B8D] px-1.5 py-1 rounded text-md"
                title="Spoiler">
                S
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`${
                  showPreview ? "bg-[#111418b5]" : "hover:bg-[#111418b5]"
                } text-[#888B8D] px-1.5 py-1 rounded text-sm`}
                title={showPreview ? "Show Editor" : "Show Preview"}>
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
                className="text-white flex justify-center"
                onClick={() => {
                  if (commentInput.trim()) {
                    addComment(commentInput.trim());
                    setCommentInput("");
                  }
                }}>
                <MdSend size={19} className="text-[#888B8D]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Comments */}
      <div>{sortedComments.map((c) => renderComment(c))}</div>
    </div>
  );
};
