import "../styles/pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = Math.min(totalPages - 1, maxVisible - 2);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - (maxVisible - 2));
    }

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Prev
      </button>

      <div className="pagination-pages">
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-btn ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
