import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to hold the form data
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/post/${id}`)
      .then((response) => {
        if (response.status === 404) {
          alert("Post not found.");
          navigate("/");
          return;
        }
        return response.json();
      })
      .then((post) => {
        setTitle(post.title);
        setSummary(post.summary);
        setContent(post.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load post for editing:", error);
        setLoading(false);
      });
  }, [id, navigate]);

  async function updatePost(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.set("id", id);
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);

    if (files?.[0]) {
      data.set("cover", files[0]);
    }

    const response = await fetch("http://localhost:5000/api/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      navigate(`/post/${id}`);
    } else if (response.status === 403) {
      alert("Error: You are not authorized to edit this post.");
    } else {
      alert("Failed to update post.");
    }
  }

  if (loading) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading Editor...
      </h1>
    );
  }

  return (
    <form onSubmit={updatePost} className="edit-post-form">
      <h1>Edit Post</h1>

      <input
        type="text"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <input
        type="text"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />

      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <textarea
        placeholder={"Post Content..."}
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
      />

      <button type="submit">Update Post</button>
    </form>
  );
}
