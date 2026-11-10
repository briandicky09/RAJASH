import React, { useState } from 'react';
import { Sparkle, ArrowClockwise, TrendUp, Info, ShieldCheck } from '@phosphor-icons/react';
import { formatRupiah } from '../../utils/formatters';

/**
 * AIInsightCard - Modul Kecerdasan Buatan (SRS Section 4.12: FR-AIE-04, FR-AIE-05, FR-AIE-07, FR-AIE-08)
 * - Proyeksi model prediksi harian (FastAPI/Flask service)
 * - Ringkasan otomatis Generative AI (Gemini / LLM API)
 * - Label eksplisit sebagai estimasi bantuan analisis (FR-AIE-08)
 * - Graceful degradation: jika AI mati, sistem pembukuan inti tetap berjalan (FR-AIE-07)
 */
export default function AIInsightCard({ insightData, onRefresh, isLoading = false }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
  };

  const forecast = insightData?.forecast || {
    target: 'Proyeksi Pemasukan Harian Besok',
    predicted_amount: 260000,
    confidence_score: '88%',
    model_name: 'FastAPI AI Service'
  };

  return (
    <div
      className="rj-card p-3 p-md-4"
      style={{
        borderColor: 'var(--rj-primary-border)',
        backgroundColor: 'var(--rj-white)'
      }}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--rj-primary-subtle)',
              color: 'var(--rj-primary)'
            }}
          >
            <Sparkle size={18} weight="fill" />
          </span>
          <div>
            <h3 className="mb-0" style={{ fontSize: '0.975rem', fontWeight: 600 }}>
              Insight Keuangan & Proyeksi AI (Asah 2026)
            </h3>
            <p className="mb-0 mt-0" style={{ fontSize: '0.78rem', color: 'var(--rj-text-secondary)' }}>
              Analisis otomatis berbasis model prediksi & Generative AI tim Next-Gen AI Engineer.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || isGenerating}
          className="btn-rj-secondary py-1 px-3"
          style={{ fontSize: '0.78rem' }}
        >
          <ArrowClockwise
            size={14}
            className={isLoading || isGenerating ? 'spin-animation' : ''}
          />
          <span>{isGenerating ? 'Menghasilkan...' : 'Perbarui Insight AI'}</span>
        </button>
      </div>

      <div className="row g-3">
        {/* Kolom 1: Kartu Proyeksi Model Prediksi (FR-AIE-04) */}
        <div className="col-12 col-md-5">
          <div
            className="p-3 h-100 d-flex flex-column justify-content-between"
            style={{
              backgroundColor: 'var(--rj-bg)',
              border: '1px solid var(--rj-border)',
              borderRadius: '10px'
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--rj-text-secondary)'
                  }}
                >
                  {forecast.target}
                </span>
                <span className="rj-badge rj-badge-info" style={{ fontSize: '0.7rem' }}>
                  <TrendUp size={12} weight="bold" />
                  <span>Skor: {forecast.confidence_score}</span>
                </span>
              </div>
              <div
                className="font-tabular fw-bold"
                style={{ fontSize: '1.45rem', color: 'var(--rj-text-primary)' }}
              >
                {formatRupiah(forecast.predicted_amount)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rj-text-secondary)' }}>
                Estimasi kuantitas: ±40-45 galon air isi ulang
              </div>
            </div>

            <div
              className="mt-3 pt-2"
              style={{
                borderTop: '1px solid var(--rj-border-subtle)',
                fontSize: '0.72rem',
                color: 'var(--rj-text-secondary)'
              }}
            >
              Model: <code className="text-dark">{forecast.model_name}</code>
            </div>
          </div>
        </div>

        {/* Kolom 2: Ringkasan Insight Generative AI (FR-AIE-05) */}
        <div className="col-12 col-md-7">
          <div
            className="p-3 h-100 d-flex flex-column justify-content-between"
            style={{
              backgroundColor: 'var(--rj-bg)',
              border: '1px solid var(--rj-border)',
              borderRadius: '10px'
            }}
          >
            <div>
              <div className="fw-semibold mb-1" style={{ fontSize: '0.825rem', color: 'var(--rj-text-primary)' }}>
                Ringkasan Insight Keuangan:
              </div>
              <p
                className="mb-2"
                style={{ fontSize: '0.8125rem', color: 'var(--rj-text-secondary)', lineHeight: 1.5 }}
              >
                {insightData?.summary_text}
              </p>
            </div>

            {/* Disclaimer Resmi Sesuai SRS FR-AIE-08 */}
            <div
              className="d-flex align-items-center gap-1 pt-2"
              style={{
                borderTop: '1px solid var(--rj-border-subtle)',
                fontSize: '0.72rem',
                color: 'var(--rj-text-secondary)'
              }}
            >
              <Info size={14} weight="fill" style={{ color: 'var(--rj-primary)', flexShrink: 0 }} />
              <span>
                <strong>Catatan Kepatuhan:</strong> Hasil AI merupakan estimasi bantuan analisis,
                bukan angka pembukuan resmi.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

