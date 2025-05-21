'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="d-flex flex-column " style={{ height: '100dvh' }}>
      <header className="py-3 mb-3 border-bottom-0">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          &nbsp;
          <div className="text-center flex-grow-1 visually-hidden">
            <div className="p-2 bg-body-secondary rounded-3 d-inline-block">
              <span id="lvlDifficulty" className="mb-0">Dificuldade: Difícil</span>
            </div>
          </div>
          <button className="btn btn-outline-secondary border-0" type="button" id="dropdownMenuButton1">
            <i className="bi bi-gear"></i>
          </button>
        </div>
      </header>
      <main className="flex-fill d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Image src="/images/logo.png" alt="Logo do Zip!" priority={true} width={84} height={84} />
          <h1 className="mb-4">Zip!</h1>
          <p>a simple path-drawing game</p>
          <div className="d-grid gap-2 pt-4">
            <Link href="/game" className="btn btn-primary">Jogar</Link>
          </div>
        </div>
      </main>
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4 border-top">
        <div className="container">
          <div className="d-flex justify-content-between">
            <div className="col-md-4 d-flex align-items-center">
              <span className="mb-3 mb-md-0 text-body-secondary d-none">© 2025 Zip! Puzzle Game</span>
            </div>
            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
              <li className="ms-3">
                <a className="text-body-secondary" href="https://github.com/EcthorSilva" aria-label="Github">
                  <i className="bi bi-github"></i>
                </a>
              </li>
              <li className="ms-3">
                <a className="text-body-secondary" href="https://www.linkedin.com/in/ecthor-nunes-b7b5b61a5/" aria-label="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
