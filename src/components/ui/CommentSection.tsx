"use client";

import Image from "next/image";
import React, { useState } from "react";

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
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [showReply, setShowReply] = useState<Record<number, boolean>>({});

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
        className={`bg-transparent p-3 shadow ${
          level > 0 ? `ml-${level * 8}` : ""
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
              <p className="text-white mb-2 mt-3">{comment.text}</p>
              <div className="flex items-center space-x-4">
                <button
                  className={`like-btn flex items-center ${
                    comment.liked ? "text-red-500" : "text-gray-500"
                  } hover:text-red-600`}
                  onClick={() => handleLike(comment.id)}>
                  👍 {comment.likes}
                </button>
                <button
                  className={`dislike-btn flex items-center ${
                    comment.disliked ? "text-blue-500" : "text-gray-500"
                  } hover:text-blue-600`}
                  onClick={() => handleDislike(comment.id)}>
                  👎 {comment.dislikes}
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
          <div className="mt-2 ml-12 flex flex-col sm:flex-row gap-2 reply-form">
            <textarea
              className="bg-[#20272E] p-2 flex-grow reply-input focus:outline-none text-white rounded"
              placeholder="Write a reply..."
              value={replyInputs[comment.id] || ""}
              onChange={(e) =>
                setReplyInputs((prev) => ({
                  ...prev,
                  [comment.id]: e.target.value,
                }))
              }
            />
            <button
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 reply-submit h-[40px]"
              onClick={() => {
                if ((replyInputs[comment.id] || "").trim()) {
                  addReply(comment.id, replyInputs[comment.id].trim());
                }
              }}>
              Send
            </button>
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
      <h2 className="text-2xl font-bold mb-2">Comments</h2>
      <p className="text-white mb-4">{totalComments(comments)} comments</p>
      <div className="mb-4">
        <label htmlFor="sort-select" className="mr-2 text-gray-700">
          Sort by:
        </label>
        <select
          id="sort-select"
          className="border rounded p-2 text-gray-500 focus:outline-none"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <textarea
          id="comment-input"
          className="bg-[#20272E] rounded p-2 flex-grow focus:outline-none text-white"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          id="submit-comment"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 w-[70px]"
          onClick={() => {
            if (commentInput.trim()) {
              addComment(commentInput.trim());
              setCommentInput("");
            }
          }}>
          Send
        </button>
      </div>
      <div className="space-y-4">
        {sortedComments.map((comment) => renderComment(comment))}
      </div>
    </div>
  );
};
