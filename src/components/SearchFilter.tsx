interface SearchFilterProps {
  search: string;
  filter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

function SearchFilter({
  search,
  filter,
  onSearchChange,
  onFilterChange,
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
    </div>
  );
}

export default SearchFilter;
