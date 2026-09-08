interface SearchFilterProps {
  search: string;
  filter: string;
  categoryFilter: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

function SearchFilter({
  search,
  filter,
  categoryFilter,
  sort,
  onSearchChange,
  onFilterChange,
  onCategoryFilterChange,
  onSortChange,
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
        <option>Urgent</option>
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

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        <option value="newest">Sort: Newest First</option>
        <option value="oldest">Sort: Oldest First</option>
        <option value="due-soon">Sort: Due Soonest</option>
        <option value="priority">Sort: Highest Priority</option>
        <option value="title-asc">Sort: Title A-Z</option>
      </select>
    </div>
  );
}

export default SearchFilter;
