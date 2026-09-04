import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "የተሳሳተ ዩዘርናም ወይም ፓስወርድ!");
      }

      sessionStorage.setItem("user", JSON.stringify(data));

      // 🟢 ሱፐርቫይዘሩ ፓስዎርዱን 123456 ሲያስገባ ወይም ሮሉ 'supervisor' ሲሆን ወደ ሪፖርት መቆጣጠሪያው እንዲሄድ
      if (password === "123456" || data.role === "supervisor") {
        navigate("/supervisor-reports");
        return;
      }

      switch (data.role) {
        case "admin":
          navigate("/admin");
          break;
        case "ict":
          navigate("/ict-news-admin");
          break;
        case "staff":
          navigate("/staff-registrar");
          break;
        case "pool_focal":
          navigate("/pool-dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconBox}>🔐</div>
          <h2 style={styles.title}>የጊዳን ወረዳ ፖርታል መግቢያ</h2>
          <p style={styles.subtitle}>እባክዎ ለመግባት የተጠቃሚ መለያዎን ያስገቡ</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ዩዘርናም ያስገቡ"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? " በመግባት ላይ..." : "ግባ (Login)"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
    backgroundColor: "#f8fafc",
    minHeight: "70vh",
    fontFamily: "inherit",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid #e2e8f0",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  iconBox: {
    fontSize: "32px",
    backgroundColor: "#eff6ff",
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    margin: "0 auto 12px auto",
  },
  title: {
    margin: "0",
    fontSize: "22px",
    color: "#0f172a",
    fontWeight: "bold",
  },
  subtitle: {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#64748b",
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "20px",
    textAlign: "center",
    borderLeft: "4px solid #ef4444",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  submitBtn: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },
};