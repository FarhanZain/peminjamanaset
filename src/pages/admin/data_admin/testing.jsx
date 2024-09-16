// pages/users.js
import { useState, useEffect } from "react";

export default function TestingPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data dari API route
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // Menyimpan data ke state
        setLoading(false); // Mengubah status loading
      })
      .catch((err) => {
        setError("Failed to fetch users"); // Mengatur error jika terjadi kesalahan
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.no_wa}
          </li>
        ))}
      </ul>
    </div>
  );
}
