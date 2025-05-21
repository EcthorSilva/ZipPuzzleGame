'use client';

import { useState } from 'react';

export default function HowToPlayAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion mt-4" id="howToPlayAccordion">
      <div className="accordion-item bg-body-secondary border-0">
        <h2 className="accordion-header" id="headingInstructions">
          <button
            className={`accordion-button bg-body-secondary ${!isOpen ? 'collapsed' : ''}`}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="collapseInstructions"
          >
            Como Jogar
          </button>
        </h2>
        <div
          id="collapseInstructions"
          className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
          aria-labelledby="headingInstructions"
        >
          <div className="accordion-body mb-4">
            <div className="row g-3">
              <div className="col-12 d-flex align-items-center bg-body p-3 rounded">
                <i className="bi bi-1-circle me-3 fs-3"></i>
                <div>
                  <strong>Comece no número 1</strong><br />
                  Toque para iniciar o caminho.
                </div>
              </div>
              <div className="col-12 d-flex align-items-center bg-body p-3 rounded">
                <i className="bi bi-arrow-right me-3 fs-3"></i>
                <div>
                  <strong>Conecte os números</strong><br />
                  Arraste até o próximo número em ordem.
                </div>
              </div>
              <div className="col-12 d-flex align-items-center bg-body p-3 rounded">
                <i className="bi bi-grid-3x3-gap-fill me-3 fs-3"></i>
                <div>
                  <strong>Preencha o tabuleiro</strong><br />
                  Passe por todas as células, sem deixar nenhuma vazia.
                </div>
              </div>
              <div className="col-12 d-flex align-items-center bg-body p-3 rounded">
                <i className="bi bi-arrow-counterclockwise me-3 fs-3"></i>
                <div>
                  <strong>Errou?</strong><br />
                  Toque na célula anterior para desfazer o último passo.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
