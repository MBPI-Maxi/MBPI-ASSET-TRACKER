import DepartmentDropBox from './DepartmentDropBox';
import StatusDropDown from './StatusDropDown';

import { useFilterContext } from '../context/ItemFilterContext';

export default function ItemFilter() {
  const { 
    item, 
    setItem, 
    filters, 
    setNewFilters, 
    departmentRef, 
    statusRef,
    handleClick
  } = useFilterContext();

  return (
    <section>
      <h2>Item Filter</h2>
      <div>
        <DepartmentDropBox ref={departmentRef} />
        <StatusDropDown ref={statusRef} />
      </div>

      <div>
        <input 
          type="text"
          placeholder="Search Item..."
          onChange={(e) => setItem(e.target.value)}
        />
      </div>
      
      <button onClick={handleClick}>
          Search and Apply Filters
      </button>
    </section>
  );
}
