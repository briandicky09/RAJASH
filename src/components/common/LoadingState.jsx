import React from 'react';

/**
 * LoadingState - Skeleton loader terstruktur sesuai bentuk halaman/tabel (bukan spinner generik)
 */
export default function LoadingState({ rows = 4, showCards = false }) {
  return (
    <div aria-busy="true" aria-label="Memuat data">
      {showCards && (
        <div className="row g-3 mb-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="col-12 col-sm-6 col-xl-3">
              <div className="rj-card p-4">
                <div className="rj-skeleton mb-3" style={{ width: '55%', height: '14px' }} />
                <div className="rj-skeleton mb-2" style={{ width: '80%', height: '28px' }} />
                <div className="rj-skeleton" style={{ width: '45%', height: '12px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rj-card p-3 p-md-4">
        <div className="d-flex flex-column gap-3">
          {Array.from({ length: rows }).map((_, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center justify-content-between gap-3 py-2"
              style={{
                borderBottom: idx < rows - 1 ? '1px solid var(--rj-border-subtle)' : 'none'
              }}
            >
              <div className="rj-skeleton" style={{ width: '20%', height: '16px' }} />
              <div className="rj-skeleton" style={{ width: '40%', height: '16px' }} />
              <div className="rj-skeleton" style={{ width: '18%', height: '16px' }} />
              <div className="rj-skeleton" style={{ width: '12%', height: '22px', borderRadius: '999px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

