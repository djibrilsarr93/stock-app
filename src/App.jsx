import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "" });
  const [search, setSearch] = useState("");

  // Vérifier la session au démarrage
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  // Charger le rôle et produits quand user change
  useEffect(() => {
    if (user) {
      fetchRole();
      fetchProducts();
    }
  }, [user]);

  // Charger rôle depuis la table users
  async function fetchRole() {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("email", user.email)
      .single();
    if (!error && data) {
      setRole(data.role);
    }
  }

  // Charger produits
  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*");
    if (!error && data) {
      setProducts(data);
    }
  }

  // Ajouter produit (admin seulement)
  async function addProduct(e) {
    e.preventDefault();
    if (!form.name || !form.quantity) return;
    const { data, error } = await supabase
      .from("products")
      .insert([{ name: form.name, quantity: parseInt(form.quantity) }])
      .select();
    if (!error && data) setProducts([...products, ...data]);
    setForm({ name: "", quantity: "" });
  }

  // Supprimer produit (admin seulement)
  async function deleteProduct(id) {
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter((p) => p.id !== id));
  }

  // Export CSV
  function exportCSV() {
    const rows = [
      ["ID", "Name", "Quantity"],
      ...products.map((p) => [p.id, p.name, p.quantity]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "products.csv";
    link.click();
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Si pas connecté → page login
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="container">
      <header>
        <h1>📦 Stock Manager</h1>
        <div>
          <span className="badge">{role}</span>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      </header>

      {/* Admin seulement */}
      {role === "admin" && (
        <form onSubmit={addProduct} className="form-inline">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <button type="submit">➕ Add</button>
        </form>
      )}

      <div className="actions">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            {role === "admin" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              {role === "admin" && (
                <td>
                  <button onClick={() => deleteProduct(p.id)}>🗑 Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .container{max-width:900px;margin:30px auto;font-family:Arial;padding:0 10px;}
        header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
        header h1{color:#2c3e50;}
        .badge{background:#3498db;color:#fff;padding:4px 10px;border-radius:12px;margin-right:10px;font-size:0.9em;}
        header button{padding:6px 12px;background:#e67e22;color:white;border:none;border-radius:6px;cursor:pointer;}
        form.form-inline{display:flex;gap:10px;margin-bottom:20px;}
        table{width:100%;border-collapse:collapse;margin-top:20px;}
        th,td{padding:8px;text-align:center;border-bottom:1px solid #ccc;}
        input{padding:6px;margin:5px;border-radius:6px;border:1px solid #ccc;}
        button{padding:6px 12px;border:none;border-radius:6px;background:#27ae60;color:white;cursor:pointer;}
        button:hover{background:#2ecc71;}
        .actions{display:flex;justify-content:space-between;align-items:center;margin-top:10px;}
      `}</style>
    </div>
  );
}

export default App;
