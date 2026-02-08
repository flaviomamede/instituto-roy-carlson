# PLANO ESTRATÉGICO — Instituto Roy Carlson
## Versão 2.0 — Início Mínimo, Receita Recorrente, Crescimento Sustentável

> *Data: 08/02/2026 | Fundamentado em Deep Research e análise competitiva*

---

## PARTE 1 — DIAGNÓSTICO ESTRATÉGICO

### 1.1 Posição Atual

O Instituto Roy Carlson possui ativos intelectuais de altíssimo valor que estão **sub-monetizados**. A combinação de:

- 28 anos de experiência em grandes obras (Furnas/Eletrobrás)
- Formação acadêmica em nível de pós-doutorado
- Soluções analíticas inéditas para problemas térmicos de concreto
- Modelo termo-viscoelástico com envelhecimento inserido em 2 softwares
- Tecnologia de dosagem para IL < 5 em todos os tipos de concreto
- Rede de parceiros de pesquisa de classe mundial (COPPE, USP, UFC)

...é **única no mundo**. Nenhum concorrente identificado possui essa combinação.

### 1.2 Análise SWOT

#### Forças
- Soluções analíticas inéditas (barreira intelectual intransponível)
- Experiência prática validada em obras reais (28 anos, barragens)
- Rede acadêmica de primeiro escalão (Fairbairn, Romildo, Pileggi, Jorge Soares)
- Apostila e experiência com cursos (produto pronto)
- Site institucional já existente (Next.js)
- Baixo custo operacional (conhecimento = produto)

#### Fraquezas
- Operação individual (gargalo de tempo e escala)
- Falta de produto digital recorrente operacional
- Marca ainda em construção no mercado digital
- Sem base de emails/leads estruturada

#### Oportunidades
- Mercado global de UHPC: US$ 689M → US$ 1.167M até 2034
- Pressão ESG: construtoras precisam reduzir CO₂ no concreto
- Ferramentas SaaS de engenharia em expansão (MixDesignCalc: 50K+ usuários)
- Nenhum concorrente oferece soluções analíticas térmicas em tempo real
- Demanda por cursos técnicos online crescente pós-pandemia
- RILEM/ACI publicando cada vez mais sobre modelagem térmica

#### Ameaças
- IA generativa pode commoditizar conhecimento superficial
- Empresas como Concrete.ai com funding pesado (mas foco diferente)
- Dependência de regulamentações pode atrasar adoção
- Pirataria de conteúdo educacional

### 1.3 Análise Competitiva Detalhada

| Concorrente | O que faz | O que NÃO faz (nossa vantagem) |
|---|---|---|
| MixDesignCalc.cloud | Dosagem por normas (ACI, EC, BS) | Não resolve problemas térmicos |
| Concrete.ai | Otimização com IA para produtores | Não tem soluções analíticas, não ensina |
| Solvebility.com | Calculadora gratuita básica | Sem modelo térmico, sem viscoelasticidade |
| DIANA FEA / ANSYS | Software de elementos finitos | Caro (>US$10K/ano), lento, requer expertise |
| Consultorias tradicionais | Laudos sob demanda | Sem ferramenta self-service, sem escala |
| **Instituto Roy Carlson** | **Tudo acima + soluções inéditas** | **Nosso diferencial é ser o único** |

---

## PARTE 2 — MODELO DE NEGÓCIO

### 2.1 Proposta de Valor Central

> **"Transformar 28 anos de experiência e soluções analíticas inéditas em ferramentas digitais acessíveis que resolvem problemas reais de engenharia do concreto em tempo real."**

### 2.2 Arquitetura de Receita

```
                    ┌─────────────────────┐
                    │   CONSULTORIA        │  R$ 5K-50K+/projeto
                    │   (Alto Valor)       │  3-4/ano
                    └─────────┬───────────┘
                              │
                    ┌─────────┴───────────┐
                    │   CURSOS ONLINE      │  R$ 497-1.997/módulo
                    │   (Escalável)        │  4+ turmas/ano
                    └─────────┬───────────┘
                              │
                    ┌─────────┴───────────┐
                    │   APP WEB PAGO       │  R$ 49-97/mês
                    │   (Recorrente)       │  Meta: 200+ assinantes
                    └─────────┬───────────┘
                              │
              ┌───────────────┴───────────────┐
              │    CALCULADORA GRATUITA         │  Gratuito
              │    (Funil de Aquisição)         │  Meta: 5.000+ usuários
              └────────────────────────────────┘
```

### 2.3 Detalhamento dos Produtos

#### PRODUTO 0: Calculadora Térmica Gratuita (Isca)

**Conceito**: O engenheiro acessa o site, preenche 4-5 campos e recebe instantaneamente a previsão de temperatura máxima e risco de fissuração da sua peça de concreto.

**Input do usuário**:
- Tipo de cimento (CPV, CPII, CPIII, CPIV)
- Consumo de cimento (kg/m³) ou resistência desejada
- Espessura da peça (m)
- Temperatura ambiente (°C)
- Tipo de forma (madeira, aço, solo)

**Output gratuito**:
- Temperatura máxima estimada (°C)
- Tempo até o pico (horas)
- Gradiente térmico máximo (°C/m)
- Semáforo de risco: VERDE (ok) / AMARELO (atenção) / VERMELHO (crítico)
- **Mensagem**: "Para ver a evolução completa no tempo, recomendações de mitigação e relatório profissional, assine o plano Profissional."

**Base científica**: Solução analítica da laje infinita com geração interna de calor (problema de Fourier com fonte).

**Tecnologia**:
- Frontend: React/Next.js (extensão do site existente)
- Backend: API com a solução analítica implementada (Node.js ou Python)
- Sem banco de dados para versão gratuita (stateless)
- Tempo de resposta: < 1 segundo

**KPIs**:
- Usuários únicos/mês
- Taxa de conversão gratuito → pago
- Tempo médio de sessão
- Compartilhamentos

---

#### PRODUTO 1: App Web Profissional (Assinatura Mensal)

**Plano Básico — R$ 49/mês**
- Solução analítica para laje infinita com todos os parâmetros
- Evolução temporal completa de temperatura
- Relatório PDF básico
- 5 projetos salvos/mês
- Suporte por email

**Plano Profissional — R$ 97/mês**
- Todos os modelos analíticos:
  - Laje infinita
  - Laje de fundação (condições mistas: solo + ar)
  - Muro de arrimo
  - Pós-resfriamento por tubulação
  - (Futuro: Tubulão térmico)
- **Fitting-curve**: Upload de dados de campo → extração automática de:
  - Parâmetros térmicos do concreto
  - Geração interna de calor
  - Energia de ativação
- Relatórios profissionais completos com selo IRC
- Projetos ilimitados
- Materiais técnicos exclusivos (notas, artigos)
- Suporte prioritário

**Stack tecnológica**:
- Frontend: Next.js + TailwindCSS + Charts (Recharts ou D3.js)
- Backend: Next.js API Routes ou serviço Python (FastAPI)
- Cálculos: Implementação das soluções analíticas em TypeScript ou Python (NumPy/SciPy)
- Fitting: Levenberg-Marquardt ou outros algoritmos de otimização
- Auth: NextAuth.js
- Pagamentos: Stripe ou PagSeguro/Asaas
- Deploy: Vercel ou AWS
- Banco de dados: PostgreSQL (Supabase ou PlanetScale)

---

#### PRODUTO 2: Cursos Online

**Módulo 1 — Dosagem de Concreto (R$ 497)**
- Base: Apostila existente
- Formato: 8 videoaulas (gravadas) + PDF + exercícios
- Duração total: ~8 horas
- Certificado do Instituto Roy Carlson
- Acesso por 12 meses
- Plataforma: Hotmart, Eduzz, ou área própria no site

**Módulo 2 — Análise Térmica de Concreto Massa (R$ 997)**
- Pré-requisito: Módulo 1 ou experiência equivalente
- Usa o App Web como ferramenta didática
- Casos reais: UHE Batalha, Itaipu, lajes de fundação
- Teoria das soluções analíticas (sem revelar implementação)
- 12 videoaulas + material complementar
- Acesso por 12 meses

**Módulo 3 — Concretos de Altíssima Eficiência (R$ 1.997)**
- IL < 5 para: CCR, SCC, UHPC, concreto leve, nanotubos de carbono
- Masterclass com Flávio Mamede (ao vivo, gravada para acesso futuro)
- Dosagem prática passo a passo
- Sustentabilidade e descarbonização
- 16 videoaulas + workshops gravados
- Acesso por 24 meses

**Módulo 4 (Futuro) — Modelagem Termo-Viscoelástica (R$ 2.997)**
- Teoria completa do modelo com envelhecimento
- Implementação computacional
- Validação com dados de obras reais
- Para pesquisadores e engenheiros avançados

---

#### PRODUTO 3: Consultoria Especializada

| Serviço | Faixa de Preço | Prazo |
|---|---|---|
| Dosagem personalizada IL < 5 | R$ 5.000-15.000 | 2-4 semanas |
| Análise térmica de obra (analítica) | R$ 3.000-8.000 | 1-2 semanas |
| Modelagem FEM completa | R$ 15.000-50.000 | 4-8 semanas |
| Treinamento on-site (equipe) | R$ 8.000-20.000 | 2-3 dias |
| Acompanhamento de obra | R$ 10.000-30.000/mês | Contínuo |
| Laudo técnico especializado | R$ 5.000-15.000 | 2-4 semanas |

---

## PARTE 3 — ESTRATÉGIA DE CRESCIMENTO

### 3.1 Fase 1: Fundação (Meses 1-3)

**Objetivo**: Lançar MVP da calculadora gratuita e começar a gerar leads.

| Semana | Ação | Entregável |
|---|---|---|
| 1-2 | Definir arquitetura, implementar solução analítica no backend | API funcional |
| 3-4 | Desenvolver interface da calculadora + landing page | MVP online |
| 5-6 | Sistema de assinatura + área logada (Degrau 1) | Monetização ativa |
| 7-8 | Gravar módulo 1 do curso de dosagem | Curso disponível |
| 9-10 | Blog técnico (2-3 artigos) + email marketing | Conteúdo + leads |
| 11-12 | Iterar com feedback + campanha LinkedIn | Crescimento orgânico |

**Investimento estimado**: R$ 2.000-5.000 (infraestrutura cloud + ferramentas)

**Metas da Fase 1**:
- 500+ usuários da calculadora gratuita
- 30+ assinantes pagos
- 1 turma de curso de dosagem (20+ alunos)
- 1 consultoria fechada

### 3.2 Fase 2: Tração (Meses 4-6)

**Objetivo**: Validar product-market fit e escalar canais de aquisição.

- Adicionar modelos analíticos restantes ao App Web (muro, fundação, pós-resfriamento)
- Implementar fitting-curve
- Lançar módulo 2 (Análise Térmica)
- Parcerias com influenciadores de engenharia (YouTube, LinkedIn)
- Webinars gratuitos mensais (demonstração do App)
- Artigos no LinkedIn sobre problemas térmicos em concreto
- Buscar parceria com IBRACON ou ABESC para visibilidade

**Metas da Fase 2**:
- 2.000+ usuários da calculadora
- 100+ assinantes pagos
- 2 turmas de curso
- 2-3 consultorias

### 3.3 Fase 3: Escala (Meses 7-12)

**Objetivo**: Estabelecer receita recorrente estável e expandir portfólio.

- Lançar módulo 3 (Concretos de Altíssima Eficiência)
- Desenvolver solução do tubulão térmico no App Web
- Internacionalização: traduzir calculadora para inglês e espanhol
- Programa de afiliados (engenheiros indicam e ganham comissão)
- White-label para concreteiras (personalização do App com marca do cliente)
- Publicação de artigo científico sobre as soluções analíticas (com parceiros)

**Metas da Fase 3**:
- 5.000+ usuários da calculadora
- 200+ assinantes pagos
- Pipeline de consultoria contínuo
- Receita mensal: R$ 40.000-60.000

---

## PARTE 4 — MARKETING E AQUISIÇÃO

### 4.1 Canais Prioritários

| Canal | Ação | Custo | Impacto Esperado |
|---|---|---|---|
| **LinkedIn** | Posts técnicos 3x/semana, artigos longos 1x/semana | R$ 0 | Alto (engenheiros ativos) |
| **YouTube** | Vídeos curtos sobre problemas térmicos | R$ 0-500 | Médio-Alto |
| **Google (SEO)** | Blog otimizado: "temperatura máxima concreto", "fissuração térmica" | R$ 0 | Alto (longo prazo) |
| **IBRACON** | Artigos na revista, participação em congressos | R$ 500-2.000 | Alto (credibilidade) |
| **Email** | Sequência automatizada pós-uso da calculadora | R$ 100/mês | Alto (conversão) |
| **Parcerias** | Universidades, concreteiras, fabricantes de cimento | R$ 0 | Alto (B2B) |
| **Google Ads** | Campanhas para palavras-chave técnicas | R$ 500-2.000/mês | Médio |

### 4.2 Estratégia de Conteúdo

**Pilares de conteúdo**:

1. **Educacional**: "O que todo engenheiro precisa saber sobre temperatura no concreto"
2. **Técnico**: "Como prever a temperatura máxima de uma laje de fundação"
3. **Caso real**: "Como evitamos fissuração na UHE Batalha"
4. **Inovação**: "Concreto com IL < 5: o futuro sustentável"
5. **Ferramenta**: "Demonstração: calculadora térmica em ação"

**Frequência**: 3 posts curtos (LinkedIn) + 1 artigo longo (blog/LinkedIn) + 1 vídeo por semana

### 4.3 Funil de Conversão

```
VISITANTE (SEO, LinkedIn, YouTube)
    ↓
USA CALCULADORA GRATUITA (captura email)
    ↓ 10-15% conversão
ASSINA PLANO BÁSICO (R$ 49/mês)
    ↓ 30-40% upgrade
ASSINA PLANO PROFISSIONAL (R$ 97/mês)
    ↓ 20-30% compram
CURSO ONLINE (R$ 497-1.997)
    ↓ 5-10% avançam
CONSULTORIA (R$ 5.000-50.000)
```

---

## PARTE 5 — PRODUTO DIGITAL: APP WEB TÉRMICO

### 5.1 Visão do Produto

O App Web é o **core product** do Instituto Roy Carlson — uma ferramenta que transforma soluções analíticas inéditas em cálculos instantâneos acessíveis via navegador.

### 5.2 Funcionalidades por Release

#### Release 1 (MVP — Semana 4)
- Calculadora da laje infinita (gratuita)
- Input: cimento, consumo, espessura, T ambiente
- Output: T máxima, tempo ao pico, semáforo de risco
- Gráfico de evolução temporal
- Captura de email

#### Release 2 (Pago — Semana 6)
- Login e assinatura
- Modelos adicionais: muro de arrimo, laje de fundação
- Relatório PDF exportável
- Histórico de projetos

#### Release 3 (Fitting — Mês 4)
- Upload de dados de temperatura (CSV/Excel)
- Fitting-curve automático (Levenberg-Marquardt)
- Extração de parâmetros:
  - Condutividade térmica
  - Calor específico
  - Geração interna de calor (curva adiabática)
  - Energia de ativação
- Comparação modelo vs. medição (gráfico overlay)

#### Release 4 (Pós-resfriamento — Mês 6)
- Modelo de pós-resfriamento por tubulação
- Otimização do espaçamento e vazão
- Análise de custo-benefício do sistema de resfriamento

#### Release 5 (Tubulão Térmico — Mês 9-12)
- Solução completa do tubulão térmico
- De um termômetro → todos os parâmetros
- Interface wizard (passo a passo guiado)
- Potencialmente o produto mais disruptivo

### 5.3 Arquitetura Técnica

```
┌─────────────────────────────────────────┐
│           FRONTEND (Next.js)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Calculad. │ │Dashboard │ │ Fitting  │ │
│  │ Gratuita │ │  Projetos│ │  Curve   │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ │
│       └─────────────┼────────────┘       │
│                     │ API Calls          │
└─────────────────────┼───────────────────┘
                      │
┌─────────────────────┼───────────────────┐
│           BACKEND (API)                  │
│  ┌──────────────────┴──────────────────┐ │
│  │       Motor de Cálculo              │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐  │ │
│  │  │ Laje   │ │ Muro   │ │ Pós-   │  │ │
│  │  │Infinita│ │Arrimo  │ │Resfr.  │  │ │
│  │  └────────┘ └────────┘ └────────┘  │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐  │ │
│  │  │ Laje   │ │Tubulão │ │Fitting │  │ │
│  │  │Fundação│ │Térmico │ │ Curve  │  │ │
│  │  └────────┘ └────────┘ └────────┘  │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Auth    │ │Pagamento │ │    DB    │ │
│  │(NextAuth)│ │ (Stripe) │ │(Postgres)│ │
│  └──────────┘ └──────────┘ └──────────┘ │
└──────────────────────────────────────────┘
```

---

## PARTE 6 — CREDIBILIDADE E PARCERIAS

### 6.1 Rede Acadêmica como Ativo Estratégico

| Parceiro | Instituição | Como alavancar |
|---|---|---|
| Eduardo Fairbairn | COPPE/UFRJ | Co-autoria, prefácio de curso, selo RILEM |
| Romildo Toledo Filho | COPPE/UFRJ | Validação de concretos especiais, eco-cimentos |
| Rafael Pileggi | USP | Reologia, dosagem avançada, conteúdo de curso |
| Jorge Barbosa Soares | UFC | Mecânica da fratura, co-autoria, rede nordeste |
| Flávio Vasconcelos | UFC | Viscoelasticidade, modelagem constitutiva |
| Miguel Azenha | U. Minho | Internacionalização, rede europeia, RILEM |

### 6.2 Publicações Estratégicas (Ano 1)

1. **Artigo científico**: Apresentar as soluções analíticas inéditas em periódico indexado (ex: *Engineering Structures*, *Cement and Concrete Research*, ou *RIEM/IBRACON*)
   - Coautores: Fairbairn, parceiros UFC
   - Efeito: validação acadêmica + visibilidade + SEO

2. **Artigo técnico IBRACON**: Demonstrar aplicação prática das soluções em obras reais
   - Efeito: alcance no mercado brasileiro de concreto

3. **Nota técnica no blog**: Versão acessível das soluções para engenheiros de obra
   - Efeito: SEO + geração de leads

### 6.3 Selos e Validações

- "Metodologia validada em obras: UHE Batalha, Itaipu, Serra da Mesa"
- "Publicado em Engineering Structures (Elsevier)"
- "Parceria acadêmica: COPPE/UFRJ, USP, UFC"
- "Membro da rede RILEM (via Fairbairn/Azenha)"

---

## PARTE 7 — FINANCEIRO

### 7.1 Custos Fixos Mensais (Estimativa)

| Item | Custo/mês |
|---|---|
| Hospedagem cloud (Vercel Pro ou AWS) | R$ 100-300 |
| Domínio + Email profissional | R$ 50 |
| Ferramentas SaaS (email marketing, analytics) | R$ 200-400 |
| Gateway de pagamento (% sobre vendas) | Variável |
| **Total fixo** | **R$ 350-750/mês** |

### 7.2 Projeção de Receita

| Fonte | Mês 3 | Mês 6 | Mês 12 | Mês 24 |
|---|---|---|---|---|
| Assinaturas App Web | R$ 1.500 | R$ 7.000 | R$ 20.000 | R$ 50.000 |
| Cursos online | R$ 0 | R$ 5.000 | R$ 15.000 | R$ 30.000 |
| Consultoria | R$ 0 | R$ 10.000 | R$ 25.000 | R$ 40.000 |
| **Total/mês** | **R$ 1.500** | **R$ 22.000** | **R$ 60.000** | **R$ 120.000** |
| **Acumulado** | R$ 3.000 | R$ 60.000 | R$ 300.000 | R$ 1.200.000 |

### 7.3 Cenários

| Cenário | Mês 12 | Premissa |
|---|---|---|
| **Conservador** | R$ 30.000/mês | 100 assinantes, 2 turmas, 2 consultorias |
| **Base** | R$ 60.000/mês | 200 assinantes, 4 turmas, 4 consultorias |
| **Otimista** | R$ 120.000/mês | 500 assinantes, 8 turmas, 6 consultorias + white-label |

---

## PARTE 8 — RISCOS E MITIGAÇÃO

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Poucos usuários iniciais | Média | Alto | Conteúdo SEO + LinkedIn + webinars gratuitos |
| Baixa conversão free→pago | Média | Alto | Testar preços, melhorar UX, depoimentos |
| Gargalo de tempo (1 pessoa) | Alta | Médio | Automatizar o máximo, priorizar produtos digitais |
| Pirataria de curso | Média | Baixo | DRM leve, conteúdo atualizado, comunidade |
| Concorrente copia a ideia | Baixa | Médio | Soluções analíticas são inéditas + execução rápida |
| Bug no App Web | Média | Médio | Testes rigorosos, beta com engenheiros confiáveis |

---

## PARTE 9 — CRONOGRAMA RESUMIDO

```
MÊS 1-2 ──── MVP Calculadora Gratuita + Landing Page
MÊS 2-3 ──── Sistema de Assinatura + Modelos Pagos
MÊS 3-4 ──── Curso de Dosagem + Blog + Email Marketing
MÊS 4-5 ──── Fitting-Curve + Módulo Análise Térmica
MÊS 5-6 ──── Pós-resfriamento + Webinars + LinkedIn
MÊS 7-8 ──── Curso Concretos Eficientes + Parcerias
MÊS 9-10 ─── Tubulão Térmico + Internacionalização
MÊS 11-12 ── Escala: Afiliados + White-label + Artigo Científico
```

---

## PARTE 10 — PRÓXIMOS PASSOS IMEDIATOS

### Se aprovado, a execução começa com:

1. **Redesign do site** — Novo site focado no funil (calculadora como hero section)
2. **Implementação do motor de cálculo** — Solução analítica da laje infinita como API
3. **Interface do App Web** — Calculadora interativa com gráficos em tempo real
4. **Sistema de monetização** — Stripe/PagSeguro para assinaturas

### Decisões necessárias agora:

- [ ] **Linguagem do motor de cálculo**: TypeScript (integrado ao Next.js) ou Python (FastAPI separado)?
- [ ] **Plataforma de cursos**: Hotmart, ou área própria no site?
- [ ] **Gateway de pagamento**: Stripe (internacional) ou Asaas/PagSeguro (nacional)?
- [ ] **Prioridade**: App Web primeiro ou Curso de Dosagem primeiro?

---

## CONCLUSÃO

O Instituto Roy Carlson está sobre uma **mina de ouro intelectual**. O plano é simples:

1. **Dê algo de graça** que resolva um problema real → calculadora térmica
2. **Cobre por profundidade** → modelos completos + fitting + relatórios
3. **Ensine** → cursos online escaláveis
4. **Consulte** → projetos de alto valor

O investimento inicial é mínimo (< R$ 5.000). O potencial é de R$ 60.000+/mês em 12 meses. E o diferencial competitivo — soluções analíticas inéditas + 28 anos de experiência de obra — é **impossível de copiar**.

> *"A melhor maneira de prever o futuro é construí-lo."* — Adaptado do espírito de Roy Carlson.

---

*Instituto Roy Carlson — Tecnologia do Concreto com Ciência, Experiência e Inovação.*
