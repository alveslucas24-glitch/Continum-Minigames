# Continum — minigame de leitura

Esta é uma cópia **local e editável** do site Continum, preparada para abrir no VS Code. Ela **não altera** o site publicado, o GitHub ou o Render. Só haverá publicação se você decidir fazê-la depois.

## Como baixar, extrair e abrir no VS Code

1. Baixe o arquivo `Continum-minigame-3-estantes-9-PDFs.zip` enviado junto com estas instruções.
2. No computador, localize o ZIP na pasta **Downloads**.
3. Clique com o botão direito nele e escolha **Extrair aqui** ou **Extrair tudo**. Não abra os arquivos diretamente de dentro do ZIP.
4. Abra o **VS Code**.
5. No VS Code, clique em **Arquivo → Abrir Pasta…** (ou **File → Open Folder…**).
6. Selecione a pasta extraída **Continum-minigame** e clique em **Abrir**.
7. No VS Code, clique em **Terminal → Novo Terminal**.
8. Digite o comando abaixo e pressione **Enter**:

   ```bash
   python3 iniciar_continum.py
   ```

9. O navegador deve abrir em `http://127.0.0.1:8000/`. Mantenha esse terminal aberto enquanto estiver usando o site.
10. Para parar o site, volte ao terminal e pressione **Ctrl+C**.

### Se o comando `python3` não funcionar

- **Windows:** tente `py iniciar_continum.py` ou `python iniciar_continum.py`.
- **Linux ou macOS:** instale/ative Python 3 e tente `python3 iniciar_continum.py`.
- Se a porta 8000 já estiver ocupada, execute com outra porta:

  ```bash
  PORT=8001 python3 iniciar_continum.py
  ```

  No Windows PowerShell:

  ```powershell
  $env:PORT=8001; py iniciar_continum.py
  ```

  Nesse caso, abra `http://127.0.0.1:8001/`.

**Importante:** use o servidor local; não abra `index.html` com duplo clique. O servidor permite carregar PDFs e recursos locais corretamente. Não é necessário instalar pacotes Python para a pré-visualização.

## O que foi incluído nesta versão

- **Biblioteca em uma página própria**, separada da página inicial, com navegação por início, biblioteca e estante sombria. A biblioteca abre com **três estantes 3D altas**, cinco prateleiras cada, piso detalhado, painéis, candeeiros, livros com lombada e decoração sazonal. Use ↶/↷ e +/−, arraste para girar ou clique numa lombada.
- **Nove livros integrais em PDF** dentro de `livros/`: *Dom Casmurro* (141 páginas), *Memórias Póstumas de Brás Cubas* (131), *Quincas Borba* (165), *Iracema* (74), *O Guarani* volumes I (146) e II (129), *O Atheneu* (129), *O Cortiço* (172) e *Quéda que as Mulheres Têm para os Tolos* (9). Eles estão no começo da biblioteca, na estante “Livros completos para ler agora”.
- Os livros abrem página por página, com a **página original do PDF desenhada no leitor**. Use “Próxima página” e “Biblioteca”; as páginas, a contagem LT, a barra de leitura e as missões continuam funcionando.
- **PDF.js e Three.js empacotados no projeto** (`vendor/`), então o leitor de PDFs e a estante 3D não dependem de CDN para carregar.
- **Decoração de Halloween** quando for o próximo evento comemorativo próximo: quando Halloween é a próxima data comemorativa, o site aplica o tema no cartão da data, no fundo, na estante 3D, nas decorações e durante a leitura.
- **LT:** cada página nova de um livro dá 10 LT; ao completar 100 LT o leitor avança de nível.
- **Missões de memória:** periodicamente, uma pergunta sobre palavras que apareceram nas páginas anteriores; a resposta correta rende 5 LT.
- **Passes:** a cada marco de cinco níveis, o leitor ganha passes que liberam os livros especiais já previstos no minigame.
- **Portal de Halloween:** clique no botão com a abóbora “Entrar na estante sombria” na página inicial. Ele abre uma página própria de terror e suspense, com até oito títulos selecionados e decoração sombria. Três são microcontos originais de suspense; um título de mistério aparece após desbloquear o passe exigido. Títulos marcados como **amostra** não têm PDF completo incluído; os outros PDFs completos permanecem na página da biblioteca.
- **Gráfico semanal de leitura** com uma barra para cada um dos últimos sete dias; a altura indica páginas lidas.
- Tipografia editorial mais expressiva, hierarquia de títulos, painéis gráficos revisados, páginas responsivas e navegação separada. As fontes personalizadas vêm do Google Fonts quando há internet; há fontes alternativas caso não carreguem.
- Pesquisa, filtros, favoritos, recomendações, calendário de leitura, sequência de dias, conquistas, caderno de notas e cadastro local de PDFs.

## Créditos e formato dos PDFs

Os textos integrais vieram das páginas oficiais do Project Gutenberg listadas em [CREDITOS-PDFS.md](CREDITOS-PDFS.md). Os PDFs foram **montados a partir dos arquivos de texto UTF-8** para serem pesquisáveis e abrirem no leitor do site; não são digitalizações de edições impressas específicas, e sua paginação pode ser diferente. As fontes estão em `fontes/`; `gerar_pdfs.py` contém o gerador.

## Como editar no VS Code

- `index.html`: textos, títulos, navegação e estrutura das páginas inicial, biblioteca e terror.
- `style.css`: cores, tipografia, gráficos, páginas, espaçamentos, responsividade e tema sazonal.
- `app.js`: livros, rotas de página, busca, LT, níveis, passes, missões, gráfico semanal, estante de suspense, calendário e leitor.
- `library3d.js`: estante Three.js, livros em 3D, giro/zoom por botões ou arraste e clique para ler.
- `livros/`: PDFs completos incluídos.
- `vendor/`: bibliotecas locais e arquivos de licença.

Depois de editar, salve com **Ctrl+S** e atualize o navegador com **Ctrl+R**. Se necessário, use **Ctrl+Shift+R** para recarregar sem cache.

## Dados e publicação

O progresso, favoritos, livros que você adiciona e notas ficam no armazenamento local do navegador/dispositivo; não sincronizam automaticamente com outras pessoas ou computadores. O ZIP não substitui a versão pública do Render. Publicar exige atualizar o repositório do GitHub associado ao serviço e revisar a configuração de deploy. Não inclua senhas, arquivos `.env`, chaves ou URLs privadas no ZIP ou no GitHub.


## Novidades desta versão (ideias 1–10)

1. **Perfil + sincronização manual** — clique no avatar → exportar/importar JSON do progresso para outro dispositivo ou amigo.
2. **Metas diárias e semanais** — configure no perfil; barra de progresso na página inicial.
3. **Conquistas temáticas** — incluindo distintivos de Halloween (🎃 👻 🦇 🕯️) na estante sombria.
4. **Missões com perguntas** — desafios de memória sobre trechos e sobre a estante.
5. **Marcadores e retomada** — “Continuar de onde parei” e “Marcar página” no detalhe do livro; painel de marcadores.
6. **Recomendações personalizadas** — baseadas em gêneros lidos, favoritos e livros concluídos.
7. **Estantes sazonais** — temas Halloween, Natal e Festa Junina (perfil → Temas sazonais).
8. **Clube de leitura (local)** — nome, meta e notas do grupo neste dispositivo; compartilhe via exportar perfil.
9. **Estatísticas** — páginas da semana, tempo aproximado e gêneros mais lidos.
10. **Acessibilidade** — tamanho de texto, alto contraste e modo noturno/dia no perfil.

**Hospedagem gratuita:** suba a pasta no GitHub e ative GitHub Pages (branch `main`, pasta root). URL: `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

Progresso continua no `localStorage` do navegador. Use exportar/importar para levar entre computadores.
