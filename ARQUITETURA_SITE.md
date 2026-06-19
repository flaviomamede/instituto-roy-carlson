# ARQUITETURA DO SITE — Instituto Roy Carlson

## 1. Objetivo do Site

O site do Instituto Roy Carlson deve ser a presença institucional pública do Instituto.

Ele deve cumprir quatro funções:

1. Apresentar o Instituto com clareza.
2. Preservar e valorizar o legado de Roy W. Carlson e da engenharia de concreto massa.
3. Dar lugar à Revista IRC como ativo editorial central.
4. Organizar caminhos para biblioteca, memória técnica, parceiros, apoiadores e contato.

O site não deve começar como app, marketplace, área de membros ou plataforma de cursos. Essas possibilidades ficam para fases futuras.

## 2. Conceito Narrativo

Conceito:

> **De ontem até hoje, do Brasil para o mundo.**

O site deve mostrar que o passado técnico não é nostalgia. É base para decisões melhores no presente.

A narrativa deve costurar:

- Roy W. Carlson e a engenharia internacional;
- Itaipu, Furnas, barragens e concreto massa;
- Walton Pacelli e a escola brasileira de tecnologia do concreto;
- Revista IRC como veículo de memória, atualização e diálogo;
- valor e eficiência em concreto como lema de futuro.

## 3. Experiência Visual

O site deve combinar linguagem editorial e linguagem técnica.

Elementos editoriais:

- capa de revista;
- títulos fortes;
- colunas;
- rodapés;
- numeração;
- textura de papel;
- chamadas curtas;
- hierarquia visual inspirada em publicação impressa.

Elementos técnicos:

- linhas finas de engenharia;
- grelhas discretas;
- curvas térmicas ou linhas de instrumentação;
- desenhos abstratos de barragens, concreto ou estruturas;
- movimento sutil ao rolar a página.

Efeito desejado:

> uma página antiga se abre e revela uma interface contemporânea.

O visual deve ser inovador sem parecer espalhafatoso. O Instituto precisa transmitir maturidade, memória, precisão e futuro.

## 4. Paleta e Identidade

A paleta deve ser extraída da Revista IRC e refinada para web.

Direção provável, a partir da referência visual da revista:

- base branca ou cinza muito clara, mais técnica que bege;
- azul acinzentado/grafite para títulos e autoridade;
- cinzas médios para tarjas editoriais, rodapés e boxes;
- acentos quentes muito discretos, apenas quando necessários;
- uso moderado de preto;
- bastante branco para leitura confortável e aparência profissional.

Antes da implementação, criar um documento específico:

`revista/IDENTIDADE_VISUAL_REVISTA_IRC.md`

Esse documento deve registrar:

- cores;
- fontes ou famílias equivalentes;
- estilo de títulos;
- estilo de rodapés;
- botões;
- cartões;
- tratamento de imagens;
- exemplos de uso.

## 5. Estrutura do MVP

### 5.1 Início

Função: apresentar a promessa institucional em poucos segundos.

Conteúdo:

- chamada principal com a frase-guia;
- subtítulo explicando o Instituto;
- destaque para Revista IRC;
- acesso para Instituto, Revista, Biblioteca e Contato;
- bloco visual “ontem conversa com hoje”.

CTA principal:

- “Conheça a Revista IRC” ou “Conheça o Instituto”.

Evitar no MVP:

- “Use a calculadora”;
- “Assine agora”;
- “Área premium”;
- promessas de curso ou app.

### 5.2 Instituto

Função: explicar origem, missão e valores.

Conteúdo:

- quem foi Roy W. Carlson;
- por que seu nome orienta o Instituto;
- relação com concreto massa, instrumentação e grandes obras;
- ligação com Brasil, Itaipu e formação técnica;
- missão institucional;
- lema “Valor e Eficiência em Concreto”.

### 5.3 Revista IRC

Função: tornar a revista o ativo editorial visível do Instituto.

Conteúdo:

- apresentação da Revista IRC;
- capa ou mock visual da edição piloto;
- texto editorial curto;
- link para PDF ou página da edição;
- lista futura de edições;
- chamada para apoiadores/anunciantes.

### 5.4 Biblioteca e Memória Técnica

Função: organizar o acervo sem prometer uma biblioteca completa.

Conteúdo inicial:

- documentos disponíveis;
- homenagens;
- textos biográficos;
- PDFs selecionados;
- referências técnicas;
- materiais em preparação.

Texto de cuidado:

> A biblioteca está em organização e será ampliada progressivamente.

### 5.5 Parceiros, Apoiadores e Anunciantes

Função: abrir espaço institucional para pessoas, empresas e entidades ligadas ao Instituto.

Conteúdo:

- parceiros acadêmicos quando houver autorização e clareza;
- apoiadores;
- anunciantes;
- empresas amigas;
- futura empresa de engenharia/consultoria como parceira separada.

Importante: evitar afirmar parceria formal quando houver apenas relação técnica, amizade ou referência histórica.

### 5.6 Contato

Função: permitir contato institucional simples.

Conteúdo:

- e-mail;
- formulário simples ou link de contato;
- LinkedIn quando existir;
- mensagem para apoiadores, leitores, autores e parceiros.

## 6. Navegação

Menu inicial recomendado:

- Início
- Instituto
- Revista IRC
- Biblioteca
- Parceiros
- Contato

Se necessário, “Biblioteca” pode se chamar “Memória Técnica” no primeiro momento.

## 7. Conteúdo Que Fica Fora do MVP

Não entram na primeira versão:

- blog completo;
- área logada;
- plano free/advanced/premium;
- calculadora térmica;
- sistema de assinatura;
- curso;
- loja;
- comunidade;
- fórum;
- dashboard;
- relatórios;
- pagamento.

Esses itens devem ficar documentados como possibilidades futuras, não como páginas vazias.

## 8. Tecnologia

Escolher tecnologia simples, estável e fácil de publicar.

Critérios:

- site rápido;
- manutenção simples;
- bom controle visual;
- facilidade de hospedar;
- sem backend obrigatório no MVP;
- bom suporte a imagens, PDFs e páginas estáticas.

Opções adequadas:

- site estático bem feito;
- React/Vite simples;
- Next.js apenas se houver necessidade real de rotas e evolução futura.

Evitar complexidade inicial:

- banco de dados;
- autenticação;
- pagamentos;
- CMS pesado;
- backend próprio.

## 9. Scrollytelling, 3D e Efeitos

O efeito inovador desejado é uma experiência de scrollytelling com profundidade visual.

A rolagem deve contar a história:

> arquivo técnico → obra real → dados de engenharia → presença institucional contemporânea.

Ideias:

- seção sticky em que páginas de revista, fotos de barragem, grelhas técnicas e cartões de interface se movem em pseudo-3D;
- fotos enormes em transições full-bleed, com parallax, escala e crossfade, para dar sensação de grande obra e mudança de capítulo;
- cursor customizado e microinterações nos elementos de navegação, desde que haja fallback acessível;
- hexágonos interativos que se abrem no hover/touch para revelar pilares do Instituto, sugerindo concreto, estrutura e sistema;
- parallax avançado com camadas em velocidades diferentes;
- textura física de revista/documento combinada com linhas de instrumentação e curvas técnicas;
- transição visual de “arquivo” para “interface”;
- números de página/rodapés inspirados na revista;
- destaque visual para “ontem”, “hoje” e “mundo”.

Pode ser implementado com CSS 3D, JavaScript leve, WebGL/Three.js ou biblioteca de animação, desde que:

- carregue rápido;
- funcione bem em desktop e mobile;
- mantenha acessibilidade;
- não vire espetáculo vazio;
- ajude a contar a história institucional.

Regra:

> se o efeito atrapalhar leitura, desempenho ou clareza institucional, ele deve ser simplificado.

## 10. Tom de Voz

O texto deve ser:

- institucional;
- técnico;
- humano;
- preciso;
- sem exageros;
- sem prometer o que ainda não existe.

Evitar:

- “único no mundo” sem comprovação explícita;
- promessas comerciais agressivas;
- projeções financeiras;
- linguagem de startup;
- excesso de jargão.

Preferir:

- “memória técnica”;
- “valor e eficiência”;
- “engenharia brasileira”;
- “concreto massa”;
- “legado”;
- “revista”;
- “biblioteca”;
- “do Brasil para o mundo”.

## 11. Critério de Pronto

O site estará pronto para a primeira publicação quando:

- a home explicar o Instituto em linguagem clara;
- a Revista IRC estiver visível;
- houver uma página institucional consistente;
- houver uma seção de biblioteca/memória sem parecer vazia;
- contato estiver funcionando;
- a identidade visual lembrar a revista;
- nenhuma página prometer app, curso, premium ou consultoria que ainda não estão estruturados.

## 12. Próxima Etapa de Arquitetura

Depois de aprovada esta arquitetura, a próxima etapa é produzir:

- mapa de páginas definitivo;
- textos de cada página;
- identidade visual documentada;
- escolha técnica do site;
- implementação do MVP.
