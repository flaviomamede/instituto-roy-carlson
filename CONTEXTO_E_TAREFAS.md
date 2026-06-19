# CONTEXTO E TAREFAS — Instituto Roy Carlson

> **Arquivo do coordenador.** Qualquer agente ou sessão deve ler este arquivo primeiro para continuar o trabalho. Atualize-o ao concluir tarefas ou ao passar o bastão.

**Última atualização**: 16/06/2026

---

## 1. O QUE É ESTE PROJETO

- **Repositório**: ycp (Instituto Roy Carlson)
- **Objetivo atual**: Site institucional do Instituto Roy Carlson, com foco em legado, revista, biblioteca, referências técnicas e parcerias. A empresa de engenharia/consultoria deve ser tratada separadamente.
- **Documentos-mestre a reescrever**: `PESQUISA.md`, `RESUMO_EXECUTIVO.md`, `PLANO_ESTRATEGICO.md`, `ARQUITETURA_SITE.md` na raiz. Estes vieram da antiga pasta `Apresentação-Completa-do-Site/`, mas estão desatualizados e devem ser reescritos para a nova direção.
- **Versões preservadas**: pasta `_versoes/` — cada subpasta por data guarda snapshot dos documentos daquele dia/agente

---

## 2. O QUE JÁ FOI FEITO

| Data | Agente/Sessão | Entregas |
|------|----------------|----------|
| 08/02/2026 | Agente Planejamento Estratégico | Deep Research (PESQUISA.md), revisão do RESUMO_EXECUTIVO.md e do PLANO_ESTRATEGICO_INSTITUTO_ROY_CARLSON.md; criação de CONTEXTO_E_TAREFAS.md e arquivo de versões em _versoes/2026-02-08/ |
| 23/04/2026 | Antigravity | Escaneamento (OCR) do documento "Dr. Roy W. Carlson's 85th Birthday - REMINISCENCES.pdf" e extração de texto para arquivo .txt na biblioteca. |
| 25/04/2026 | GPT-5.5 | Reorganização inicial: conteúdos consultivos movidos para `empresa-consultoria/`, conteúdo descartado arquivado em `_arquivo/`, referência biográfica de Roy Carlson movida para `site-contents/`, protótipo Next.js do Manus.AI arquivado em `_arquivo/prototipos/manus-ai-site-next/`, HTMLs antigos movidos para `_arquivo/prototipos/claude-site-html/`, e quatro documentos-mestre movidos para a raiz. |
| 25/04/2026 | GPT-5.5 | Limpeza do repositório: removidos `site/`, `site-contents/`, `site-fase1/`, `scratch/`, `Apresentação-Completa-do-Site/`, zip antigo e `README.md` desatualizado. Reescritos `RESUMO_EXECUTIVO.md`, `PLANO_ESTRATEGICO.md` e `ARQUITETURA_SITE.md` para a nova direção institucional. |
| 16/06/2026 | Auto | Revista Vol. 1: repositório web `site/revista/`, flipbook com gate de leads, site antigo em `site-old/`, Vercel (`site/vercel.json`). Periodicidade trimestral e endereço Magnificat no expediente. |

---

## 3. ONDE ESTÁ CADA COISA

| Conteúdo | Caminho |
|----------|---------|
| Contexto e tarefas (este arquivo) | `/CONTEXTO_E_TAREFAS.md` |
| Documentos-mestre atuais | `/RESUMO_EXECUTIVO.md`, `/PLANO_ESTRATEGICO.md`, `/ARQUITETURA_SITE.md`, `/PESQUISA.md` |
| Versões legadas/alternativas geradas por outras IAs | `/_versoes/` — manter para consulta, sem tratar como fonte principal |
| Conteúdo separado para futura empresa de engenharia/consultoria | `/empresa-consultoria/site-contents/` |
| Protótipo Next.js antigo (Manus.AI), apenas referência técnica | `/_arquivo/prototipos/manus-ai-site-next/app/` |
| Protótipo HTML antigo, provavelmente Claude | `/_arquivo/prototipos/claude-site-html/` |
| Conteúdo descartado, preservado por segurança | `/_arquivo/conteudos-descartados/` |
| Imagens, biblioteca | `/imagens/`, `/biblioteca/` |
| Revista IRC (materiais e PDF) | `/revista/` |
| Site antigo Next.js (arquivo) | `/site-old/` |
| Site novo (Revista IRC + Vercel) | `/site/` |
| Checklist DOI / ISSN | `/revista/CHECKLIST_DOI_ISSN.md` |
| Protótipo visual do site institucional | `/prototipo-site-irc/` |

---

## 4. TAREFAS NA FILA (PARA O PRÓXIMO AGENTE)

Ordem sugerida. Marque com [x] ao concluir.

### Prioridade alta
- [x] Reescrever `RESUMO_EXECUTIVO.md` com a nova direção: site institucional primeiro, Revista IRC como ativo editorial e empresa de consultoria separada.
- [x] Reescrever `PLANO_ESTRATEGICO.md` com fases simples e executáveis.
- [x] Reescrever `ARQUITETURA_SITE.md` para o novo site institucional.
- [ ] Revisar `PESQUISA.md`, mantendo apenas o que ajuda o planejamento atual.

### Prioridade média
- [ ] Criar documento de identidade visual baseado na Revista IRC.
- [x] Criar repositório web da Revista IRC (`site/revista/`) com páginas exigidas pelo CBISSN.
- [ ] Publicar `site/revista/` online e informar URL à eDOC BRASIL (registro Crossref do DOI).
- [ ] Remover marca "VERSÃO RASCUNHO" do PDF final; completar expediente (endereço, conselho editorial).
- [ ] Preencher formulário ISSN no CBISSN e gerar PDF de capturas de tela (máx. 2 MB).
- [ ] Definir a estrutura inicial do site: Institucional, Revista IRC, Biblioteca, Referências, Parceiros/Anunciantes e Contato.

### Prioridade baixa / depois
- [ ] Avaliar se e quando haverá áreas `free`, `advanced` e `premium`.
- [ ] Avaliar LinkedIn e calendário simples de postagens.
- [ ] Planejar a futura empresa de engenharia/consultoria em separado.

---

## 5. DECISÕES PENDENTES (PRECISAM DO FLÁVIO)

- **Nome e posicionamento da empresa de engenharia/consultoria**.
- **Escopo inicial da Revista IRC no site**: estrutura mínima criada em `site/revista/` (apresentação, expediente, normas, edições, artigos). Falta publicar online e integrar ao site institucional definitivo.
- **Periodicidade oficial da Revista IRC** para o formulário ISSN.
- **Endereço completo da Editora Magnificat** para expediente.
- **Como tratar anunciantes, apoiadores e empresas amigas** no site institucional.
- **Quando retomar calculadora, cursos, assinaturas e área premium**.

---

## 6. DECISÕES JÁ TOMADAS

- O site começa como **institucional**, não como app/calculadora.
- O Instituto Roy Carlson e a futura empresa de engenharia/consultoria devem ser tratados separadamente.
- A Revista IRC é um ativo central do Instituto e também referência visual para o site.
- Os quatro documentos-mestre ficam na raiz e serão reescritos: `PESQUISA.md`, `RESUMO_EXECUTIVO.md`, `PLANO_ESTRATEGICO.md`, `ARQUITETURA_SITE.md`.
- Versões de documentos: guardar em `_versoes/AAAA-MM-DD/`; não sobrescrever

---

## 7. COMO USAR ESTE ARQUIVO

1. **Ao iniciar uma sessão**: Leia CONTEXTO_E_TAREFAS.md para saber o estado do projeto e a fila de tarefas.
2. **Ao concluir uma tarefa**: Marque [x] na seção 4 e, se relevante, registre em "O que já foi feito" (seção 2).
3. **Ao passar o bastão**: Atualize "Última atualização" no topo; opcionalmente descreva em 1–2 linhas o que fez e o que recomenda fazer em seguida.
4. **Ao criar versões**: Copie documentos relevantes para `_versoes/AAAA-MM-DD/` e, se quiser, anote no README da pasta qual agente/sessão gerou.

---

*Instituto Roy Carlson — Controle de contexto e tarefas*
