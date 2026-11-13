import React from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react';

/**
 * DateFilter - Komponen filter rentang tanggal atau periode
 */
export default function DateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset
}) {
  const hasFilter = Boolean(startDate || endDate);

  return (
    <div className="d-flex flex-wrap align-items-end gap-2">
      <div style={{ flex: '1 1 135px', minWidth: 0 }}>
        <label
          htmlFor="filter-start-date"
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--rj-text-secondary)',
            marginBottom: '4px'
          }}
        >
          Dari Tanggal
        </label>
        <input
          id="filter-start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="rj-form-control"
          style={{ fontSize: '0.85rem' }}
        />
      </div>

      <div style={{ flex: '1 1 135px', minWidth: 0 }}>
        <label
          htmlFor="filter-end-date"
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--rj-text-secondary)',
            marginBottom: '4px'
          }}
        >
          Sampai Tanggal
        </label>
        <input
          id="filter-end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="rj-form-control"
          style={{ fontSize: '0.85rem' }}
        />
      </div>

      {hasFilter && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="btn-rj-secondary"
          style={{ padding: '0.5rem 0.85rem', fontSize: '0.8125rem' }}
        >
          <ArrowCounterClockwise size={15} />
          <span>Reset Tanggal</span>
        </button>
      )}
    </div>
  );
}

