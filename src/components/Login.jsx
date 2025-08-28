import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Lock, Mail } from "lucide-react"; // icônes modernes

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return alert(error.message);
    }

    const user = data.user;

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    setLoading(false);
    onLogin({ ...user, role: profile?.role });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* Section gauche (branding) */}
      <div className="hidden w-1/2 bg-indigo-600 p-12 text-white lg:flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📦 Stock-App</h1>
          <p className="mt-4 text-lg text-indigo-100">
            Gérez vos stocks en toute simplicité avec une interface moderne et sécurisée.
          </p>
        </div>
        <div className="text-sm opacity-80">
          © {new Date().getFullYear()} Stock-App. Tous droits réservés.
        </div>
      </div>

      {/* Section droite (formulaire) */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
          <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800">
            Bienvenue 👋
          </h2>
          <p className="mb-8 text-center text-gray-500">
            Connectez-vous pour accéder au dashboard.
          </p>

          {/* Email */}
          <div className="mb-4 flex items-center rounded-lg border border-gray-300 bg-gray-50 px-3">
            <Mail className="mr-2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Adresse email"
              className="w-full border-0 bg-gray-50 p-3 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6 flex items-center rounded-lg border border-gray-300 bg-gray-50 px-3">
            <Lock className="mr-2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full border-0 bg-gray-50 p-3 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Bouton */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {/* Lien inscription / reset */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Pas de compte ?{" "}
            <span className="cursor-pointer text-indigo-600 hover:underline">
              Contactez l’admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
