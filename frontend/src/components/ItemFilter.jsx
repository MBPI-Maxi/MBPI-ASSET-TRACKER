import { useState } from 'react';

const sampleItems = [
  { id: 1, name: 'Laptop', department: 'IT' },
  { id: 2, name: 'Printer', department: 'Admin' },
  { id: 3, name: 'Whiteboard', department: 'HR' },
  { id: 4, name: 'Router', department: 'IT' },
  { id: 5, name: 'Desk Chair', department: 'Admin' },
];

export default function ItemFilter() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  const filteredItems = sampleItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (department === '' || item.department === department)
  );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-4">
      <h2 className="text-2xl font-bold mb-2">Item Filter</h2>
      
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search item name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />

        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <ul className="divide-y divide-gray-200">
        {filteredItems.map(item => (
          <li key={item.id} className="py-2">
            <strong>{item.name}</strong> <span className="text-sm text-gray-500">({item.department})</span>
          </li>
        ))}

        {filteredItems.length === 0 && (
          <li className="py-2 text-gray-500">No items found.</li>
        )}
      </ul>
    </div>
  );
}
