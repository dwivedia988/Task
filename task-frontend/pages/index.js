import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Task Manager App</h1>
      <p style={styles.subtitle}>Welcome! Please choose an option:</p>

      <div style={styles.buttons}>
        <button style={styles.button} onClick={() => router.push("/login")}>
          Login
        </button>

        <button style={styles.button} onClick={() => router.push("/register")}>
          Register
        </button>

        <button style={styles.button} onClick={() => router.push("/tasks")}>
          Tasks
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "20px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    background: "#fff",
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#555",
    marginBottom: "30px",
    fontSize: "16px",
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
  button: {
    padding: "12px 20px",
    width: "200px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "white",
  },
};
