import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./Usercontext";

export default function Header() {
  const [userInfo, setUserInfo] = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) return setUserInfo(null);
        return response.json();
      })
      .then((data) => {
        if (data) setUserInfo(data);
      })
      .catch((err) => console.error("Profile fetch error:", err));
  });

  function logout(ev) {
    ev.preventDefault();
    fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => setUserInfo(null));
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Deepsire
      </Link>

      <nav>
        {!username ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/create">Create new post</Link>
            <a href="/" onClick={logout}>
              Logout
            </a>
          </>
        )}
      </nav>
    </header>
  );
}
