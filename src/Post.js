import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
}) {
  const API_BASE_URL = "http://localhost:5000";
  const coverUrl = `${API_BASE_URL}/${cover}`;
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={coverUrl} alt={title} />
        </Link>
      </div>

      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>

        <p className="info">
          <span className="author">{author?.username || "Anonymous"}</span>
          <time>
            {createdAt
              ? format(new Date(createdAt), "MMM d, yyyy HH:mm")
              : "No Date"}
          </time>
        </p>

        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
