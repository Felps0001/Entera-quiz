import {questions,shuffle} from './questions.js';
const stage=document.querySelector('#stage'),screen=document.querySelector('#screen');
let index=0,score=0,locked=false,round=[];
function resize(){const scale=Math.min(innerWidth/1080,innerHeight/1920);stage.style.transform=`scale(${scale})`;document.querySelector('.viewport').style.width=`${1080*scale}px`;document.querySelector('.viewport').style.height=`${1920*scale}px`;}
addEventListener('resize',resize);resize();
function show(markup){screen.innerHTML=markup;screen.classList.remove('enter');void screen.offsetWidth;screen.classList.add('enter');screen.querySelector('h1,h2')?.focus({preventScroll:true});}
const arrow='<span aria-hidden="true">↗</span>';
function home(){locked=false;show(`<section class="home"><div class="eyebrow"><i></i> EXPERIÊNCIA INTERATIVA</div><div class="home-content"><h1 class="home-title" tabindex="-1"><span>VENHA TESTAR</span><span>SEUS</span><em>CONHECIMENTOS</em></h1><button class="primary" id="start">Começar experiência ${arrow}</button></div></section>`);screen.querySelector('#start').onclick=start;}
function start(){index=0;score=0;round=shuffle(questions).slice(0,3).map(q=>({...q,options:shuffle(q.answers.map((text,id)=>({text,id})))}));question();}
function progress(){return `<div class="progress-meta"><span>EXPLORE SEU CONHECIMENTO</span><span>${String(index+1).padStart(2,'0')} / ${String(round.length).padStart(2,'0')}</span></div><div class="progress">${round.map((_,i)=>`<i class="${i<=index?'active':''}"></i>`).join('')}</div>`;}
function question(){locked=false;const q=round[index];show(`<section class="question">${progress()}<div class="question-body"><h2 tabindex="-1">${q.text}</h2><p class="instruction">Toque na sua resposta.</p><div class="answers">${q.options.map((a,i)=>`<button class="answer" data-id="${a.id}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${a.text}</span><span class="answer-arrow">↗</span></button>`).join('')}</div></div></section>`);screen.querySelectorAll('.answer').forEach(b=>b.onclick=()=>answer(Number(b.dataset.id)));}
function answer(id){if(locked)return;locked=true;const q=round[index],correct=id===q.correct;if(correct)score++;feedback(correct,q);}
function feedback(correct,q){show(`<section class="feedback">${progress()}<div class="feedback-body"><div class="status-icon ${correct?'':'incorrect'}" aria-hidden="true">${correct?'✓':'×'}</div><span class="eyebrow">${correct?'ESCOLHA INTELIGENTE':'CONHECIMENTO EM CONSTRUÇÃO'}</span><h2 tabindex="-1">${correct?'Você acertou.':'Não foi dessa vez.'}</h2><p class="feedback-label">${correct?'É isso mesmo:':'A resposta certa é:'}</p><p class="correct-answer">${q.answers[q.correct]}</p><div class="rule"></div><p class="feedback-note">${correct?'Ciência e conhecimento fazem<br>parte de uma boa escolha.':'Cada descoberta é um passo<br>para aprender mais.'}</p></div><button class="primary" id="next">${index===round.length-1?'Ver meu resultado':'Continuar'} ${arrow}</button></section>`);screen.querySelector('#next').onclick=()=>{index++;index<round.length?question():finish();};}
function finish(){show(`<section class="result"><span class="eyebrow">EXPERIÊNCIA CONCLUÍDA</span><h2 tabindex="-1">UM NOVO<br>OLHAR.<br><em>MAIS CRITÉRIO.</em></h2><div class="score-circle"><div><strong>${score.toString().padStart(2,'0')}</strong><span>DE ${String(round.length).padStart(2,'0')} ACERTOS</span></div></div><p class="result-title">${score===round.length?'Você acertou todas!':score>=Math.ceil(round.length/2)?'Conhecimento que transforma.':'Toda descoberta é um começo.'}</p><p class="description">Mais do que tendências, escolhas sustentadas<br>por ciência, prática e resultado.</p><button class="primary" id="end">Finalizar experiência ${arrow}</button><p class="hint">OBRIGADO POR EXPLORAR O UNIVERSO ENTERA.</p></section>`);screen.querySelector('#end').onclick=home;}
home();

// Operator shortcut, available only inside the Windows application.
const exitButton = document.querySelector('#app-exit');
if (window.chrome?.webview) {
 exitButton.hidden = false;
 let exitTimer;
 let activePointer = null;
 const cancelExit = () => { clearTimeout(exitTimer); activePointer = null; };
 exitButton.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  cancelExit();
  event.preventDefault();
  activePointer = event.pointerId;
  exitButton.setPointerCapture(event.pointerId);
  exitTimer = setTimeout(() => {
   activePointer = null;
   window.chrome.webview.postMessage('close-app');
  }, 3000);
 });
 exitButton.addEventListener('pointermove', event => {
  if (event.pointerId !== activePointer) return;
  const rect = exitButton.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) cancelExit();
 });
 for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) exitButton.addEventListener(event, cancelExit);
 exitButton.addEventListener('contextmenu', event => event.preventDefault());
 window.addEventListener('blur', cancelExit);
 document.addEventListener('visibilitychange', cancelExit);
}
