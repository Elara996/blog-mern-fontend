import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Fetch posts from the backend
    fetch("http://localhost:5000/api/post")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts, status: " + response.status);
        }
        return response.json();
      })
      .then((posts) => {
        setPosts(posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="index-page-container">
            {loading && <p className="loading-message">Loading posts...</p>}   
       {" "}
      {!loading &&
        posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
           {" "}
      {!loading && posts.length === 0 && (
        <p className="no-posts-message">
          No posts found. Let's create one now!
        </p>
      )}
    </div>
  );
}
