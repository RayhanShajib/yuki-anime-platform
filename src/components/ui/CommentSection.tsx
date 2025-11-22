"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { pageApi } from "@/lib/api/pageApi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { MdCancel, MdSend } from "react-icons/md";
import type { ApiComment, ApiCommentResponse, ApiUserVotesResponse } from "@/types/api";

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

type CommentSectionProps = {
  comments?: ApiCommentResponse | null;
  episodeId?: string | number;
  onCommentCreated?: () => void;
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments: externalComments,
  episodeId,
  onCommentCreated,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [commentInput, setCommentInput] = useState("");
  
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [showReply, setShowReply] = useState<Record<number, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [replyPreviews, setReplyPreviews] = useState<Record<number, boolean>>({});

  // Current logged-in user (to show avatar on the left of the input)
  const [currentUser, setCurrentUser] = useState<{ name: string; avatar: string } | null>(null);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // New state for vote functionality
  const [votingComments, setVotingComments] = useState<Set<number>>(new Set());
  const [userVotes, setUserVotes] = useState<ApiUserVotesResponse>({});

  // Load current user's profile if token exists so we can show avatar next to input
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const profile = await pageApi.getProfilePageData(token);
        if (profile) {
          setCurrentUser({
            name: profile.username || profile.user || "User",
            avatar: profile.avatar || profile.profile_picture ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
          });
        }
      } catch {
        // ignore profile load errors, keep fallback
      }
    };

    loadProfile();
  }, []);

  // Load user votes for comments
  useEffect(() => {
    const loadUserVotes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token || !episodeId) return;
        
        const votes = await pageApi.getUserVotes(token, String(episodeId));
        setUserVotes(votes || {});
      } catch {
        // Ignore vote loading errors, defaults to no votes
        setUserVotes({});
      }
    };

    loadUserVotes();
  }, [episodeId]);

  // If parent passes external comments (API response), map and initialize.
  React.useEffect(() => {
    if (!externalComments) return;

    // Handle paginated API response structure
    const commentData = externalComments as ApiCommentResponse;
    const apiComments = commentData?.results || [];

    if (!apiComments.length) {
      setComments([]);
      return;
    }

    const mapped = apiComments.map((c: ApiComment) => {
      // Map replies recursively
      const mapReplies = (replies: ApiComment[]): CommentType[] => 
        replies.map((r: ApiComment) => ({
          id: r.id,
          text: r.content,
          timestamp: new Date(r.created_at),
          replies: mapReplies(r.replies || []),
          likes: r.upvotes,
          dislikes: r.downvotes,
          liked: userVotes[r.id.toString()] === "upvote",
          disliked: userVotes[r.id.toString()] === "downvote",
          user: {
            name: r.user,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
          },
        }));

      return {
        id: c.id,
        text: c.content,
        timestamp: new Date(c.created_at),
        replies: mapReplies(c.replies || []),
        likes: c.upvotes,
        dislikes: c.downvotes,
        liked: userVotes[c.id.toString()] === "upvote",
        disliked: userVotes[c.id.toString()] === "downvote",
        user: {
          name: c.user,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
        },
      } as CommentType;
    });

    setComments(mapped);
  }, [externalComments, userVotes]);

  // Input validation function
  const validateComment = (text: string): string | null => {
    if (!text.trim()) return "Comment cannot be empty";
    if (text.length > 1000) return "Comment is too long (max 1000 characters)";
    if (text.length < 3) return "Comment is too short (min 3 characters)";
    return null;
  };

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

  // Helper function to update comment votes optimistically
  function updateCommentVotes(
    comments: CommentType[], 
    targetId: number, 
    likeChange: number, 
    dislikeChange: number,
    liked: boolean,
    disliked: boolean
  ): CommentType[] {
    return comments.map((c) => {
      if (c.id === targetId) {
        return {
          ...c,
          likes: c.likes + likeChange,
          dislikes: c.dislikes + dislikeChange,
          liked,
          disliked,
        };
      }
      return { ...c, replies: updateCommentVotes(c.replies, targetId, likeChange, dislikeChange, liked, disliked) };
    });
  }

  // ---- COMMENT HANDLERS ----
  function addComment(text: string) {
    // Validate input
    const validationError = validateComment(text);
    if (validationError) {
      setPostError(validationError);
      return;
    }

    const tryCreate = async () => {
      setPostError(null);
      if (!episodeId) {
        setPostError("Missing episode id");
        return;
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        setPostError("Please log in to post comments.");
        return;
      }

      try {
        setPosting(true);
        const res = await pageApi.createComment(token, String(episodeId), text);

        // Map returned comment into local CommentType and prepend
        const mapped: CommentType = {
          id: res.id,
          text: res.content || res.text || "",
          timestamp: new Date(res.created_at || Date.now()),
          replies: Array.isArray(res.replies)
            ? res.replies.map((r: any) => ({
                id: r.id,
                text: r.content || r.text || "",
                timestamp: new Date(r.created_at || Date.now()),
                replies: [],
                likes: r.upvotes || 0,
                dislikes: r.downvotes || 0,
                liked: false,
                disliked: false,
                user: {
                  name: r.user || "User",
                  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
                },
              }))
            : [],
          likes: res.upvotes || 0,
          dislikes: res.downvotes || 0,
          liked: false,
          disliked: false,
          user: {
            name: res.user || currentUser?.name || "User",
            avatar: currentUser?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
          },
        };

        setComments((prev) => [mapped, ...prev]);
        setCommentInput("");
        // Let parent know to refresh if it wants
        if (onCommentCreated) onCommentCreated();
      } catch (err: unknown) {
        // Surface API validation errors or generic message
        if (err && typeof err === "object" && (err as any).data) {
          const d = (err as any).data;
          if (typeof d === "string") setPostError(d);
          else if (typeof d === "object") {
            const parts: string[] = [];
            for (const k of Object.keys(d)) {
              const val = (d as any)[k];
              if (Array.isArray(val)) parts.push(`${k}: ${val.join(", ")}`);
              else parts.push(`${k}: ${String(val)}`);
            }
            setPostError(parts.join("; ") || "Failed to post comment");
          } else setPostError("Failed to post comment");
        } else {
          setPostError("Failed to post comment. Please try again.");
          console.error("Create comment failed:", err);
        }
      } finally {
        setPosting(false);
      }
    };

    void tryCreate();
  }

  function addReply(parentId: number, text: string) {
    // Validate input
    const validationError = validateComment(text);
    if (validationError) {
      setPostError(validationError);
      return;
    }

    const tryReply = async () => {
      if (!episodeId) {
        setPostError("Missing episode id");
        return;
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        setPostError("Please log in to reply.");
        return;
      }

      try {
        setPosting(true);
        const res = await pageApi.createComment(token, String(episodeId), text, parentId);

        // Map API response to local reply format
        const mappedReply: CommentType = {
          id: res.id,
          text: res.content || res.text || "",
          timestamp: new Date(res.created_at || Date.now()),
          replies: [],
          likes: res.upvotes || 0,
          dislikes: res.downvotes || 0,
          liked: false,
          disliked: false,
          user: {
            name: res.user || currentUser?.name || "User",
            avatar: currentUser?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
          },
        };

        // Insert reply into parent comment
        setComments((prev) => {
          const add = (comms: CommentType[]): CommentType[] =>
            comms.map((c) =>
              c.id === parentId
                ? { ...c, replies: [...c.replies, mappedReply] }
                : { ...c, replies: add(c.replies) }
            );
          return add(prev);
        });

        setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
        setShowReply((prev) => ({ ...prev, [parentId]: false }));
        if (onCommentCreated) onCommentCreated();
      } catch (err: unknown) {
        // surface error
        if (err && typeof err === "object" && (err as any).data) {
          const d = (err as any).data;
          if (typeof d === "string") setPostError(d);
          else if (typeof d === "object") {
            const parts: string[] = [];
            for (const k of Object.keys(d)) {
              const val = (d as any)[k];
              if (Array.isArray(val)) parts.push(`${k}: ${val.join(", ")}`);
              else parts.push(`${k}: ${String(val)}`);
            }
            setPostError(parts.join("; ") || "Failed to post reply");
          } else setPostError("Failed to post reply");
        } else {
          setPostError("Failed to post reply. Please try again.");
          console.error("Reply failed:", err);
        }
      } finally {
        setPosting(false);
      }
    };

    void tryReply();
  }

  async function handleLike(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setPostError("Please log in to vote on comments.");
      return;
    }

    // Prevent double-clicking
    if (votingComments.has(id)) return;
    setVotingComments(prev => new Set([...prev, id]));

    try {
      const currentVote = userVotes[id.toString()];
      
      if (currentVote === "upvote") {
        // Remove upvote
        await pageApi.removeVote(token, id);
        setUserVotes(prev => ({ ...prev, [id.toString()]: null }));
        // Optimistic update
        setComments(prev => updateCommentVotes(prev, id, -1, 0, false, false));
      } else {
        // Add upvote (and remove downvote if exists)
        await pageApi.voteComment(token, id, "upvote");
        setUserVotes(prev => ({ ...prev, [id.toString()]: "upvote" }));
        // Optimistic update
        const likeChange = 1;
        const dislikeChange = currentVote === "downvote" ? -1 : 0;
        setComments(prev => updateCommentVotes(prev, id, likeChange, dislikeChange, true, false));
      }
    } catch (err) {
      setPostError("Failed to vote on comment. Please try again.");
      console.error("Vote failed:", err);
    } finally {
      setVotingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }

  async function handleDislike(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setPostError("Please log in to vote on comments.");
      return;
    }

    // Prevent double-clicking
    if (votingComments.has(id)) return;
    setVotingComments(prev => new Set([...prev, id]));

    try {
      const currentVote = userVotes[id.toString()];
      
      if (currentVote === "downvote") {
        // Remove downvote
        await pageApi.removeVote(token, id);
        setUserVotes(prev => ({ ...prev, [id.toString()]: null }));
        // Optimistic update
        setComments(prev => updateCommentVotes(prev, id, 0, -1, false, false));
      } else {
        // Add downvote (and remove upvote if exists)
        await pageApi.voteComment(token, id, "downvote");
        setUserVotes(prev => ({ ...prev, [id.toString()]: "downvote" }));
        // Optimistic update
        const likeChange = currentVote === "upvote" ? -1 : 0;
        const dislikeChange = 1;
        setComments(prev => updateCommentVotes(prev, id, likeChange, dislikeChange, false, true));
      }
    } catch (err) {
      setPostError("Failed to vote on comment. Please try again.");
      console.error("Vote failed:", err);
    } finally {
      setVotingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }

  function totalComments(comms: CommentType[]): number {
    return comms.reduce((acc, c) => acc + 1 + totalComments(c.replies), 0);
  }

  // ---- RENDER COMMENT ----
  function renderComment(comment: CommentType, level = 0): React.ReactNode {
    const isVoting = votingComments.has(comment.id);
    
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
                  } hover:text-white ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isVoting && handleLike(comment.id)}
                  disabled={isVoting}>
                  <FaRegThumbsUp className="mr-1" size={18} />
                  {comment.likes}
                </button>
                <button
                  className={`dislike-btn flex items-center ${
                    comment.disliked ? "text-white" : "text-gray-500"
                  } hover:text-white ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isVoting && handleDislike(comment.id)}
                  disabled={isVoting}>
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
                  className="flex items-center justify-center"
                  onClick={() => {
                    setReplyInputs((prev) => ({ ...prev, [comment.id]: "" }));
                    setShowReply((prev) => ({ ...prev, [comment.id]: false }));
                  }}>
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

      {/* Error Display */}
      {postError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
          <p className="text-red-200 text-sm">{postError}</p>
          <button
            onClick={() => setPostError(null)}
            className="text-red-300 hover:text-red-100 text-xs mt-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="flex items-start space-x-3 mb-6">
          <Image
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face"}
            alt={currentUser?.name || "User Avatar"}
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
                className="flex items-center justify-center"
                onClick={() => setCommentInput("")}>
                <MdCancel size={19} className="text-[#888B8D]" />
              </button>
              <button
                className={`text-white flex justify-center ${posting ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (commentInput.trim() && !posting) {
                    addComment(commentInput.trim());
                  }
                }}
                disabled={posting}>
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