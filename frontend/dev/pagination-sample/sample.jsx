import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";

import axios from "axios";

async function getUsersPaginated(page = 0, limit = 5) {
  const response = await axios.get("https://jsonplaceholder.typicode.com/users");
  const allUsers = response.data;

  const start = page * limit;
  const paginatedUsers = allUsers.slice(start, start + limit);

  return {
    users: paginatedUsers,
    hasMore: start + limit < allUsers.length,
  };
}

function App() {
  const [page, setPage] = useState(0);
  const limit = 5;

  const { data, isPending, isError, error, isPlaceholderData, isFetching } = useQuery({
    queryKey: ["users", page],
    retry: 10,
    queryFn: () => getUsersPaginated(page, limit),
    staleTime: 1000 * 60 * 60, // cache the data for 1 hour
    cacheTime: 1000 * 60 * 60, // keep the cache for 1 hour
    placeholderData: keepPreviousData
  })
  
  return (
    <div>
      <h2>Users - Page {page + 1}</h2>

      {isPending ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error: {error.message}</p>
      ) : (
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              {user.name} – {user.email}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>
          Previous
        </button>

        <button
          onClick={() => {
            if (!isPlaceholderData && data.hasMore) {
              setPage(p => p + 1);
            }
          }}
          disabled={isPlaceholderData || !data?.hasMore}
          style={{ marginLeft: '1rem' }}
        >
          Next
        </button>
      </div>

      {isFetching && <p>Background updating...</p>}
    </div>
  );
}

export default App;
