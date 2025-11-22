import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function register(ev) {
    ev.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        // If backend returns error
        const errData = await response.json();
        setMessage("Error: " + (errData.message || "Failed to register"));
        return;
      }

      const data = await response.json();
      setMessage(`User ${data.username} registered successfully!`);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Register failed:", err);
      setMessage("Failed to connect to server. Make sure backend is running!");
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      {message && <p>{message}</p>}
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input type="email" placeholder="email" />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
