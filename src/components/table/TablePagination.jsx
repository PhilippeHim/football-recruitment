import { PAGE_SIZE } from '../../constante/table.js';
import { formatCount } from '../../utils/formatNumber.js';

export default function TablePagination({
  currentPage,
  pageCount,
  totalCount,
  onPageChange,
}) {
  const start = currentPage * PAGE_SIZE + 1;
  const end = Math.min((currentPage + 1) * PAGE_SIZE, totalCount);
  return (
    <div className="pagination">
      <span>
        {start}–{end} sur {formatCount(totalCount)}
      </span>
      <div>
        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ← Précédent
        </button>
        <span>
          {currentPage + 1} / {pageCount}
        </span>
        <button
          disabled={currentPage === pageCount - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
