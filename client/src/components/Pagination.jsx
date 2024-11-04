import css from "./Pagination.module.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationPages = () => {
    const pages = [];
    const totalVisiblePages = 5;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(totalVisiblePages / 2)
    );
    let endPage = startPage + totalVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - totalVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPaginationPages();

  return (
    <div className={css.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
