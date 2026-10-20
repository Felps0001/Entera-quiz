export const questions = [
 {text:'Para quem as tecnologias do portfólio Entera são comercializadas?',answers:['Profissionais médicos','Diretamente ao paciente','Qualquer profissional da estética'],correct:0},
 {text:'Verdadeiro ou falso: estar em alta é suficiente para definir uma boa tecnologia.',answers:['Verdadeiro','Falso'],correct:1},
 {text:'Além de tecnologia, o ecossistema Entera também envolve:',answers:['Educação e atualização','Apenas manutenção','Apenas venda de equipamentos'],correct:0},
 {text:'Quando uma tecnologia está em alta, o que deveria sustentar a escolha?',answers:['Popularidade','Número de posts','Ciência, prática, negócio e critério'],correct:2},
 {text:'O DuoTera foi pensado para tratar a face a partir de quê?',answers:['Um único ponto de aplicação','Diferentes camadas e necessidades','Apenas a superfície da pele'],correct:1},
 {text:'O hype coloca uma tecnologia no radar. O que deve mantê-la na prática?',answers:['Tendência','Influência','Evidência e resultado'],correct:2}
];
export function shuffle(items, random = Math.random) {
 const result = [...items];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
}
