# CONTEXTO E TAREFAS — Instituto Roy Carlson

> **Arquivo do coordenador.** Qualquer agente ou sessão deve ler este arquivo primeiro para continuar o trabalho. Atualize-o ao concluir tarefas ou ao passar o bastão.

**Última atualização**: 08/02/2026

---

## 1. O QUE É ESTE PROJETO

- **Repositório**: ycp (Instituto Roy Carlson)
- **Objetivo**: Site institucional + App Web de análise térmica de concreto (calculadora gratuita → assinatura → cursos → consultoria)
- **Documentos estratégicos**: `Apresentação-Completa-do-Site/` (PESQUISA, RESUMO_EXECUTIVO, PLANO_ESTRATÉGICO)
- **Versões preservadas**: pasta `_versoes/` — cada subpasta por data guarda snapshot dos documentos daquele dia/agente

---

## 2. O QUE JÁ FOI FEITO

| Data | Agente/Sessão | Entregas |
|------|----------------|----------|
| 08/02/2026 | Agente Planejamento Estratégico | Deep Research (PESQUISA.md), revisão do RESUMO_EXECUTIVO.md e do PLANO_ESTRATEGICO_INSTITUTO_ROY_CARLSON.md; criação de CONTEXTO_E_TAREFAS.md e arquivo de versões em _versoes/2026-02-08/ |

---

## 3. ONDE ESTÁ CADA COISA

| Conteúdo | Caminho |
|----------|---------|
| Contexto e tarefas (este arquivo) | `/CONTEXTO_E_TAREFAS.md` |
| Pesquisa e plano estratégico (versão de trabalho) | `/Apresentação-Completa-do-Site/` |
| Versões guardadas por data | `/_versoes/AAAA-MM-DD/` — ver README dentro de `_versoes` |
| Conteúdo do site (textos, páginas) | `/site-contents/` |
| App Next.js do site | `/site/instituto-roy-carlson/` |
| Imagens, biblioteca | `/imagens/`, `/biblioteca/` |

---

## 4. TAREFAS NA FILA (PARA O PRÓXIMO AGENTE)

Ordem sugerida. Marque com [x] ao concluir.

### Prioridade alta
- [ ] Definir stack do App Web (TypeScript no Next.js vs Python FastAPI)
- [ ] Implementar solução analítica da laje infinita (backend/API)
- [ ] Interface da calculadora térmica gratuita (frontend)
- [ ] Landing page com calculadora como hero

### Prioridade média
- [ ] Sistema de assinatura (Stripe ou PagSeguro/Asaas)
- [ ] Área logada com modelos completos (muro, laje fundação, etc.)
- [ ] Fitting-curve (upload CSV → extração de parâmetros)
- [ ] Gravar módulo 1 do curso de dosagem (apostila como base)

### Prioridade baixa / depois
- [ ] Blog técnico (2–3 artigos)
- [ ] Sequência de email marketing
- [ ] Modelo de pós-resfriamento no App
- [ ] Solução do tubulão térmico no App

---

## 5. DECISÕES PENDENTES (PRECISAM DO FLÁVIO)

- **Motor de cálculo**: TypeScript (Next.js) ou Python (FastAPI)?
- **Plataforma de cursos**: Hotmart/Eduzz ou área própria no site?
- **Gateway de pagamento**: Stripe (internacional) ou Asaas/PagSeguro (nacional)?
- **Prioridade de implementação**: App Web primeiro ou Curso de Dosagem primeiro?

---

## 6. DECISÕES JÁ TOMADAS

- Estratégia: funil em 4 degraus (gratuito → assinatura → cursos → consultoria)
- Isca gratuita: calculadora térmica da laje infinita, resultado em < 1 s, sem login
- Versões de documentos: guardar em `_versoes/AAAA-MM-DD/`; não sobrescrever

---

## 7. COMO USAR ESTE ARQUIVO

1. **Ao iniciar uma sessão**: Leia CONTEXTO_E_TAREFAS.md para saber o estado do projeto e a fila de tarefas.
2. **Ao concluir uma tarefa**: Marque [x] na seção 4 e, se relevante, registre em "O que já foi feito" (seção 2).
3. **Ao passar o bastão**: Atualize "Última atualização" no topo; opcionalmente descreva em 1–2 linhas o que fez e o que recomenda fazer em seguida.
4. **Ao criar versões**: Copie documentos relevantes para `_versoes/AAAA-MM-DD/` e, se quiser, anote no README da pasta qual agente/sessão gerou.

---

*Instituto Roy Carlson — Controle de contexto e tarefas*
