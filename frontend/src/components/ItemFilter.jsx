import { useState } from 'react';

const sampleItems = [
  { id: 1, name: 'Laptop', department: 'IT' },
  { id: 2, name: 'Printer', department: 'PRODUCTION DEPARTMENT' },
  { id: 3, name: 'Whiteboard', department: 'UTILITY MAINTENANCE' },
  { id: 4, name: 'Router', department: 'LAB DEPARTMENT' },
  { id: 5, name: 'Desk Chair', department: 'WAREHOUSE DEPARTMENT' },
  { id: 6, name: 'Desktop', department: 'PRODUCTION MAINTENANCE' },
];

export default function ItemFilter() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  const filteredItems = sampleItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (department === '' || item.department === department)
  );

  return (
    <div className="">
      <h2 className="">Item Filter</h2>
      
      <div className="">
        <input
          type="text"
          placeholder="Search item name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className=""
        />

        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className=""
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="PRODUCTION DEPARTMENT">Production Department</option>
          <option value="UTILITY MAINTENANCE">Utility Maintenance</option>
          <option value="LAB DEPARTMENT">Lab Department</option>
          <option value="WAREHOUSE DEPARTMENT">Warehouse Department</option>
          <option value="PRODUCTION MAINTENANCE">Production Maintenance</option>
        </select>
      </div>

      <ul className="">
        {filteredItems.map(item => (
          <li key={item.id} className="py-2">
            <strong>{item.name}</strong> <span className="">({item.department})</span>
          </li>
        ))}

        {filteredItems.length === 0 && (
          <li className="">No items found.</li>
        )}
      </ul>
    </div>
  );
}
