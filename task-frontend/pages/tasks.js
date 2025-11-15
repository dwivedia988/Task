import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [grouped, setGrouped] = useState({
    Pending: [],
    Processing: [],
    Completed: [],
  });
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    checkMe();
  }, []);

  const checkMe = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/me`, { credentials: "include" });
      const data = await res.json();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      await fetchTasks();
    } catch (e) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/api/tasks`, { credentials: "include" });
      const data = await res.json();
      setGrouped(data);
    } catch (err) {
      setErr("Failed to load tasks");
    }
  };

  const createTask = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API}/api/tasks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Create failed");
      setTitle("");
      await fetchTasks();
    } catch (err) {
      setErr("Failed to create");
    }
  };

  const updateTask = async (id, data) => {
    try {
      const res = await fetch(`${API}/api/tasks/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchTasks();
    } catch (err) {
      setErr("Failed to update");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete task?")) return;
    try {
      const res = await fetch(`${API}/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchTasks();
    } catch (err) {
      setErr("Failed to delete");
    }
  };

  const logout = async () => {
    await fetch(`${API}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <h2>Tasks — {user?.name}</h2>
          <small>{user?.email}</small>
        </div>
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <form onSubmit={createTask} style={{ marginBottom: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          style={{ width: "70%", padding: 8 }}
        />
        <button style={{ padding: "8px 12px", marginLeft: 8 }}>Create</button>
      </form>

      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {["Pending", "Processing", "Completed"].map((status) => (
          <section
            key={status}
            style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}
          >
            <h3>
              {status} ({grouped[status]?.length || 0})
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {grouped[status]?.map((task) => (
                <li
                  key={task._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f2f2f2",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {new Date(task.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTask(task._id, { status: e.target.value })
                      }
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Completed</option>
                    </select>
                    <button
                      onClick={() => {
                        const newTitle = prompt("Edit title", task.title);
                        if (newTitle !== null)
                          updateTask(task._id, { title: newTitle });
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
