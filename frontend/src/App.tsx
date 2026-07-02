import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Monorepo App</h1>
      <p>Frontend falando com o API Gateway em: {API_URL}</p>
      {loading ? <p>Carregando usuários...</p> : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.name} — {u.email}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
