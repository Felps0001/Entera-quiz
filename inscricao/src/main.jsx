import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return <div className="page">
    <div className="backdrop" aria-hidden="true"><div className="ribbon ribbon-one"/><div className="ribbon ribbon-two"/></div>
    <main>
      <section className="form-panel closed-panel" aria-labelledby="closed-title">
        <img className="logo" src="/assets/entera.png" alt="Entera"/>
        <h1 id="closed-title">Inscrições finalizadas!</h1>
      </section>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
