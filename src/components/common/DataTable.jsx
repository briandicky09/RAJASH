import React, { useState, useMemo, useEffect } from 'react';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

/**
 * DataTable - Komponen tabel responsif:
 * - Pada Desktop & Tablet: Tabel terstruktur dengan angka tabular
 * - Pada Mobile (<768px): Mendukung card list adaptif (jika renderMobileCard diberikan)
 *   serta horizontal scroll terkontrol agar tidak ada konten yang terpotong
 */
export default function DataTable({
  columns = [],
  data = [],
  keyExtractor = (row, idx) => row.id || idx,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  pageSize = 8,
  renderMobileCard
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div>
      {/* Tampilan Mobile Card List khusus smartphone apabila renderMobileCard disediakan */}
      {renderMobileCard && (
        <div className="d-md-none d-flex flex-column gap-2 p-3">
          {paginatedData.map((row, idx) => (
            <div
              key={keyExtractor(row, idx)}
              className="p-3"
              style={{
                backgroundColor: 'var(--rj-white)',
                border: '1px solid var(--rj-border)',
                borderRadius: '10px'
              }}
            >
              {renderMobileCard(row)}
            </div>
          ))}
        </div>
      )}

      {/* Tampilan Tabel untuk Desktop/Tablet (atau semua layar jika tidak ada renderMobileCard) */}
      <div className={renderMobileCard ? 'd-none d-md-block rj-table-wrapper' : 'rj-table-wrapper'}>
        <table className="rj-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: col.align || 'left',
                    width: col.width || 'auto'
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={keyExtractor(row, idx)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    data-numeric={col.isNumeric ? 'true' : undefined}
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

