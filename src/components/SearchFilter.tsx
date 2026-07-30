interface SearchFilterProps {
  search: string;
  filter: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
}

function SearchFilter({
  search,
  filter,
  categoryFilter,
  onSearchChange,
  onFilterChange,
  onCategoryFilterChange,
}: SearchFilterProps) {
  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option>All</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
        <option>Completed</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value)}
      >
        <option>All Categories</option>
        <option>Work</option>
        <option>Study</option>
        <option>Personal</option>
        <option>Fitness</option>
        <option>Shopping</option>
        <option>Other</option>
      </select>
    </div>
  );
}

export default SearchFilter;
