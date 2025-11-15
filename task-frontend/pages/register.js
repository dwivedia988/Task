import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name || !email || !password) return setErr("All fields required");
    if (password.length < 6) return setErr("Password must be at least 6 chars");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) return setErr(data.message || "Error");
      router.push("/login");
    } catch (err) {
      setErr("Network error");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <div className="error">{err}</div>}
        <button type="submit">Register</button>
      </form>
      <style jsx>{`
        .container {
          max-width: 420px;
          margin: 40px auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        input {
          display: block;
          width: 100%;
          margin: 10px 0;
          padding: 10px;
        }
        .error {
          color: crimson;
        }
        button {
          padding: 10px 16px;
        }
      `}</style>
    </div>
  );
}
