import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function SignUp({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);

    // Étape 1 : créer l'utilisateur dans auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return alert(error.message);
    }

    const user = data.user;

    // Étape 2 : insérer l’utilisateur aussi dans ta table "users"
    await supabase.from("users").insert({
      id: user.id,   // même id que auth.users
      email,
      role: "user",  // rôle par défaut
    });

    setLoading(false);
    onSignup(user);
  };

  return (
    <div className="signup-card">
      <h2>Créer un compte</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Création..." : "S'inscrire"}
      </button>
    </div>
  );
}
