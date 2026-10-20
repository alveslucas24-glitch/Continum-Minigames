(() => {
'use strict';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORE='continum-game-v1', PDF_DB='continum-game-files';
const coverColors=['#6f463b','#425b64','#59664a','#74494e','#a36d3d','#475477','#765f87','#3f6659','#9a583f','#4d5264'];
const demoTexts=[
['Naquela manhã, Lia encontrou uma chave pequena entre as páginas de um livro antigo. O metal tinha o desenho de uma estrela e estava frio como água de inverno.','A chave abriu uma porta que não aparecia na parede no dia anterior. Do outro lado, havia um jardim silencioso e um bilhete: “Toda história começa quando alguém presta atenção”.','Lia guardou o bilhete no bolso. Antes de voltar, ouviu um sino distante e viu uma luz acender no alto da torre. A aventura tinha acabado de começar.'],
['O trem partiu às seis, levando poucas malas e muitas perguntas. Miguel escolheu o assento junto à janela para acompanhar as montanhas.','Na estação seguinte, uma senhora deixou cair um caderno azul. Miguel correu para devolvê-lo. Na capa, havia uma lista de lugares que ainda não existiam no mapa.','A senhora sorriu como quem reconhece um segredo. “Você encontrou o caminho”, disse. Então o trem tomou uma estrada que não estava nos trilhos.'],
['A biblioteca da cidade fechava sempre ao pôr do sol, mas naquela terça-feira uma janela continuava iluminada. Clara entrou para devolver um livro de capa verde.','Sobre a mesa havia um mapa, um lápis e uma xícara de chá ainda quente. O mapa mostrava a biblioteca vista de cima e marcava uma sala escondida atrás da estante de poesia.','Uma fileira de livros se moveu devagar. Clara respirou fundo e seguiu a luz dourada que vinha do corredor novo.'],
['Quando o mar recuou, deixou na areia uma garrafa transparente. Dentro dela, um papel dobrado trazia somente duas palavras: “olhe longe”.','Ravi subiu ao farol antes da chuva. Do alto, avistou um barco parado e três sinais de luz. Pegou o velho binóculo do avô e tentou decifrar a mensagem.','As luzes piscavam em ritmo constante. Ravi respondeu com o lampião do farol. Ao amanhecer, o barco estava mais perto e uma bandeira amarela tremulava no mastro.'],
['A cidade inteira dormia quando as estrelas começaram a mudar de lugar. Nara anotou cada movimento no caderno que carregava desde criança.','No observatório, ela encontrou um telescópio coberto por um pano bordado. Ao retirar o tecido, viu que as lentes refletiam não o céu, mas uma paisagem desconhecida.','Nara escreveu a data na primeira página livre. A constelação nova parecia formar uma seta apontando para além do horizonte.'],
['Às 00h17, o elevador antigo parou num andar que não existia no painel. A porta se abriu para um corredor coberto de retratos virados para a parede.','Mara apertou o botão do térreo. O elevador não se moveu. Atrás de uma moldura, ouviu três batidas — e uma voz respondeu do outro lado: “Você demorou”.','Quando a porta finalmente fechou, o relógio marcava 00h17 outra vez. No espelho do elevador, havia um retrato novo: o dela, olhando para trás.'],
['O arquivo municipal estava fechado havia anos, mas alguém deixava uma lâmpada acesa no último corredor. Theo voltou para conferir o livro de registros que encontrara na praça.','As páginas listavam nomes e datas futuras. A última linha trazia seu nome e o horário exato. O telefone vibrou: uma mensagem sem remetente dizia “não olhe para a janela”.','Do lado de fora, a rua estava vazia. Theo fechou o livro. No vidro escuro, porém, uma silhueta continuava lendo por cima do seu ombro.'],
['A neblina cobriu a estação enquanto o último trem atrasava. Na plataforma, Lia encontrou um bilhete dobrado sob o banco: “Não embarque no vagão sem janelas”.','As luzes piscaram. O trem chegou em silêncio, e uma porta se abriu no segundo vagão. Lá dentro, todos os assentos estavam vazios — exceto um, onde o bilhete já estava aberto.','O apito soou atrás dela. Lia se virou para o relógio: os ponteiros andavam para trás. Quando olhou de novo, o vagão sem janelas estava esperando.']
];
const starterBooks=[
{id:'b01',title:'A Chave das Estrelas',author:'Lia Monteiro',genre:'Fantasia',pages:3,reads:124,rating:4.8,desc:'Uma chave antiga abre um jardim que não aparecia nos mapas.',textIndex:0,rec:82,tags:['aventura','mistério']},
{id:'b02',title:'O Trem das Seis',author:'Miguel Arantes',genre:'Ficção científica',pages:3,reads:98,rating:4.7,desc:'Uma viagem ferroviária por lugares que não existem no mapa.',textIndex:1,rec:76,tags:['viagem','fantasia']},
{id:'b03',title:'A Biblioteca Secreta',author:'Clara Nogueira',genre:'Mistério',pages:3,reads:214,rating:4.9,desc:'Uma sala escondida guarda o início de uma história inesperada.',textIndex:2,rec:93,tags:['biblioteca','enigma']},
{id:'b04',title:'Luzes do Farol',author:'Ravi Costa',genre:'Aventura',pages:3,reads:65,rating:4.5,desc:'Sinais misteriosos surgem no horizonte durante uma noite de maré baixa.',textIndex:3,rec:68,tags:['mar','aventura']},
{id:'b05',title:'O Mapa do Céu',author:'Nara Valença',genre:'Ficção científica',pages:3,reads:145,rating:4.8,desc:'Uma nova constelação aponta para um lugar fora do mundo conhecido.',textIndex:4,rec:88,tags:['estrelas','espaço']},
{id:'b06',title:'Cartas para o Outono',author:'Helena Duarte',genre:'Romance',pages:3,reads:118,rating:4.6,desc:'Duas pessoas deixam cartas dentro de livros emprestados.',textIndex:1,rec:73,tags:['cartas','encontros']},
{id:'b07',title:'O Relógio de Areia',author:'Caio Menezes',genre:'Fantasia',pages:3,reads:101,rating:4.4,desc:'Um relojoeiro descobre que cada grão guarda uma lembrança.',textIndex:0,rec:66,tags:['tempo','magia']},
{id:'b08',title:'A Casa da Colina',author:'Beatriz Aragão',genre:'Mistério',pages:3,reads:81,rating:4.3,desc:'Uma casa vazia acende suas janelas todas as noites.',textIndex:2,rec:62,tags:['casa','segredos']},
{id:'b09',title:'Jardim de Palavras',author:'Iara Lemos',genre:'Poesia',pages:3,reads:175,rating:4.9,desc:'Poemas breves para cultivar calma e curiosidade.',textIndex:3,rec:91,tags:['poesia','natureza']},
{id:'b10',title:'A Cidade Submersa',author:'Otávio Lins',genre:'Aventura',pages:3,reads:136,rating:4.6,desc:'Uma equipe procura uma cidade escondida sob as águas.',textIndex:4,rec:79,tags:['exploração','mar']},
{id:'b11',title:'Manual das Pequenas Coragens',author:'Nina Falcão',genre:'Ensaio',pages:3,reads:159,rating:4.8,desc:'Reflexões sobre curiosidade, mudança e coragem cotidiana.',textIndex:1,rec:87,tags:['reflexão','vida']},
{id:'b12',title:'O Último Pássaro Azul',author:'Tomás Reis',genre:'Fantasia',pages:3,reads:72,rating:4.5,desc:'Uma viagem para encontrar uma ave que conhece todos os caminhos.',textIndex:0,rec:71,tags:['natureza','jornada']},
{id:'b13',title:'Arquivo Aurora',author:'Luna Barros',genre:'Ficção científica',pages:3,reads:94,rating:4.6,desc:'Mensagens de uma estação orbital chegam muitos anos atrasadas.',textIndex:4,rec:78,tags:['espaço','futuro']},
{id:'b14',title:'O Retrato sem Rosto',author:'Davi Reis',genre:'Mistério',pages:3,reads:164,rating:4.8,desc:'Um quadro muda um pequeno detalhe a cada madrugada.',textIndex:2,rec:90,tags:['arte','investigação']},
{id:'b15',title:'Maré de Papel',author:'Sofia Alves',genre:'Romance',pages:3,reads:77,rating:4.4,desc:'Um sebo à beira-mar aproxima duas pessoas leitoras.',textIndex:3,rec:69,tags:['livros','mar']},
{id:'b16',title:'A Órbita de Íris',author:'Lara Pires',genre:'Ficção científica',pages:3,reads:89,rating:4.5,desc:'Uma cientista recebe um sinal vindo de um planeta impossível.',textIndex:4,rec:75,tags:['planetas','ciência']},
{id:'b17',title:'Pequeno Atlas das Nuvens',author:'Rosa Vidal',genre:'Poesia',pages:3,reads:112,rating:4.7,desc:'Versos para observar o céu com outros olhos.',textIndex:3,rec:81,tags:['céu','poesia']},
{id:'b18',title:'O Enigma da Rua do Sol',author:'Caio Menezes',genre:'Mistério',pages:3,reads:128,rating:4.7,desc:'Uma pista aparece na vitrine de uma loja fechada há décadas.',textIndex:2,rec:84,tags:['cidade','pistas']},
{id:'b19',title:'A Ponte das Duas Luas',author:'Iara Lemos',genre:'Fantasia',pages:3,reads:55,rating:4.2,desc:'Em duas luas, uma ponte invisível liga reinos distantes.',textIndex:0,rec:54,tags:['reinos','aventura'],unlock:1},
{id:'b20',title:'O Jardim de Cristal',author:'Nina Falcão',genre:'Fantasia',pages:3,reads:42,rating:4.3,desc:'Uma botânica encontra plantas que florescem com lembranças.',textIndex:2,rec:58,tags:['magia','natureza'],unlock:1},
{id:'b21',title:'Protocolo Horizonte',author:'Luna Barros',genre:'Ficção científica',pages:3,reads:38,rating:4.1,desc:'Uma missão espacial precisa escolher entre voltar ou continuar.',textIndex:4,rec:52,tags:['espaço','decisão'],unlock:1},
{id:'b22',title:'O Caso da Página Rasgada',author:'Davi Reis',genre:'Mistério',pages:3,reads:33,rating:4.0,desc:'Uma página desaparecida muda a investigação de um arquivo antigo.',textIndex:2,rec:49,tags:['enigma','arquivo'],unlock:1},
{id:'b23',title:'Canções para Depois da Chuva',author:'Helena Duarte',genre:'Romance',pages:3,reads:29,rating:4.1,desc:'Dois vizinhos começam a conversar por meio de bilhetes e música.',textIndex:3,rec:56,tags:['romance','música'],unlock:1},
{id:'b24',title:'A Biblioteca das Marés',author:'Rosa Vidal',genre:'Poesia',pages:3,reads:25,rating:4.2,desc:'Uma coleção de poemas que só pode ser lida quando a maré baixa.',textIndex:1,rec:61,tags:['poesia','mar'],unlock:1},
{id:'sp01',title:'O Andar que Não Existe',author:'Contos da Meia-Noite',genre:'Suspense',pages:3,reads:0,rating:4.8,desc:'Um elevador abre para um corredor que não aparece na planta do prédio. Conto original de suspense, em formato de amostra.',textIndex:5,rec:90,tags:['suspense','sobrenatural','amostra'],color:'#50334c'},
{id:'sp02',title:'O Arquivo das Horas',author:'Contos da Meia-Noite',genre:'Suspense',pages:3,reads:0,rating:4.7,desc:'Um registro municipal parece escrever acontecimentos antes de eles ocorrerem. Conto original de mistério, em formato de amostra.',textIndex:6,rec:86,tags:['mistério','arquivo','amostra'],color:'#3c4758'},
{id:'sp03',title:'O Último Vagão',author:'Contos da Meia-Noite',genre:'Terror',pages:3,reads:0,rating:4.6,desc:'Uma estação coberta pela neblina, um trem silencioso e um bilhete com um aviso estranho. Conto original, em formato de amostra.',textIndex:7,rec:84,tags:['terror','trem','amostra'],color:'#604033'}
];
const publicDomainBooks=[
{id:'pd-dom-casmurro',title:'Dom Casmurro',author:'Machado de Assis',genre:'Romance',pages:141,reads:0,rating:4.9,rec:98,desc:'Romance clássico sobre as memórias de Bento Santiago e sua relação com Capitu. Texto integral em edição digital de domínio público.',tags:['clássico','literatura brasileira'],pdfFile:'livros/dom-casmurro.pdf',hasPdf:true,color:'#6f3b42',source:'Project Gutenberg #55752'},
{id:'pd-memorias-postumas',title:'Memórias Póstumas de Brás Cubas',author:'Machado de Assis',genre:'Romance',pages:131,reads:0,rating:4.9,rec:96,desc:'Narrado por um autor-defunto, o romance de Machado de Assis observa com ironia a sociedade de seu tempo.',tags:['clássico','realismo'],pdfFile:'livros/memorias-postumas.pdf',hasPdf:true,color:'#5d4a3c',source:'Project Gutenberg #54829'},
{id:'pd-iracema',title:'Iracema',author:'José de Alencar',genre:'Romance',pages:74,reads:0,rating:4.7,rec:88,desc:'Romance indianista de José de Alencar, publicado originalmente em 1865.',tags:['clássico','romance brasileiro'],pdfFile:'livros/iracema.pdf',hasPdf:true,color:'#66754a',source:'Project Gutenberg #67740'},
{id:'pd-guarani-1',title:'O Guarani — Volume I',author:'José de Alencar',genre:'Aventura',pages:146,reads:0,rating:4.8,rec:90,desc:'Primeiro volume do romance de aventura ambientado no Brasil colonial.',tags:['clássico','aventura','volume 1'],pdfFile:'livros/o-guarani-vol-1.pdf',hasPdf:true,color:'#765b3e',source:'Project Gutenberg #67724'},
    {id:'pd-guarani-2',title:'O Guarani — Volume II',author:'José de Alencar',genre:'Aventura',pages:129,reads:0,rating:4.8,rec:89,desc:'Segundo volume de O Guarani, continuação da narrativa de Peri e Cecília.',tags:['clássico','aventura','volume 2'],pdfFile:'livros/o-guarani-vol-2.pdf',hasPdf:true,color:'#526248',source:'Project Gutenberg #67725'},
    {id:'pd-quincas-borba',title:'Quincas Borba',author:'Machado de Assis',genre:'Romance',pages:165,reads:0,rating:4.9,rec:95,desc:'Romance de Machado de Assis sobre Rubião, que herda uma fortuna e entra no mundo da sociedade carioca.',tags:['clássico','realismo','literatura brasileira'],pdfFile:'livros/quincas-borba.pdf',hasPdf:true,color:'#515d63',source:'Project Gutenberg #55682'},
    {id:'pd-o-atheneu',title:'O Atheneu (Crônica de saudades)',author:'Raul Pompéia',genre:'Romance',pages:129,reads:0,rating:4.8,rec:91,desc:'Romance de 1888 que acompanha Sérgio no internato Atheneu, num retrato crítico da sociedade brasileira.',tags:['clássico','romance brasileiro','formação'],pdfFile:'livros/o-atheneu.pdf',hasPdf:true,color:'#76506a',source:'Project Gutenberg #68541'},
    {id:'pd-o-cortico',title:'O Cortiço',author:'Aluísio Azevedo',genre:'Romance',pages:172,reads:0,rating:4.9,rec:97,desc:'Romance naturalista ambientado em um cortiço carioca do século XIX.',tags:['clássico','naturalismo','literatura brasileira'],pdfFile:'livros/o-cortico.pdf',hasPdf:true,color:'#8a503b',source:'Project Gutenberg #69187'},
    {id:'pd-queda-machado',title:'Quéda que as Mulheres Têm para os Tolos',author:'Victor Hénaux · tradução de Machado de Assis',genre:'Ensaio',pages:9,reads:0,rating:4.5,rec:78,desc:'Ensaio satírico em português na tradução atribuída a Machado de Assis, em edição digital do Project Gutenberg.',tags:['ensaio','tradução','Machado de Assis'],pdfFile:'livros/queda-que-as-mulheres-tem.pdf',hasPdf:true,color:'#805b39',source:'Project Gutenberg #59620'}
];
let state, books, activeFilter='Todos', activeReader=null, toastTimer;
const defaultState=()=>({totalLT:0,totalPages:0,completedBooks:[],progress:{},passes:0,favorites:[],streak:0,lastReadDay:null,readDays:{},name:'Leitor(a)',notes:'',customBooks:[],achievements:[],lastMission:null,dailyGoal:10,weeklyGoal:50,bookmarks:{},quotes:[],settings:{fontScale:1,highContrast:false,nightMode:true,tts:false},club:{name:'',goal:0,notes:''},readTimeMin:0,genresRead:{},lastSeason:null});
function load(){try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{return defaultState()}}
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function safeBooks(){try{const extra=JSON.parse(localStorage.getItem(STORE)||'{}').customBooks||[];return [...starterBooks,...publicDomainBooks,...extra]}catch{return [...starterBooks,...publicDomainBooks]}}
function level(){return Math.floor(state.totalLT/100)+1} function lt(){return state.totalLT%100}
function renderProgress(){const lvl=level(),nextPass=5-(lvl-1)%5;$('#levelNum').textContent=lvl;$('#ltNum').textContent=lt();$('#xpFill').style.width=`${lt()}%`;$('#passNum').textContent=state.passes;$('#pagesRead').textContent=`${state.totalPages} ${state.totalPages===1?'página lida':'páginas lidas'} no total`;$('#nextReward').textContent=nextPass===1?'Passe disponível no próximo nível!':`Mais ${nextPass} níveis para ganhar um passe`;$('#streakNum').textContent=state.streak;$('#avatarInitial')?.remove();$('#profileButton').textContent=(state.name||'L').trim().charAt(0).toUpperCase()||'L';
const today=new Date().toLocaleDateString('en-CA');const todayPages=state.readDays[today]||0;const goal=state.dailyGoal||10;
const dg=$('#dailyGoalFill'); if(dg){dg.style.width=Math.min(100,Math.round(todayPages/goal*100))+'%';}
const dgt=$('#dailyGoalText'); if(dgt) dgt.textContent=`${todayPages} / ${goal} páginas hoje`;
const wt=$('#weekPages'); if(wt){const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(state.readDays[d.toLocaleDateString('en-CA')]||0);} wt.textContent=days.reduce((a,b)=>a+b,0)+' pág. esta semana';}
const topG=$('#topGenres'); if(topG){const g=Object.entries(state.genresRead||{}).sort((a,b)=>b[1]-a[1]).slice(0,3); topG.textContent=g.length?g.map(([n,v])=>`${n} (${v})`).join(' · '):'Ainda explorando...';}
const rt=$('#readTime'); if(rt) rt.textContent=(state.readTimeMin||0)+' min aprox.';
renderAchievements(); applySettings();
}
function addLT(amount,bookId,page){const oldLevel=level(),key=bookId;state.progress[key]=state.progress[key]||{pages:[],lastPage:0};if(page&&!state.progress[key].pages.includes(page)){state.progress[key].pages.push(page);state.progress[key].lastPage=page;state.totalPages++;state.totalLT+=amount;
const b=books.find(x=>x.id===bookId); if(b&&b.genre){state.genresRead=state.genresRead||{};state.genresRead[b.genre]=(state.genresRead[b.genre]||0)+1;}
state.readTimeMin=(state.readTimeMin||0)+1;
const day=new Date().toLocaleDateString('en-CA');if(state.lastReadDay!==day){const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);state.streak=state.lastReadDay===yesterday.toLocaleDateString('en-CA')?state.streak+1:1;state.lastReadDay=day}state.readDays[day]=(state.readDays[day]||0)+1;save();renderProgress();renderCalendar();const newLevel=level();if(newLevel>oldLevel){for(let l=oldLevel+1;l<=newLevel;l++){if((l-1)%5===0){state.passes++;showToast(`Nível ${l}! Você ganhou um passe de leitura ✦`)}else showToast(`Nível ${l}! Continue sua jornada.`)}save();renderProgress();renderShelves()}if(state.totalPages>=1)$('#missionTitle').textContent='Missão em andamento';if(state.totalPages>=3){$('#missionDesc').textContent='A cada 3 páginas novas, um desafio de memória aparece.';$('#missionStatus').textContent='DESBLOQUEADA'}}}
function makeBookCard(b){const isLocked=b.unlock&&state.passes<b.unlock;const fav=state.favorites.includes(b.id);const color=b.color||coverColors[hash(b.id)%coverColors.length];return `<button class="book ${isLocked?'locked':''}" data-book="${esc(b.id)}" style="background:linear-gradient(145deg,${color},${shade(color)})" aria-label="${isLocked?'Livro bloqueado: requer '+b.unlock+' passe(s)':esc(b.title)}"><span class="book-symbol">${bookSymbol(b.genre)}</span><span class="book-title">${esc(b.title)}</span><span class="book-author">${esc(b.author)}${fav?' · ★':''}</span><span class="book-type">${b.pdfFile?'PDF integral':'amostra'}</span>${isLocked?`<span class="lock-shade"><span><b>🔒</b>${b.unlock} passe${b.unlock>1?'s':''} para desbloquear</span></span>`:''}</button>`}
function renderShelves(){const root=$('#shelfRoot'),query=$('#searchInput').value.trim().toLowerCase();const visible=books.filter(b=>{const matchesFilter=activeFilter==='Todos'||b.genre===activeFilter;const matchesSearch=!query||`${b.title} ${b.author} ${b.genre} ${(b.tags||[]).join(' ')}`.toLowerCase().includes(query);return matchesFilter&&matchesSearch});const unlocked=visible.filter(b=>!b.unlock||state.passes>=b.unlock);const locked=visible.filter(b=>b.unlock&&state.passes<b.unlock);const shelfSpecs=[['📖','Continuar sua jornada',unlocked.filter(b=>(state.progress[b.id]?.pages?.length||0)>0),'Retome um livro que você começou'],['✨','Recomendados para você',unlocked.slice().sort((a,b)=>b.rec-a.rec).slice(0,6),'Seleção da comunidade leitora'],['📚','Estante de descobertas',unlocked.filter(b=>!(state.progress[b.id]?.pages?.length)).slice(0,7),'Novas histórias para explorar'],['🔐','Salão das histórias raras',locked,'Livros especiais · desbloqueie com passes']];root.innerHTML=shelfSpecs.map(([icon,title,items,sub])=>`<section class="shelf-block"><h3 class="shelf-label"><span>${icon}</span>${title}<small>${sub}</small></h3><div class="shelf-row">${items.length?items.map(makeBookCard).join(''):`<div class="empty-state">${title.includes('Continuar')?'Leia algumas páginas para ver seu progresso aqui.':'Nenhum livro nesta seleção.'}</div>`}</div><div class="shelf-wood"></div></section>`).join('');root.querySelectorAll('[data-book]').forEach(el=>el.addEventListener('click',()=>{const book=books.find(x=>x.id===el.dataset.book);if(book.unlock&&state.passes<book.unlock){showToast(`Este livro requer ${book.unlock} passe${book.unlock>1?'s':''}. Complete níveis para ganhar passes.`);return}openBook(book)}));window.dispatchEvent(new CustomEvent('continum:books-changed',{detail:{books}}))}
function renderTerrorShelf(){const root=$('#terrorRoot');if(!root)return;const ids=new Set(['sp01','sp02','sp03','b03','b08','b14','b18','b22']);const picks=books.filter(b=>ids.has(b.id)&&(!b.unlock||state.passes>=b.unlock));$('#terrorCount').textContent=`${picks.length} histórias`;root.innerHTML=picks.map(b=>`<article class="terror-book-wrap"><span class="terror-ornament">✧</span>${makeBookCard(b).replace('class="book','class="book terror-book')}<p>${esc(b.genre)} · ${b.pdfFile?'PDF integral':'amostra'}</p></article>`).join('');root.querySelectorAll('[data-book]').forEach(el=>el.addEventListener('click',()=>{const book=books.find(x=>x.id===el.dataset.book);if(book.unlock&&state.passes<book.unlock){showToast(`Este livro requer ${book.unlock} passe${book.unlock>1?'s':''}.`);return}openBook(book)}))}
function routePage(){const route=location.hash.slice(1),page=['biblioteca','terror'].includes(route)?route:'inicio';document.querySelectorAll('.page-view').forEach(el=>{el.hidden=el.id!==({inicio:'homeView',biblioteca:'libraryView',terror:'terrorView'}[page])});document.body.dataset.page=page;window.dispatchEvent(new CustomEvent('continum:season-changed'));document.querySelectorAll('.main-nav [data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===page));if(page==='biblioteca')requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));window.scrollTo({top:0,behavior:'smooth'})}
function bookSymbol(genre){return ({Fantasia:'✧',Mistério:'⌕',Romance:'♡','Ficção científica':'✦',Poesia:'❧',Aventura:'➶',Ensaio:'✎'})[genre]||'✦'}
function hash(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}function shade(hex){const n=parseInt(hex.slice(1),16);const r=Math.max(0,((n>>16)&255)-35),g=Math.max(0,((n>>8)&255)-35),b=Math.max(0,(n&255)-35);return `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`}
function openModal(html,reader=false){const m=$('#modal'),body=$('#modalBody');m.hidden=false;body.innerHTML=html;$('.modal').classList.toggle('reader',reader);$('#modalClose').onclick=closeModal;$('#modalClose').focus()}
function closeModal(){if(activeReader?.pdfUrl)URL.revokeObjectURL(activeReader.pdfUrl);activeReader=null;$('#modal').hidden=true;$('#modalBody').innerHTML=''}
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))closeModal()});addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden)closeModal();if(activeReader&&e.key==='ArrowRight')nextPage();if(activeReader&&e.key==='ArrowLeft')previousPage()});
function openBook(book){const locked=book.unlock&&state.passes<book.unlock;if(locked)return;const fav=state.favorites.includes(book.id);openModal(`<div class="book-detail"><div class="cover-large" style="background:linear-gradient(145deg,${book.color||coverColors[hash(book.id)%coverColors.length]},${shade(book.color||coverColors[hash(book.id)%coverColors.length])})"><span class="book-symbol">${bookSymbol(book.genre)}</span><b>${esc(book.title)}</b><small>${esc(book.author)}</small></div><div><p class="eyebrow">${esc(book.genre)} · ${book.pages||3} páginas</p><h2 id="modalTitle">${esc(book.title)}</h2><p class="meta-line">★ ${book.rating.toFixed(1)} · ${book.rec} recomendações · ${book.reads} leituras</p><p>${esc(book.desc||'Uma história esperando para ser descoberta.')}</p><p class="meta-line">${book.pdfFile?'PDF integral incluído nesta cópia.':'Amostra de catálogo: este título ainda não tem PDF completo incluído.'}</p><div>${(book.tags||[]).map(t=>`<span class="pill" style="color:#796b56;border-color:#ded3c2;margin-right:4px">#${esc(t)}</span>`).join('')}</div><div class="detail-actions"><button class="small-button primary" id="startRead">▶ Começar a ler</button><button class="small-button" id="resumeRead">↩ Continuar de onde parei</button><button class="small-button" id="markPage">🔖 Marcar página atual</button><button class="small-button" id="toggleFav">${fav?'★ Nos favoritos':'☆ Favoritar'}</button></div><p class="meta-line" style="margin-top:14px">LT cresce com páginas novas lidas. Uma missão de memória aparece a cada 3 páginas.</p></div></div>`);$('#startRead').onclick=()=>startReading(book);
const prog=state.progress[book.id];
$('#resumeRead').onclick=()=>{startReading(book, prog&&prog.lastPage||1);};
$('#markPage').onclick=()=>{const p=(prog&&prog.lastPage)||1; addBookmark(book.id, p, '');};$('#toggleFav').onclick=()=>{if(fav)state.favorites=state.favorites.filter(x=>x!==book.id);else state.favorites.push(book.id);save();closeModal();renderShelves();showToast(fav?'Removido dos favoritos.':'Adicionado aos favoritos.')}}
async function openPdf(id){if(!('indexedDB'in window))return null;return new Promise(resolve=>{let req=indexedDB.open(PDF_DB,1);req.onupgradeneeded=()=>req.result.createObjectStore('pdfs');req.onerror=()=>resolve(null);req.onsuccess=()=>{const db=req.result,tx=db.transaction('pdfs','readonly'),r=tx.objectStore('pdfs').get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>resolve(null)}})}
function pageText(book,n){const sample=demoTexts[(book.textIndex||hash(book.id))%demoTexts.length];return sample[(n-1)%sample.length]||`A história de ${book.title} continua a convidar você para observar seus detalhes, personagens e escolhas. Cada página traz uma nova pista para a jornada.`}
async function startReading(book, resumePage){
  closeModal();const p=state.progress[book.id]||{pages:[],lastPage:0}; if(resumePage) p.lastPage=resumePage;let pdf=null,pdfUrl=null;
  try{
    if(book.pdfFile){const response=await fetch(book.pdfFile);if(!response.ok)throw new Error(`O arquivo ${book.pdfFile} não foi encontrado (HTTP ${response.status}).`);const blob=await response.blob();if(blob.type!=='application/pdf'&&blob.size<1000)throw new Error('O arquivo recebido não parece ser um PDF válido.');pdfUrl=URL.createObjectURL(blob)}
    else if(book.hasPdf){const savedPdf=await openPdf(book.id);if(!savedPdf)throw new Error('Este livro não tem um PDF salvo neste navegador. Cadastre ou importe o arquivo PDF novamente.');pdfUrl=URL.createObjectURL(savedPdf)}
    if(pdfUrl){if(!window.pdfjsLib)throw new Error('A biblioteca PDF.js não carregou. Extraia a pasta vendor junto com o site e recarregue a página.');pdfjsLib.GlobalWorkerOptions.workerSrc=new URL('vendor/pdf.worker.min.js',document.baseURI).href;pdf=await pdfjsLib.getDocument({url:pdfUrl}).promise;if(!pdf.numPages)throw new Error('O PDF não tem páginas legíveis.')}
  }catch(error){console.error('Não foi possível abrir o PDF do livro.',error);if(pdfUrl)URL.revokeObjectURL(pdfUrl);openModal(`<p class="eyebrow">ARQUIVO DO LIVRO</p><h2 id="modalTitle">Não foi possível abrir este PDF</h2><p>${esc(error.message||'Confira se o ZIP foi extraído inteiro, incluindo as pastas livros e vendor.')}</p><div class="detail-actions"><button class="small-button" id="pdfErrorBack">← Voltar à biblioteca</button></div>`);$('#pdfErrorBack').onclick=()=>{closeModal();renderShelves()};return}
  const count=pdf?.numPages||book.pages||3;activeReader={book,pdf,pdfUrl,count,page:Math.min(Math.max(p.lastPage||1,1),count),texts:[],quizDue:false,quiz:null,visited:new Set()};renderReaderPage(true)
}
async function renderReaderPage(first=false){
  const r=activeReader;if(!r)return;const page=r.page;let text='';
  if(r.pdf){try{const pdfPage=await r.pdf.getPage(page),content=await pdfPage.getTextContent();text=content.items.map(x=>x.str).join(' ').trim()}catch(error){console.error('Falha ao extrair texto auxiliar do PDF.',error)}}
  if(!text)text=r.pdf?'Página do PDF aberta. Você pode continuar lendo e avançar.':pageText(r.book,page);
  r.currentText=text;
  if(!r.visited.has(page)){r.visited.add(page);r.texts.push(text);if(r.texts.length>12)r.texts.shift();r.book.reads=(r.book.reads||0)+(first?1:0);addLT(10,r.book.id,page);if(r.visited.size>1&&r.visited.size%3===0)r.quizDue=true}
  state.progress[r.book.id].lastPage=page;save();renderShelves();
  const content=r.pdf?'<div class="pdf-page-wrap"><canvas id="pdfPageCanvas" aria-label="Página do livro em PDF"></canvas><p class="pdf-load-error" id="pdfLoadError" hidden>Não foi possível desenhar esta página. Verifique se os arquivos vendor/pdf.min.js e vendor/pdf.worker.min.js foram extraídos junto com o site.</p></div>':`<div class="demo-page">${esc(text)}</div>`;
  openModal(`<div class="reader-head"><div><p class="eyebrow">SUA LEITURA · ${esc(r.book.genre)}${r.pdf?' · PDF COMPLETO':''}</p><h2 id="modalTitle">${esc(r.book.title)}</h2></div><span class="pill" style="color:#916942;border-color:#e3d4bc">${state.totalLT%100} LT</span></div><div class="reader-progress"><i style="width:${Math.min(100,page/r.count*100)}%"></i></div><article class="reader-page" id="readerPage">${content}</article><div class="reader-controls"><button class="small-button" id="readerBack">← Biblioteca</button><span class="reader-page-label">Página ${page} de ${r.count} · ${r.visited.size} nesta sessão</span><button class="small-button primary" id="readerNext">${page>=r.count?'Concluir':'Próxima página →'}</button></div><div id="quizHost"></div>`,true);
  $('#readerBack').onclick=()=>{closeModal();renderProgress()};$('#readerNext').onclick=nextPage;
  if(r.pdf){try{const pdfPage=await r.pdf.getPage(page),base=pdfPage.getViewport({scale:1}),canvas=$('#pdfPageCanvas'),context=canvas.getContext('2d'),available=Math.max(260,$('#readerPage').clientWidth-50),dpr=Math.min(window.devicePixelRatio||1,2),cssScale=available/base.width,viewport=pdfPage.getViewport({scale:cssScale*dpr});canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.style.width=`${Math.ceil(viewport.width/dpr)}px`;canvas.style.height=`${Math.ceil(viewport.height/dpr)}px`;await pdfPage.render({canvasContext:context,viewport}).promise}catch(error){console.error('Falha ao desenhar página PDF.',error);$('#pdfLoadError').hidden=false}}
  if(r.quizDue)showQuiz()
}
function previousPage(){if(!activeReader||activeReader.page<=1)return;activeReader.page--;renderReaderPage()}
function nextPage(){if(!activeReader)return;if(activeReader.quizDue&&!activeReader.quiz){showToast('Responda à missão para continuar.');return}if(activeReader.page>=activeReader.count){const b=activeReader.book;if(!state.completedBooks.includes(b.id))state.completedBooks.push(b.id);save();closeModal();renderProgress();renderShelves();showToast('Livro concluído! Uma história a mais na sua jornada.');return}activeReader.page++;if(activeReader.pdf)renderReaderPage();else renderReaderPage()}
function wordsForQuiz(text){const stop=new Set(['para','como','mais','esta','esse','pela','pelo','sobre','quando','havia','depois','então','entre','suas','seus','tinha','ainda','muito','também','porque','onde','dentro','junto','outro','outra','cada','antes','livro','página','páginas','história']);return [...new Set((text.match(/[A-Za-zÀ-ÿ]{5,}/g)||[]).map(w=>w.toLowerCase()).filter(w=>!stop.has(w))) ]}
function showQuiz(){const r=activeReader;if(!r)return;const optionsText=[...r.texts.slice(-3)].join(' '),words=wordsForQuiz(optionsText);if(words.length<2){r.quizDue=false;r.quiz={ok:true};return}const correct=words[hash(r.book.id+':'+r.page+':'+state.totalPages)%words.length];const all=[correct,...words.filter(w=>w!==correct).sort((a,b)=>hash(a+state.totalPages)-hash(b+state.totalPages)).slice(0,3)].sort((a,b)=>hash(a+r.page)-hash(b+r.page));r.quiz={correct,done:false};$('#quizHost').innerHTML=`<section class="quiz-card"><p class="eyebrow">MISSÃO DESBLOQUEADA · ${state.totalPages} PÁGINAS</p><h3>Qual destas palavras apareceu nas páginas que você leu?</h3><p>Uma pergunta rápida sobre sua leitura anterior.</p><div class="quiz-options">${all.map(w=>`<button class="quiz-option" data-answer="${esc(w)}">${esc(w)}</button>`).join('')}</div><p id="quizFeedback" aria-live="polite"></p></section>`;$('#quizHost').querySelectorAll('[data-answer]').forEach(btn=>btn.onclick=()=>{if(r.quiz.done)return;const ok=btn.dataset.answer===r.quiz.correct;btn.classList.add(ok?'correct':'wrong');if(!ok){$('#quizFeedback').textContent='Quase! Tente de novo. Dica: releia as páginas anteriores.';return}r.quiz.done=true;r.quizDue=false;state.totalLT+=5;state.lastMission=new Date().toISOString();save();renderProgress();$('#quizFeedback').textContent='Resposta certa! +5 LT de missão. Leia a próxima página quando quiser.';$('#quizHost').querySelectorAll('button').forEach(b=>b.disabled=true);showToast('Missão concluída: +5 LT!')})}
function renderAchievements(){
  const horrorReads=(state.completedBooks||[]).filter(id=>{const b=books.find(x=>x.id===id);return b&&(b.genre==='Terror'||b.genre==='Suspense'||(b.tags||[]).some(t=>/terror|suspense|mistério|halloween/i.test(t)))}).length;
  const nightPages=Object.entries(state.readDays||{}).reduce((s,[,n])=>s+n,0);
  const genres=Object.keys(state.genresRead||{}).length;
  const items=[
    ['📖','Primeira página',state.totalPages>=1,'Leia sua primeira página'],
    ['🔥','Ritmo constante',state.streak>=3,'Leia em 3 dias seguidos'],
    ['🏅','Nível 5',level()>=5,'Alcance o nível 5'],
    ['✦','Passe conquistado',state.passes>=1,'Ganhe seu primeiro passe'],
    ['📚','Leitor voraz',state.completedBooks.length>=3,'Conclua três livros'],
    ['🎃','Leitor da noite',horrorReads>=1,'Termine um livro de terror/suspense'],
    ['👻','Assombração',horrorReads>=3,'Conclua 3 histórias sombrias'],
    ['🦇','Portal aberto',document.body.dataset.page==='terror'||state.totalPages>=5,'Visite a estante sombria ou leia 5 páginas'],
    ['🕯️','Vela acesa',state.streak>=7,'Leia 7 dias seguidos'],
    ['🗺️','Explorador',genres>=3,'Experimente 3 gêneros diferentes'],
    ['⭐','Meta diária', (state.readDays[new Date().toLocaleDateString('en-CA')]||0) >= (state.dailyGoal||10), 'Cumpra a meta de páginas de hoje'],
    ['📈','Maratonista',state.totalPages>=100,'Some 100 páginas no total'],
    ['🔖','Colecionador de trechos',(state.quotes||[]).length>=3,'Salve 3 citações/marcadores'],
    ['♿','Leitor acessível',!!(state.settings&&state.settings.fontScale!==1),'Use o ajuste de tamanho de texto'],
    ['🌙','Modo noturno',!!(state.settings&&state.settings.nightMode),'Leia com o tema escuro ativo']
  ];
  // unlock into state.achievements
  items.forEach(([i,n,ok])=>{ if(ok && !(state.achievements||[]).includes(n)){ state.achievements=state.achievements||[]; state.achievements.push(n); showToast(`Conquista desbloqueada: ${n} ${i}`); } });
  save();
  const el=$('#achievementList'); if(!el) return;
  el.innerHTML=items.map(([i,n,ok,d])=>`<div class="achievement ${ok?'':'locked'}" title="${d}"><span class="achievement-icon">${i}</span><span><b>${n}</b><small>${d}</small></span>${ok?'<span class="ach-ok">✓</span>':''}</div>`).join('');
  const halloweenEl=$('#halloweenBadges'); if(halloweenEl){ const h=items.filter(x=>['🎃','👻','🦇','🕯️'].includes(x[0])); halloweenEl.innerHTML=h.map(([i,n,ok,d])=>`<div class="achievement ${ok?'':'locked'}"><span class="achievement-icon">${i}</span><span><b>${n}</b><small>${d}</small></span>${ok?'<span class="ach-ok">✓</span>':''}</div>`).join(''); }
}
function holidays(year){const easter=easterDate(year),add=(date,name,icon,season,desc)=>({date,name,icon,season,desc});const arr=[add(new Date(year,0,1),'Confraternização Universal','✨',null,'Um novo ano, uma nova história para começar.'),add(new Date(year,3,21),'Tiradentes','📜',null,'Um dia para lembrar histórias que ajudam a construir o país.'),add(new Date(year,4,1),'Dia do Trabalho','🌿',null,'Uma pausa merecida também cabe entre as páginas.'),add(new Date(year,8,7),'Independência do Brasil','🇧🇷',null,'Uma data para conhecer histórias do Brasil.'),add(new Date(year,9,12),'Nossa Senhora Aparecida','🌼',null,'Um dia de tradição, afeto e boas leituras.'),add(new Date(year,10,2),'Finados','🕯️',null,'Um momento de memória e histórias que permanecem.'),add(new Date(year,10,15),'Proclamação da República','📚',null,'Uma oportunidade para revisitar a história.'),add(new Date(year,10,20),'Consciência Negra','✊🏾',null,'Celebre autoras, autores e narrativas negras.'),add(new Date(year,11,25),'Natal','🎄','natal','Que as histórias tragam aconchego e alegria.'),add(new Date(year,5,24),'Festa Junina','🎏','junina','Bandeirinhas, histórias e um clima de festa junina.'),add(new Date(easter.getFullYear(),easter.getMonth(),easter.getDate()-47),'Carnaval','🎭','carnaval','Cores, música e histórias cheias de movimento.'),add(new Date(easter.getFullYear(),easter.getMonth(),easter.getDate()-2),'Sexta-feira Santa','🕊️',null,'Um dia de pausa e reflexão.'),add(new Date(easter.getFullYear(),easter.getMonth(),easter.getDate()+60),'Corpus Christi','🕊️',null,'Uma data de tradição e contemplação.')];return arr}
function easterDate(Y){const a=Y%19,b=Math.floor(Y/100),c=Y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31)-1,day=((h+l-7*m+114)%31)+1;return new Date(Y,month,day)}
function renderDate(){const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());$('#dateLine').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(now);$('#todayLabel').textContent='SUA JORNADA DE HOJE · '+new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long'}).format(now).toUpperCase();let events=[...holidays(now.getFullYear()),...holidays(now.getFullYear()+1)].map(x=>({...x,delta:Math.round((new Date(x.date.getFullYear(),x.date.getMonth(),x.date.getDate())-today)/864e5)})).filter(x=>x.delta>=0).sort((a,b)=>a.delta-b.delta);let event=events[0];if(event){$('#holidayIcon').textContent=event.icon;$('#holidayTag').textContent=event.delta===0?'É HOJE':event.delta===1?'AMANHÃ':`EM ${event.delta} DIAS`;$('#holidayTitle').textContent=event.delta===0?event.name:`A caminho: ${event.name}`;$('#holidayDesc').textContent=event.desc;document.body.dataset.season=event.season&&event.delta<=14?event.season:''}else{$('#holidayIcon').textContent='☼';$('#holidayTag').textContent='SEU DIA';$('#holidayTitle').textContent='Uma boa hora para ler';$('#holidayDesc').textContent='Sua próxima aventura está esperando na estante.';document.body.dataset.season=''} }
function renderCalendar(){const now=new Date(),days=[];for(let n=6;n>=0;n--){const d=new Date(now);d.setDate(d.getDate()-n);const key=d.toLocaleDateString('en-CA');days.push({d,key})}$('#weekGrid').innerHTML=days.map(({d,key})=>{const count=state.readDays[key]||0,height=count?Math.min(92,24+count*12):8;return `<div class="day-cell ${key===now.toLocaleDateString('en-CA')?'today':''} ${count?'read':''}" title="${count?count+' página(s) lida(s)':'Sem leitura registrada'}"><span class="day-bar" style="--bar-height:${height}%"></span><i>${d.getDate()}</i><small>${new Intl.DateTimeFormat('pt-BR',{weekday:'short'}).format(d).replace('.','')}</small></div>`}).join('');$('#calendarHint').textContent=state.streak?`Você está em uma sequência de ${state.streak} dia${state.streak===1?'':'s'} seguidos de leitura. Continue assim!`:'As barras mostram sua leitura nos últimos sete dias.'}
function showToast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2800)}
function applyNearestHalloween(){const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());let h=new Date(now.getFullYear(),9,31);if(h<today)h=new Date(now.getFullYear()+1,9,31);const delta=Math.round((h-today)/864e5);const others=[...holidays(now.getFullYear()),...holidays(now.getFullYear()+1)].map(x=>new Date(x.date.getFullYear(),x.date.getMonth(),x.date.getDate())).filter(d=>d>=today).sort((a,b)=>a-b);const nextOther=others[0]?Math.round((others[0]-today)/864e5):Infinity;if(delta<=31&&delta<=nextOther){$('#holidayIcon').textContent='🎃';$('#holidayTag').textContent=delta===0?'É HOJE':delta===1?'AMANHÃ':`EM ${delta} DIAS`;$('#holidayTitle').textContent=delta===0?'Halloween chegou!':'Halloween está chegando';$('#holidayDesc').textContent='Uma estante assombrada, histórias para descobrir e uma nova missão à espera.';document.body.dataset.season='halloween';$('#sceneHalloween').hidden=false}}
function render(){renderDate();applyNearestHalloween();renderProgress();renderCalendar();renderShelves();renderTerrorShelf();renderRecommendations();renderBookmarksPanel();renderClub();enhanceMissions();applySettings();$('#libraryBookCount').textContent=books.length;routePage();}
$('#searchInput').addEventListener('input',renderShelves);$('#filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;activeFilter=b.dataset.filter;$('#filters').querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderShelves()});$('#profileButton').onclick=()=>{
  const s=state.settings||{fontScale:1,highContrast:false,nightMode:true};
  openModal(`<div class="profile-modal">
    <h2>Perfil & Preferências</h2>
    <label>Seu nome <input id="profName" value="${esc(state.name)}" maxlength="24"></label>
    <label>Meta diária (páginas) <input type="number" id="profDaily" value="${state.dailyGoal||10}" min="1" max="200"></label>
    <label>Meta semanal <input type="number" id="profWeekly" value="${state.weeklyGoal||50}" min="1" max="1000"></label>
    <hr>
    <h3>Acessibilidade</h3>
    <label>Tamanho do texto <input type="range" id="fontScale" min="0.85" max="1.4" step="0.05" value="${s.fontScale||1}"> <span id="fontScaleVal">${Math.round((s.fontScale||1)*100)}%</span></label>
    <label class="check"><input type="checkbox" id="highContrast" ${s.highContrast?'checked':''}> Alto contraste</label>
    <label class="check"><input type="checkbox" id="nightMode" ${s.nightMode!==false?'checked':''}> Modo noturno / tema escuro</label>
    <hr>
    <h3>Temas sazonais</h3>
    <div class="season-btns">
      <button type="button" data-season="">Padrão</button>
      <button type="button" data-season="halloween">🎃 Halloween</button>
      <button type="button" data-season="natal">🎄 Natal</button>
      <button type="button" data-season="junina">🌽 Festa Junina</button>
    </div>
    <hr>
    <h3>Sincronização entre dispositivos</h3>
    <p class="muted small">Exporte seu progresso e importe em outro computador (ou envie ao amigo).</p>
    <div class="row-btns">
      <button type="button" class="button primary" id="btnExport">Exportar perfil (.json)</button>
      <label class="button ghost">Importar <input type="file" id="btnImport" accept=".json,application/json" hidden></label>
    </div>
    <div class="row-btns" style="margin-top:1rem">
      <button type="button" class="button primary" id="btnSaveProf">Salvar</button>
    </div>
  </div>`);
  $('#fontScale')?.addEventListener('input',e=>{const v=parseFloat(e.target.value); $('#fontScaleVal').textContent=Math.round(v*100)+'%'; document.documentElement.style.setProperty('--font-scale',v);});
  document.querySelectorAll('[data-season]').forEach(b=>b.onclick=()=>setSeasonTheme(b.dataset.season));
  $('#btnExport')?.addEventListener('click',exportSave);
  $('#btnImport')?.addEventListener('change',e=>{if(e.target.files[0]) importSave(e.target.files[0]);});
  $('#btnSaveProf')?.addEventListener('click',()=>{
    const n=$('#profName')?.value?.trim(); if(n) state.name=n.slice(0,24);
    setDailyGoal($('#profDaily')?.value);
    setWeeklyGoal($('#profWeekly')?.value);
    saveSettingsFromUI();
    closeModal(); renderProgress();
  });
};
$('#notesInput').addEventListener('input',e=>{state.notes=e.target.value;save();$('#notesSaved').textContent='Salvo';setTimeout(()=>$('#notesSaved').textContent='',900)});
$('#openAdd').onclick=()=>{openModal(`<p class="eyebrow">SUA BIBLIOTECA, DO SEU JEITO</p><h2 id="modalTitle">Adicionar livro</h2><p>Cadastre um livro ou escolha um PDF para usar como texto de leitura. Arquivos e progresso ficam neste dispositivo.</p><form id="addForm"><div class="form-grid"><div class="form-field"><label for="newTitle">Título *</label><input id="newTitle" required maxlength="80" placeholder="Nome do livro"></div><div class="form-field"><label for="newAuthor">Autor</label><input id="newAuthor" maxlength="60" placeholder="Nome do autor"></div><div class="form-field"><label for="newGenre">Gênero</label><select id="newGenre"><option>Fantasia</option><option>Mistério</option><option>Romance</option><option>Ficção científica</option><option>Poesia</option><option>Aventura</option><option>Ensaio</option><option>Suspense</option><option>Terror</option></select></div><div class="form-field"><label for="newPages">Páginas (se não houver PDF)</label><input id="newPages" type="number" min="1" max="9999" value="12"></div><div class="form-field full"><label for="newDesc">Descrição</label><textarea id="newDesc" rows="2" placeholder="Sobre o que é este livro?"></textarea></div><div class="form-field full"><label for="newPdf">Arquivo PDF (opcional)</label><input id="newPdf" type="file" accept="application/pdf"></div><div class="form-field full"><button class="small-button primary" type="submit">Adicionar à estante</button></div></div></form>`);$('#addForm').onsubmit=async e=>{e.preventDefault();const f=$('#newPdf').files[0],id='user-'+Date.now(),book={id,title:$('#newTitle').value.trim(),author:$('#newAuthor').value.trim()||'Autor(a) independente',genre:$('#newGenre').value,pages:Math.max(1,Number($('#newPages').value)||12),reads:0,rating:4.5,rec:0,desc:$('#newDesc').value.trim()||'Livro adicionado à sua biblioteca.',tags:['meu livro'],color:coverColors[hash(id)%coverColors.length],textIndex:hash(id)%demoTexts.length};if(f&&f.size>60*1024*1024){showToast('O PDF excede o limite local de 60 MB.');return}if(f){book.hasPdf=true;book.pages=1;try{await storePdf(id,f);if(window.pdfjsLib){pdfjsLib.GlobalWorkerOptions.workerSrc='vendor/pdf.worker.min.js';const pdf=await pdfjsLib.getDocument(URL.createObjectURL(f)).promise;book.pages=pdf.numPages;URL.revokeObjectURL(pdf.loadingTask._transport?.url||'')}}catch(err){console.warn(err)}}state.customBooks.push(book);save();books=safeBooks();closeModal();renderShelves();showToast('Livro adicionado à estante!') }};
function storePdf(id,file){return new Promise((resolve,reject)=>{const req=indexedDB.open(PDF_DB,1);req.onupgradeneeded=()=>req.result.createObjectStore('pdfs');req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result,tx=db.transaction('pdfs','readwrite');tx.objectStore('pdfs').put(file,id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)}})}
$('#resetButton').onclick=()=>{if(confirm('Quer reiniciar LT, níveis, missões, favoritos e histórico? Seus livros adicionados e notas também serão apagados deste dispositivo.')){localStorage.removeItem(STORE);state=defaultState();books=safeBooks();render();showToast('Progresso reiniciado.')}};
const renderShelvesWithDemo=renderShelves;
renderShelves=function(){renderShelvesWithDemo();const root=$('#shelfRoot');root.querySelector('#publicDomainShelf')?.remove();const classics=books.filter(b=>b.pdfFile);root.insertAdjacentHTML('afterbegin',`<section class="shelf-block pdf-shelf" id="publicDomainShelf"><h3 class="shelf-label"><span>📜</span>Livros completos para ler agora<small>${classics.length} PDFs incluídos · clique em um livro para abrir</small></h3><div class="shelf-row">${classics.map(makeBookCard).join('')}</div><div class="shelf-wood"></div></section>`);root.querySelectorAll('#publicDomainShelf [data-book]').forEach(el=>el.addEventListener('click',()=>{const book=books.find(x=>x.id===el.dataset.book);openBook(book)}))};
$('#pumpkinPortal').onclick=()=>{location.hash='#terror'};window.addEventListener('hashchange',routePage);$('#resetButtonTerror').onclick=()=>$('#resetButton').click();

function applySettings(){
  const s=state.settings||{fontScale:1,highContrast:false,nightMode:true};
  document.documentElement.style.setProperty('--font-scale', s.fontScale||1);
  document.body.classList.toggle('high-contrast', !!s.highContrast);
  document.body.classList.toggle('night-mode', s.nightMode!==false);
  document.body.classList.toggle('day-mode', s.nightMode===false);
  const fs=$('#fontScaleVal'); if(fs) fs.textContent=Math.round((s.fontScale||1)*100)+'%';
}
function saveSettingsFromUI(){
  state.settings=state.settings||{};
  const sc=$('#fontScale'); if(sc) state.settings.fontScale=parseFloat(sc.value)||1;
  const hc=$('#highContrast'); if(hc) state.settings.highContrast=hc.checked;
  const nm=$('#nightMode'); if(nm) state.settings.nightMode=nm.checked;
  save(); applySettings(); showToast('Preferências salvas');
}
function exportSave(){
  const data=JSON.stringify({...state, exportedAt:new Date().toISOString()},null,2);
  const blob=new Blob([data],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='continum-perfil.json'; a.click();
  showToast('Perfil exportado — envie o arquivo ao seu amigo ou outro dispositivo');
}
function importSave(file){
  const r=new FileReader();
  r.onload=()=>{try{const data=JSON.parse(r.result); state={...defaultState(),...data}; save(); books=safeBooks(); render(); showToast('Perfil importado com sucesso!');}catch(e){showToast('Arquivo inválido');}};
  r.readAsText(file);
}
function addBookmark(bookId,page,text){
  state.bookmarks=state.bookmarks||{};
  state.bookmarks[bookId]=state.bookmarks[bookId]||[];
  if(!state.bookmarks[bookId].includes(page)) state.bookmarks[bookId].push(page);
  if(text){state.quotes=state.quotes||[]; state.quotes.push({bookId,page,text:text.slice(0,200),at:Date.now()}); if(state.quotes.length>50) state.quotes.shift();}
  save(); showToast('Marcador salvo ✦'); renderAchievements();
}
function setDailyGoal(n){state.dailyGoal=Math.max(1,Math.min(200,parseInt(n,10)||10)); save(); renderProgress(); showToast('Meta diária: '+state.dailyGoal+' páginas');}
function setWeeklyGoal(n){state.weeklyGoal=Math.max(1,Math.min(1000,parseInt(n,10)||50)); save(); showToast('Meta semanal: '+state.weeklyGoal+' páginas');}
function renderRecommendations(){
  const el=$('#recoList'); if(!el) return;
  const genreScores=state.genresRead||{};
  const scored=books.map(b=>{
    let score=b.rec||50;
    if(genreScores[b.genre]) score+=genreScores[b.genre]*3;
    if(state.favorites.includes(b.id)) score+=20;
    if(state.completedBooks.includes(b.id)) score-=40;
    if((b.tags||[]).some(t=>/terror|suspense/i.test(t)) && (genreScores['Terror']||genreScores['Suspense'])) score+=15;
    return {...b,score};
  }).sort((a,b)=>b.score-a.score).slice(0,6);
  el.innerHTML=scored.map(b=>`<button class="reco-item" data-book="${b.id}"><span class="reco-cover" style="background:${b.color||'#444'}"></span><span><b>${esc(b.title)}</b><small>${esc(b.author)} · ${esc(b.genre)}</small></span></button>`).join('');
  el.querySelectorAll('[data-book]').forEach(btn=>btn.onclick=()=>{const book=books.find(x=>x.id===btn.dataset.book); if(book) openBook(book);});
}
function renderBookmarksPanel(){
  const el=$('#bookmarksList'); if(!el) return;
  const entries=[];
  Object.entries(state.bookmarks||{}).forEach(([id,pages])=>{
    const b=books.find(x=>x.id===id);
    if(b) pages.forEach(p=>entries.push({b,p}));
  });
  (state.quotes||[]).slice(-10).reverse().forEach(q=>{
    const b=books.find(x=>x.id===q.bookId);
    if(b) entries.push({b,p:q.page,text:q.text});
  });
  if(!entries.length){el.innerHTML='<p class="muted">Nenhum marcador ainda. Ao ler, use “Marcar página”.</p>'; return;}
  el.innerHTML=entries.slice(0,12).map(({b,p,text})=>`<div class="bookmark-row"><b>${esc(b.title)}</b> · pág. ${p}${text?`<small>“${esc(text)}”</small>`:''}<button data-resume="${b.id}" data-page="${p}">Continuar</button></div>`).join('');
  el.querySelectorAll('[data-resume]').forEach(btn=>btn.onclick=()=>{const book=books.find(x=>x.id===btn.dataset.resume); if(book){openBook(book); /* resume page handled in reader */}});
}
function renderClub(){
  const el=$('#clubPanel'); if(!el) return;
  const c=state.club||{name:'',goal:0,notes:''};
  el.innerHTML=`<label>Nome do clube <input id="clubName" value="${esc(c.name)}" placeholder="Ex: Amigos da meia-noite"></label>
  <label>Meta compartilhada (páginas) <input type="number" id="clubGoal" value="${c.goal||0}" min="0"></label>
  <label>Notas do grupo <textarea id="clubNotes" rows="3" placeholder="Discussões, capítulos da semana...">${esc(c.notes||'')}</textarea></label>
  <button class="button primary" id="saveClub">Salvar clube local</button>
  <p class="muted small">O clube fica neste dispositivo. Use Exportar perfil para compartilhar com amigos.</p>`;
  $('#saveClub')?.addEventListener('click',()=>{
    state.club={name:$('#clubName').value.trim(),goal:parseInt($('#clubGoal').value,10)||0,notes:$('#clubNotes').value};
    save(); showToast('Clube salvo localmente');
  });
}
function enhanceMissions(){
  // richer questions for demo / sample books
  const questions=[
    {q:'Qual objeto Lia encontrou entre as páginas?',opts:['Uma chave com estrela','Um mapa antigo','Uma carta selada'],ok:0},
    {q:'O que Miguel devolveu na estação?',opts:['Um bilhete de trem','Um caderno azul','Uma mala'],ok:1},
    {q:'O que Clara viu na biblioteca após o pôr do sol?',opts:['Uma janela iluminada','Um fantasma','Um gato preto'],ok:0},
    {q:'Na estante sombria, o que costuma indicar “amostra”?',opts:['PDF completo','Trecho curto sem PDF integral','Livro bloqueado'],ok:1}
  ];
  if(state.totalPages>=3 && !state.lastMission){
    const m=questions[Math.floor(Math.random()*questions.length)];
    state.lastMission=m; save();
    const title=$('#missionTitle'), desc=$('#missionDesc'), st=$('#missionStatus');
    if(title) title.textContent='Desafio de memória';
    if(desc) desc.textContent=m.q+' (responda mentalmente ou anote no caderno)';
    if(st) st.textContent='ATIVA';
  }
}
function setSeasonTheme(name){
  document.body.dataset.season=name||'';
  state.lastSeason=name; save();
  const sky=$('.season-sky');
  if(sky){
    if(name==='halloween') sky.innerHTML='<span>🎃</span><span>👻</span><span>🕸️</span><span>🦇</span><span>🍂</span>';
    else if(name==='natal') sky.innerHTML='<span>🎄</span><span>❄️</span><span>⭐</span><span>🎁</span><span>🔔</span>';
    else if(name==='junina') sky.innerHTML='<span>🌽</span><span>🔥</span><span>🎈</span><span>⭐</span><span>🎵</span>';
    else sky.innerHTML='';
  }
  if(window.Continum3D && Continum3D.setSeason) Continum3D.setSeason();
  showToast(name?('Tema: '+name):'Tema padrão');
}


state=load();books=safeBooks();
window.ContinumGame={getBooks:()=>books||[],getPasses:()=>state?.passes||0,openBook,notify:showToast};
render();
})();
