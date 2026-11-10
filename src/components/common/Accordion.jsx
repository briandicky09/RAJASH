import React, { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';

/**
 * Accordion - Recreated from Workleap Officevibe's .faq_accordion & .faq_question
 */
export default function Accordion({ items = [], defaultOpenIndex = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const contentId = `wl-faq-panel-${idx}`;
        const triggerId = `wl-faq-trigger-${idx}`;

        return (
          <div key={item.question} className="wl-faq-item">
            <h4 className="mb-0">
              <button
                id={triggerId}
                type="button"
                className="wl-faq-question"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => handleToggle(idx)}
              >
                <span>{item.question}</span>
                <span
                  className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '28px',
                    height: '28px',
                    color: isOpen ? 'var(--wl-brand-100)' : 'var(--wl-grey-100)',
                    transition: 'transform 220ms var(--wl-ease), color 180ms ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  <CaretDown size={20} weight="regular" />
                </span>
              </button>
            </h4>
            {isOpen && (
              <div
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                className="wl-faq-answer"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
