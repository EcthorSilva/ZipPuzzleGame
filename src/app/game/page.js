'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import game from '../components/gameLogic';
import HowToPlayAccordion from '../components/HowToPlayAccordion';

export default function GamePage() {
  useEffect(() => {
    game();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="py-3 mb-0 border-bottom-0">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link href="/welcome" className="btn btn-outline-secondary border-0" id="back-btn">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <div className="text-center flex-grow-1 visually-hidden">
            <div className="p-2 bg-body-secondary rounded-3 d-inline-block">
              <span className="mb-0">N/A</span>
            </div>
          </div>
          <button className="btn btn-outline-secondary border-0" type="button" id="dropdownMenuButton1">
            <i className="bi bi-gear"></i>
          </button>
        </div>
      </header>

      <main className="flex-fill d-flex justify-content-center">
        <div className="container " style={{ maxWidth: '400px', height: '100dvh' }}>
          {/* Top Info */}
          <div className="container">
            <div className="row mb-4 align-items-center justify-content-around">
              <div className="col-3 text-center p-2 bg-body-secondary rounded-3">
                <i className="bi bi-stopwatch"></i>&nbsp;<span id="timerDisplay" className="text-body">00:00</span>
              </div>
              <div className="col-6">
                <div className="text-center p-2 bg-body-secondary rounded-3">
                  <span id="lvlDifficulty" className="text-center mb-0">Dificuldade: n/a</span>
                </div>
              </div>
              <div className="col-3 p-2 text-center">
                <button id="clear-btn-modal" type="button" className="btn btn-secondary rounded-2 px-3">Limpar</button>
              </div>
            </div>
          </div>
          {/* Game Grid */}
          <div className="container text-center">
            <div className="d-grid border rounded p-1 mb-2 bg-body mx-auto" style={{ gridTemplateColumns: 'repeat(6, 1fr)', maxWidth: '100%', width: '100%', }}>
            {/* <div className="d-grid border rounded p-1 mb-2 bg-body" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }} > */}
              {[...Array(6)].map((_, row) =>
                [...Array(6)].map((_, col) => (
                  <div
                    key={`${row},${col}`}
                    className="border position-relative cell text-white"
                    data-pos={`${row},${col}`}
                    style={{ paddingTop: '100%' }}
                  ></div>
                ))
              )}
            </div>
          </div>

          {/* Game Options */}
          <div className="container border-1 rounded-3 mt-4 p-2 bg-body-secondary text-bod">
            <div className="row">
              <div className="col text-start">
                <button id="reload-btn" type="button" className="btn btn-secondary rounded">
                  <i className="bi bi-arrow-repeat"></i> Recarregar
                </button>
              </div>
              <div className="col text-end">
                <button id="undo-btn" type="button" className="btn btn-secondary rounded">
                  <i className="bi bi-arrow-clockwise"></i> Desfazer
                </button>
              </div>
            </div>
          </div>

          {/* Como Jogar */}
          <HowToPlayAccordion />
          
          {/* Game Over Modal */}
          <div className="modal fade" id="game-over-modal" tabIndex="-1" aria-labelledby="game-over-modal-label" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <p>Congratulations! You have completed the game.</p>
                  <p>Time: <span id="game-time">00:00</span></p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                  <button type="button" className="btn btn-primary" id="play-again-btn">Jogar novamente</button>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Game Modal */}
          <div className="modal fade" id="clear-game-modal" tabIndex="-1" aria-labelledby="cleargamemodal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">Limpar o jogo</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body d-flex">
                  <p className="pm-0">Tem certeza que deseja limpar o jogo?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button id="clear-btn" type="button" className="btn btn-primary">Limpar</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}