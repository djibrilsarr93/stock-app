// src/components/Login.jsx
import { useState } from "react";

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
      <div className="login-card">
        <h2>Inventory Management</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
      </div>
      <style>{`
        .login-container{display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f2f5;}
        .login-card{background:white;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.1);width:350px;text-align:center;}
        input{width:100%;padding:12px;margin-bottom:15px;border-radius:6px;border:1px solid #ccc;}
        button{width:100%;padding:12px;border:none;border-radius:6px;background:#27ae60;color:white;cursor:pointer;}
        button:disabled{opacity:.6;cursor:not-allowed;}
      `}</style>
    </div>
  );
}
