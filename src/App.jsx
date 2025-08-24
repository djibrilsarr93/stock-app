import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";

function App() {
  // --- PRODUITS ---
  const [produits, setProduits] = useState(() => {
    const saved = localStorage.getItem("produits");
    return saved ? JSON.parse(saved) : [];
  });
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prix, setPrix] = useState("");
  const [alerte, setAlerte] = useState("");
  const [recherche, setRecherche] = useState(""); 
  const [tri, setTri] = useState({ champ: "nom", ordre: "asc" });

  // --- CONNEXION ---
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // --- UTILISATEURS ---
  const [utilisateurs, setUtilisateurs] = useState(() => {
    const saved = localStorage.getItem("utilisateurs");
    return saved
      ? JSON.parse(saved)
      : [{ username: "admin", password: bcrypt.hashSync("1234", 10) }];
  });
  const [newUser, setNewUser] = useState({ username: "", password: "" });

  // --- SAUVEGARDE ---
  useEffect(() => { localStorage.setItem("produits", JSON.stringify(produits)); }, [produits]);
  useEffect(() => { localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs)); }, [utilisateurs]);

  // --- PRODUITS ---
  const ajouterProduit = () => {
    if (!nom || !quantite || !prix) { alert("Remplir tous les champs !"); return; }
    setProduits([...produits, { id: Date.now(), nom, quantite: parseInt(quantite), prix: parseFloat(prix) }]);
    setNom(""); setQuantite(""); setPrix("");
  };
  const supprimerProduit = (id) => setProduits(produits.filter((p) => p.id !== id));
  const modifierProduit = (id, champ, valeur) => {
    if (!isAdmin) return;
    setProduits(produits.map(p => p.id === id ? { ...p, [champ]: champ === "quantite" ? parseInt(valeur) : parseFloat(valeur) } : p));
  };
  const valeurTotale = produits.reduce((acc, p) => acc + p.quantite * p.prix, 0);
  const couleurStock = (qte) => (qte <= 3 ? "#f8d7da" : qte <= 10 ? "#fff3cd" : "#d4edda");

  useEffect(() => {
    const produitsCritiques = produits.filter((p) => p.quantite <= 3);
    setAlerte(produitsCritiques.length > 0 ? `⚠️ Stock critique : ${produitsCritiques.map(p => p.nom).join(", ")}` : "");
  }, [produits]);

  // --- FILTRE & TRI ---
  const produitsFiltres = produits.filter(p =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const produitsFiltresTries = [...produitsFiltres].sort((a, b) => {
    let valA = a[tri.champ];
    let valB = b[tri.champ];
    if (typeof valA === "string") { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
    if (valA < valB) return tri.ordre === "asc" ? -1 : 1;
    if (valA > valB) return tri.ordre === "asc" ? 1 : -1;
    return 0;
  });

  const trierProduits = (champ) => {
    const ordre = tri.champ === champ && tri.ordre === "asc" ? "desc" : "asc";
    setTri({ champ, ordre });
  };

  // --- EXPORT CSV ---
  const exporterCSV = () => {
    if (!produits.length) return alert("Aucun produit à exporter !");
    const header = ["Nom", "Quantité", "Prix unitaire", "Total"];
    const rows = produits.map(p => [p.nom, p.quantite, p.prix, p.quantite * p.prix]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stock.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- UTILISATEURS ---
  const ajouterUtilisateur = async () => {
    if (!newUser.username || !newUser.password) { alert("Remplir tous les champs !"); return; }
    if (utilisateurs.find(u => u.username === newUser.username)) { alert("Utilisateur existant !"); return; }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    setUtilisateurs([...utilisateurs, { username: newUser.username, password: hashedPassword }]);
    setNewUser({ username: "", password: "" });
  };
  const supprimerUtilisateur = (usernameToDelete) => {
    if (usernameToDelete === "admin") { alert("Impossible de supprimer l'admin !"); return; }
    setUtilisateurs(utilisateurs.filter(u => u.username !== usernameToDelete));
  };

  // --- CONNEXION ---
  const login = async () => {
    const user = utilisateurs.find(u => u.username === username);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) { setIsAdmin(user.username === "admin"); setIsLogged(true); return; }
    }
    alert("Identifiants invalides !");
  };
  const logout = () => { setIsLogged(false); setIsAdmin(false); setUsername(""); setPassword(""); };

  // --- ÉCRAN CONNEXION ---
  if (!isLogged) {
    return (
      <div className="container">
        <h2>Connexion</h2>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Se connecter</button>
        <p className="info">Admin: admin / 1234</p>
      </div>
    );
  }

  // --- APPLICATION PRINCIPALE ---
  return (
    <div className="container">
      <header>
        <h1>📦 Gestion de Stock</h1>
        <button className="logout" onClick={logout}>Déconnexion</button>
      </header>

      <div className="total-stock">Valeur totale du stock : {valeurTotale} CFA</div>
      {alerte && <div className="alerte">{alerte}</div>}

      <div className="form-recherche">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={exporterCSV} style={{ marginBottom: "10px", background: "#2980b9", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
          Exporter CSV
        </button>
      </div>

      <div className="form-ajout">
        <input type="text" placeholder="Nom du produit" value={nom} onChange={(e) => setNom(e.target.value)} />
        <input type="number" placeholder="Quantité" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
        <input type="number" placeholder="Prix unitaire" value={prix} onChange={(e) => setPrix(e.target.value)} />
        <button onClick={ajouterProduit}>Ajouter</button>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => trierProduits("nom")}>Nom {tri.champ === "nom" ? (tri.ordre === "asc" ? "↑" : "↓") : ""}</th>
            <th onClick={() => trierProduits("quantite")}>Quantité {tri.champ === "quantite" ? (tri.ordre === "asc" ? "↑" : "↓") : ""}</th>
            <th onClick={() => trierProduits("prix")}>Prix {tri.champ === "prix" ? (tri.ordre === "asc" ? "↑" : "↓") : ""}</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {produitsFiltresTries.map(p => (
            <tr key={p.id} style={{ backgroundColor: couleurStock(p.quantite) }}>
              <td>{p.nom}</td>
              <td>{isAdmin ? <input type="number" value={p.quantite} onChange={e => modifierProduit(p.id, "quantite", e.target.value)} /> : p.quantite}</td>
              <td>{isAdmin ? <input type="number" value={p.prix} onChange={e => modifierProduit(p.id, "prix", e.target.value)} /> : p.prix}</td>
              <td>{p.quantite * p.prix}</td>
              <td><button className="btn-suppr" onClick={() => supprimerProduit(p.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAdmin && (
        <div className="gestion-users">
          <h2>Gestion des utilisateurs</h2>
          <div className="form-users">
            <input type="text" placeholder="Nom d'utilisateur" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
            <input type="password" placeholder="Mot de passe" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <button onClick={ajouterUtilisateur}>Ajouter</button>
          </div>
          <ul>
            {utilisateurs.map(u => (
              <li key={u.username}>{u.username} {u.username !== "admin" && <button className="btn-suppr" onClick={() => supprimerUtilisateur(u.username)}>Supprimer</button>}</li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .container { max-width: 900px; margin: 30px auto; font-family: Arial; padding: 0 10px; }
        header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        header h1 { color: #2c3e50; }
        .logout { background: #e67e22; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
        .total-stock { text-align: center; font-size: 20px; font-weight: bold; color: #2980b9; margin-bottom: 10px; }
        .alerte { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 6px; text-align: center; margin-bottom: 20px; }
        .form-recherche { text-align: center; margin-bottom: 20px; }
        .form-recherche input { padding: 8px; width: 250px; border-radius: 6px; border: 1px solid #ccc; }
        .form-ajout { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap; }
        .form-ajout input { padding: 8px; flex: 1 1 150px; border-radius: 6px; border: 1px solid #ccc; }
        .form-ajout button { background: #27ae60; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
        table { width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px; }
        th, td { padding: 10px; text-align: center; cursor: pointer; }
        th { background: #34495e; color: white; }
        tbody tr:nth-child(even) { opacity: 0.95; }
        .btn-suppr { background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; }
        .gestion-users { background: #f4f6f7; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .form-users { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
        .form-users input { padding: 6px; flex: 1 1 120px; border-radius: 6px; border: 1px solid #ccc; }
        ul { list-style: none; padding-left: 0; }
        li { margin-bottom: 5px; }
        .info { color: #7f8c8d; margin-top: 10px; }
        @media (max-width: 600px) { .form-ajout, .form-users { flex-direction: column; } .form-ajout input, .form-users input { flex: 1 1 auto; } }
      `}</style>
    </div>
  );
}

export default App;
