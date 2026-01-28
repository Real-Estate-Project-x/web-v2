type PaginationProps = {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
};

export function DynamicPagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: PaginationProps) {
  return (
    <div
      className="pagination"
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <button
        disabled={!hasPrevious}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              fontWeight: page === currentPage ? "bold" : "normal",
              backgroundColor: page === currentPage ? "#ddd" : "#fff",
            }}
          >
            {page}
          </button>
        );
      })}

      <button disabled={!hasNext} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </div>
  );
}
