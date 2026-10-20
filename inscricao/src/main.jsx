import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const states = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
const initial = { nome: '', crm: '', celular: '', estado: '', especialidade: '' };
const api = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');
function phone(value) {
  const n = value.replace(/\D/g, '').slice(0, 11);
  if (n.length < 3) return n;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}${n.length > 7 ? '-' + n.slice(7) : ''}`;
}
function App() {
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const success = useRef(null);
  function change(e) {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: name === 'celular' ? phone(value) : name === 'crm' ? value.replace(/\D/g, '').slice(0, 8) : value }));
    setError('');
  }
  async function submit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending'); setError('');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`${api}/api/inscricoes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: controller.signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Não foi possível concluir sua inscrição. Tente novamente.');
      setStatus('success');
      setTimeout(() => success.current?.focus(), 0);
    } catch (err) {
      setStatus('idle');
      setError(err.name === 'AbortError' ? 'O envio demorou mais que o esperado. Tente novamente em instantes.' : err instanceof TypeError ? 'Não foi possível conectar. Confira sua conexão e tente novamente.' : err.message);
    } finally { clearTimeout(timer); }
  }
  return <div className="page">
    <div className="backdrop" aria-hidden="true"><div className="ribbon ribbon-one"/><div className="ribbon ribbon-two"/></div>
    <main>
      <section className="form-panel" aria-labelledby={status === 'success' ? 'success-title' : 'form-title'}>
        <img className="logo" src="/assets/entera.png" alt="Entera"/>
        {status === 'success' ? <div className="success"><span className="check">✓</span><span className="eyebrow">TUDO CERTO</span><h2 id="success-title" ref={success} tabIndex={-1}>Inscrição realizada!</h2><p>Seus dados foram recebidos.<br/>Obrigado por fazer parte dessa experiência.</p></div> : <>
          <span className="eyebrow">SUA INSCRIÇÃO</span>
          <h2 id="form-title">Faça parte da experiência.</h2><p className="form-description">Preencha seus dados para se inscrever.</p>
          <form onSubmit={submit}>
            <fieldset disabled={status === 'sending'}>
              <label htmlFor="nome">Nome completo<input id="nome" name="nome" autoComplete="name" placeholder="Como podemos chamar você?" value={data.nome} onChange={change} required minLength={3} maxLength={120}/></label>
              <div className="field-row"><label htmlFor="crm">CRM<input id="crm" name="crm" inputMode="numeric" placeholder="Número do CRM" value={data.crm} onChange={change} required pattern="[0-9]{1,8}" maxLength={8}/></label><label htmlFor="estado">Estado do CRM<select id="estado" name="estado" value={data.estado} onChange={change} required><option value="" disabled>Selecione a UF</option>{states.map(uf => <option key={uf}>{uf}</option>)}</select></label></div>
              <label htmlFor="celular">Celular<input id="celular" name="celular" type="tel" autoComplete="tel-national" placeholder="(11) 99999-9999" value={data.celular} onChange={change} required pattern="\([1-9][0-9]\) 9[0-9]{4}-[0-9]{4}" title="Informe um celular com DDD e 9 dígitos." maxLength={15}/></label>
              <label htmlFor="especialidade">Especialidade<input id="especialidade" name="especialidade" placeholder="Informe sua especialidade" value={data.especialidade} onChange={change} required minLength={2} maxLength={100} list="especialidades"/><datalist id="especialidades"><option>Dermatologia</option><option>Cirurgia plástica</option><option>Clínica médica</option><option>Medicina de família e comunidade</option></datalist></label>
              <p className="required-note">Todos os campos são obrigatórios.</p>
              {error && <p className="error" role="alert">{error}</p>}
              <button className="submit" type="submit" aria-busy={status === 'sending'}><span>{status === 'sending' ? 'Enviando inscrição…' : 'Confirmar inscrição'}</span><span aria-hidden="true">↗</span></button>
            </fieldset>
          </form>
        </>}
      </section>
    </main>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
