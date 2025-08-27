import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    onLogin(data.user);
  };

  return (
    <div className="login-container">
      <h2>Inventory Management</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Sign In"}
      </button>

      <style>{`
        .login-container {
          display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh;
          gap:12px; font-family:Arial; background:linear-gradient(135deg,#6a11cb 0%,#2575fc 100%);
        }
        input { padding:12px; width:250px; border-radius:6px; border:1px solid #ccc; }
        button { padding:12px 24px; border:none; border-radius:6px; background:#27ae60; color:white; cursor:pointer; }
        button:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>
    </div>
  );
}
