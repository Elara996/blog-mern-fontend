import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../Usercontext";

const safeFormatDate = (dateString) => {
  if (!dateString) {
    return "No Date";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return format(date, "MMM d, yyyy HH:mm");
  } catch (error) {
    console.error("Date formatting failed:", error);
    return "Error Formatting Date";
  }
};

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:5000/api/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        return response.json();
      })
      .then((postData) => {
        setPostInfo(postData);
      })
      .catch((error) => {
        console.error("Error fetching single post:", error);
      });
  }, [id]);
  if (!postInfo) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading post...
      </div>
    );
  }

  const { title, cover, content, createdAt, author } = postInfo;
  const API_BASE_URL = "http://localhost:5000";
  const coverUrl = `${API_BASE_URL}/${cover}`;
  const isAuthor = userInfo?.id === author?._id;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      {/* 1. EDIT BUTTON (Shown only to the author) */}
      {isAuthor && (
        <div className="edit-row">
          <Link to={`/edit/${id}`} className="edit-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.69-2.684a4.5 4.5 0 011.13-1.897L16.862 4.487zm0 0l2.572 2.572L7.583 19.826H4.25V16.471L16.862 4.487z"
              />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      {/* 2. INFO BAR (Author and Date) */}
      <div className="info-bar">
        <p className="author">by @{author?.username || "Anonymous"}</p>
        <time>{safeFormatDate(createdAt)}</time>
      </div>
      {/* 3. IMAGE CONTAINER (Full width) */}
      <div className="image-container">
        <img src={coverUrl} alt={title} />
      </div>
      {/* 4. CONTENT */}
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
