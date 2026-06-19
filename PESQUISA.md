# PESQUISA — Deep Research: Instituto Roy Carlson

> **Versão consolidada** — Síntese das contribuições de múltiplos agentes (Composer, GPT-5.2, GPT-5.2-Codex, Opus-4.6, Opus-4.6-Fast, Opus-4.6-Max-Fast, Auto, Sonnet-4.5)  
> **Data:** 08/02/2026 | **Revisão:** 11/02/2026 — Perfis Oscar, Pileggi, Flávio Souza, Azenha e Rui Faria atualizados

---

## 1. PERFIL DO FUNDADOR: Flávio Mamede Pereira Gomes

### 1.1 Formação e Trajetória

- **Mestrado:** "Concreto nas Primeiras Idades: Propriedades e Modelagem Termomecânica Simplificada" — UFG (2011), orientado por André Luiz Bortolacci Geyer
- **Doutorado:** "Comportamento exotérmico, viscoelástico com envelhecimento e termoativado do concreto massa na análise teórica e prática de tensões de origem térmica e da segurança quanto à fissuração" — UnB (2017), orientado por Lineu Pedroso, co-orientado por Eduardo Fairbairn. (não-concluído)
- **Nível de conhecimento:** Equivalente a doutorado em tecnologia de concreto
- **Experiência prática:** 28 anos em barragens e grandes obras pela Eletrobrás Furnas
- **Vínculo institucional:** anterior: Furnas Centrais Elétricas S.A. (Eletrobrás)

### 1.2 Publicações Identificadas

#### Artigos em Periódicos Internacionais

1. **GOMES, F.M.P. et al.** (2014). "Early-age behaviour of the concrete surrounding a turbine spiral case: Monitoring and thermo-mechanical modelling." *Engineering Structures*, v. 81, p. 442-453.
   - DOI: 10.1016/j.engstruct.2014.10.009
   - Coautores: Fairbairn (COPPE), Azenha (U. Minho), Faria (U. Porto), pesquisadores da UFC
   - Estudo abrangente: caracterização laboratorial + modelagem numérica + monitoramento in-situ na UHE Batalha

#### Artigos em Congressos

2. **GOMES, F.M.P. et al.** (2012). "Monitoring and 3D thermal modeling of the spiral casing of Batalha Hydroelectric power plant since its early ages." *54º Congresso Brasileiro do Concreto — IBRACON*.
   - Cooperação técnica internacional: FURNAS, UFC, Universidades do Minho e do Porto
   - Análise 3D por elementos finitos do campo de temperatura na caixa espiral da UHE Batalha (rio São Marcos, GO/MG)

3. **GOMES, F.M.P.; COELHO, N. A.; PEDROSO, L. J.** (2016). "Uma solução analítico-numérica para a difusividade do calor em um cilindro com e sem geração de calor." *CILAMCE 2016* (XXXVII Iberian Latin-American Congress on Computational Methods in Engineering).
   - Pontos-chave: solução analítica (Bessel + Duhamel) implementada numericamente (FreeMat) e comparada ao ANSYS; **validação cruzada analítico ↔ numérico**

#### Dissertações e Teses

4. **GOMES, F.M.P.** (2011). "Concreto nas Primeiras Idades: Propriedades e Modelagem Termomecânica Simplificada." Dissertação de Mestrado — UFG.

5. **GOMES, F.M.P.** (2017). "Comportamento exotérmico, viscoelástico com envelhecimento e termoativado do concreto massa..." Tese de Doutorado — UnB (117 p.).

### 1.3 Competências Técnicas Diferenciadas

| Competência | Descrição | Nível | Valor Estratégico |
|---|---|---|---|
| Dosagem de concreto | Apostila própria + experiência em cursos | Expert | Produto pronto para monetização |
| Concreto massa (CCR) | Barragens e grandes obras — 28 anos | Expert | Credibilidade |
| Modelagem termomecânica | Modelo termo-viscoelástico com envelhecimento | Inédito | IP valioso |
| Soluções analíticas | Equações diferenciais para problemas térmicos | Inédito | **Diferencial competitivo** |
| Concreto auto-adensável (SCC) | Dosagem e aplicação | Avançado | Produto escalável |
| UHPC | Dosagem de altíssima eficiência (IL < 5) | Expert | **Diferencial de mercado** |
| Concreto com nanotubos de carbono | Formulação e propriedades | Avançado | Nicho |
| Concreto leve | Dosagem otimizada | Avançado | Produto escalável |
| Condutividade térmica variável | Concretos de baixa e alta condutividade | Expert | Aplicações especiais |
| Software de elementos finitos | ANSYS, Multimech, Viscolab, mmConcrete (ver §1.5) | Expert | Validação técnica |
| Fitting-curve analítico | Extração de parâmetros por solução analítica | Inédito | **Produto digital core** |

### 1.4 Soluções Analíticas Inéditas

Problemas de contorno específicos resolvidos analiticamente:

1. **Cilindro infinito ao ar** — Solução analítica com geração interna genérica, Tamb. constante
2. **Laje infinita** — Solução analítica com geração interna genérica, Tamb. constante
   2.1. **Implementado o curve-fitting** dos parâmetros a partir do monitoramento
3. **Laje de fundação** — Solução analítica com geração interna genérica, Tamb. constante
4. **Pós-resfriamento** — Solução analítica pda 1a. parte do problema com HGen genérica
5. **Tubulão térmico** (em desenvolvimento) — Solução que permite extrair de um único termômetro:
   - Geração interna de calor
   - Energia de ativação
   - Propriedades térmicas do concreto
   - Propriedades térmicas do terreno

> **Nota estratégica:** A solução do tubulão térmico é potencialmente disruptiva — transforma medição simples em ferramenta completa de caracterização térmica.

### 1.5 Softwares Desenvolvidos

| Software | Contexto | Descrição |
|---|---|---|
| **ANSYS + Multimech** | Furnas | Customização para Furnas com modelo exo-termo-viscoelástico com envelhecimento e construção em camadas. Multimech (Multimechanics) — empresa e software descontinuados. |
| **Viscolab** | Multimechanics / FINEP | Desenvolvimento para a Multimechanics no âmbito de projeto de Inovação FINEP. |
| **mmConcrete** | Multimechanics / FINEP | Versão nacional do modelo térmico do ConcreteWorks; projeto FINEP com a Multimechanics. |

---

## 2. PARCEIROS DE PESQUISA

### 2.1 COPPE/UFRJ

#### Prof. Eduardo M. R. Fairbairn
- **Posição:** Professor da COPPE/UFRJ — Engenharia Civil
- **Métricas:** >7.500 citações, h-index = 39 (Google Scholar)
- **Contribuições:** Co-editor RILEM "Thermal Cracking of Massive Concrete Structures"; líder RILEM TC 254-CMS; RILEM TC 287-CCS; análise inversa e algoritmos genéticos para calibração
- **Links:** NUMATS/COPPE, Lattes

#### Prof. Romildo Dias Toledo Filho
- **Posição:** Professor Titular COPPE/UFRJ; Diretor Parque Tecnológico UFRJ; Ex-Diretor Geral COPPE (2019-2023)
- **Métricas:** h-index = 75, 320+ artigos, Top 2% Stanford; Academia Brasileira de Ciências, ANE, TWAS
- **Especialidades:** Concreto baixo carbono, cimentos capturadores CO₂, fibras naturais, descarbonização
- **Links:** ABC, NUMATS/COPPE

#### Prof. Oscar Aurelio Mendoza Reales
- **Posição:** Professor Adjunto do Programa de Engenharia Civil da COPPE/UFRJ — NUMATS
- **Formação:** Doutorado (UFRJ), mestrado e graduação em Engenharia (Universidad Nacional de Colômbia)
- **Áreas:** Química do cimento, ciência de materiais, sustentabilidade na construção civil
- **Linhas de pesquisa:** Impressão 3D de materiais cimentícios, microestrutura, laboratórios NUMATS
- **Links:** [NUMATS/COPPE](https://www.numats.poli.coppe.ufrj.br/en/institucional/equipe/docentes/docentes-plenos/1026-oscar-aurelio-mendoza-reales)

### 2.2 USP — Escola Politécnica

#### Prof. Rafael Giuliano Pileggi
- **Posição:** Professor Titular (2023) no Departamento de Engenharia de Construção Civil da Poli-USP
- **Formação:** Graduação, mestrado (1996) e doutorado (2001) em Engenharia de Materiais — UFSCar; pós-doutorados na Poli-USP (2005) e ETH Zürich (2019)
- **Métricas:** 4.500+ citações, h-index = 35, i10-index = 99 (Google Scholar)
- **Especialidades:** Reologia de materiais cimentícios, manufatura digital (impressão 3D de concreto), materiais ecoeficientes, UHPC com baixa energia de mistura
- **Liderança:** Coordenador do Laboratório de Impressão 3D de Concreto (hubIC); pesquisador sênior do INCT em tecnologias ecoeficientes; Laboratório de Microestrutura e Eco-Eficiência (LME); Digital Construction Lab (dclab)
- **Destaques:** Professor visitante ETH Zürich (2019) em reologia e Digital Concrete; projeto FAPESP Young Researcher (2007) que originou o laboratório de reologia de suspensões reativas na Poli-USP; colaborações com Missouri S&T (2024)
- **Links:** [FAPESP](https://bv.fapesp.br/en/pesquisador/1695/rafael-giuliano-pileggi/), Google Scholar

### 2.3 UFC (Universidade Federal do Ceará)

#### Prof. Jorge Barbosa Soares
- **Métricas:** h-index = 32-33, 5.000+ citações (Google Scholar)
- **Formação:** PhD Texas A&M (1997)
- **Especialidades:** Mecânica da fratura, caracterização de materiais
- **Links:** [Google Scholar](https://scholar.google.com.br/citations?hl=pt-BR&user=nz-6EN4AAAAJ), Lattes

#### Prof. Flávio Vasconcelos de Souza
- **Área:** Viscoelasticidade, fluência, modelagem constitutiva (compósitos viscoelásticos, MEF, propagação de dano)
- **Formação:** Mestrado em Engenharia de Transportes — UFC (2005), dissertação sobre modelo multi-escala para compósitos viscoelásticos
- **Colaboração:** Cooperação Furnas-UFC-Minho-Porto na UHE Batalha; coautor em "Monitoring and 3D thermal modeling of the spiral casing of Batalha" (IBRACON 2012)
- **Links:** [Repositório UFC](https://repositorio.ufc.br/handle/riufc/4879)

### 2.4 Colaboradores Internacionais

#### Prof. Miguel Azenha
- **Posição:** Professor Associado com Agregação, Divisão de Estruturas, Departamento de Engenharia Civil — Universidade do Minho
- **Formação:** Doutoramento (2009) e Mestrado (2004) em Engenharia Civil — U. Porto; tese de mestrado sobre comportamento do betão nas primeiras idades e análise termo-mecânica
- **Métricas:** 6.100+ citações, h-index = 43 (Google Scholar)
- **Liderança:** Chair do RILEM TC 287-CCS (Early age and long-term crack width analysis); Chair do COST Action TU1404 (service life of cement-based materials); Fellow RILEM (2024, segundo português a receber)
- **Áreas:** Concreto em idade jovem (acoplamentos termo-higro-mecânicos, evolução de propriedades na hidratação, fluência, retração); BIM e processos digitais na construção
- **Colaboração:** Coautor *Engineering Structures* (2014) e IBRACON (2012) sobre UHE Batalha; múltiplas publicações conjuntas com Rui Faria
- **Links:** [Ciência Vitae](https://www.cienciavitae.pt/portal/D413-AD32-EB56), [civil.uminho.pt/mazenha](https://www.civil.uminho.pt/mazenha), Google Scholar

#### Prof. Rui Faria
- **Posição:** Professor Catedrático, Faculdade de Engenharia da Universidade do Porto (FEUP); membro integrado CONSTRUCT
- **Formação:** Título de Agregado (2006), Doutoramento (1995) e Mestrado (1988) em Engenharia Civil — U. Porto; tese de doutorado sobre comportamento sísmico de barragens de betão
- **Produção:** 42 artigos em periódicos, 13 livros/monografias, 130+ trabalhos em conferências; 12 teses de doutorado e 30 dissertações orientadas
- **Áreas:** Engenharia estrutural, modelagem por elementos finitos, análises estática e dinâmica não-linear de estruturas de betão armado, engenharia de barragens, comportamento do concreto em idade jovem, análise térmica transiente, fissuração induzida por retração e efeitos térmicos, modelagem numérica multi-física
- **Liderança:** Coordenador científico do LABEST (Laboratory for Concrete Technology and Structural Behaviour)
- **Colaboração:** Coautor *Engineering Structures* (2014) e IBRACON (2012) sobre UHE Batalha; extensa colaboração com Miguel Azenha em projetos FCT (SeLCo, IntegraCrete, Early Age Concrete)
- **Links:** [Ciência Vitae](https://www.cienciavitae.pt/6311-7D84-85C9), [FEUP](https://sigarra.up.pt/feup/pt/func_geral.formview?p_codigo=209573)

---

## 3. ESTADO DA ARTE — TECNOLOGIA E MERCADO

### 3.1 Índice de Intensidade Ligante (IL)

```
IL = consumo de ligante (kg/m³) / resistência à compressão (MPa)
```

| Tipo de concreto | IL típico | IL possível (IRC) |
|---|---|---|
| Concreto convencional | 10-13 | — |
| Concreto de alto desempenho | 6-8 | — |
| UHPC convencional | 5-7 | — |
| **Solução IRC (todos os tipos)** | — | **< 5** |

**Significado:** IL < 5 significa eficiência radical — menos de 5 kg ligante por m³ por MPa; impacto direto em redução de CO₂ e custo.

### 3.2 Mercado de UHPC

- **Tamanho global (2024):** US$ 689 milhões
- **Projeção (2034):** US$ 1.167 milhões (CAGR 5,5-6,6%)
- **Drivers:** infraestrutura sustentável, pontes, pré-moldados, resiliência sísmica

### 3.3 Ferramentas SaaS e Software de Concreto (Concorrência)

| Ferramenta | Modelo | Foco |
|---|---|---|
| **ConcreteWorks** | Gratuito, Windows | UT Austin/TxDOT/FHWA. Dosagem (ACI 211), análise térmica e fissuração, durabilidade (cloretos, ASR, DEF). Módulos: concreto massa, pilares, vigas, pavimentos. Referência nos EUA. |
| **MixDesignCalc.cloud** | Freemium/SaaS | Dosagem geral (ACI, Eurocode, BS, IS) — 50.000+ engenheiros |
| **Concrete.ai (Concrete Copilot)** | B2B SaaS | IA para otimização de mix — 30% redução CO₂ |
| **Solvebility.com** | Gratuito | Calculadora básica |

**ConcreteWorks (paradigma):** Software gratuito desenvolvido no Concrete Durability Center da UT Austin com TxDOT/FHWA. Combina dosagem, previsão térmica e durabilidade em interface única; amplamente usado nos EUA. Cobre concreto massa, difusão de cloretos e mitigação de DEF (etringita tardia, associada a T > 70°C na cura). Desktop, não web.

> **Lacuna de mercado:** Nenhuma ferramenta oferece soluções analíticas para problemas térmicos, fitting-curve para parâmetros térmicos, modelo termo-viscoelástico com envelhecimento, ou dosagem IL < 5 em múltiplos tipos de concreto.

### 3.4 Soluções Analíticas vs. Numéricas

- **Klemczak (2019):** Método analítico para efeitos térmicos em lajes de fundação (*Materials*)
- **Liu et al. (2015):** Simulação de campo térmico com pós-resfriamento (*Applied Thermal Engineering*)

> **Diferencial IRC:** Soluções analíticas **inéditas na literatura** para as condições de contorno específicas — resultados em tempo real sem malha de elementos finitos.

---

## 4. RILEM E COMITÊS TÉCNICOS

- **RILEM TC 254-CMS:** Thermal cracking of massive concrete structures (Fairbairn)
- **RILEM TC 287-CCS:** Recomendações termo-quimico-mecânicas (2021)
- **ACI 207:** Concreto massa
- **ACI 238.1R-08:** Workabilidade e reologia

---

## 5. LACUNAS E PRÓXIMOS PASSOS (Prioridade Alta)

1. **Prof. Jorge Barbosa Soares (UFC):** Confirmar link institucional/Lattes além do Google Scholar

**Notas:** Bibliografia do pesquisador principal será inserida via blog (já previsto), com trabalhos reescritos em formato de artigo.

---

## 6. FONTES E LINKS

- Engineering Structures (2014): DOI 10.1016/j.engstruct.2014.10.009
- Repositório U. Minho (2012): repositorium.sdum.uminho.pt
- RILEM TC 287-CCS (2021): link.springer.com
- Jorge B. Soares — [Google Scholar](https://scholar.google.com.br/citations?hl=pt-BR&user=nz-6EN4AAAAJ)
- Flávio Vasconcelos de Souza — [Repositório UFC](https://repositorio.ufc.br/handle/riufc/4879)
- Romildo Toledo Filho — ABC, TWAS
- Oscar Aurelio Mendoza Reales — NUMATS/COPPE
- Rafael Giuliano Pileggi — FAPESP, Lattes
- Miguel Azenha — Ciência Vitae, civil.uminho.pt
- Rui Faria — Ciência Vitae, FEUP
- LABEST/UFRJ, NUMATS/COPPE
- MixDesignCalc.cloud, Concrete.ai
- Furnas Serviços Tecnológicos

---

*Pesquisa consolidada em 08/02/2026 — Atualização perfis Oscar, Pileggi, Flávio Souza, Azenha e Rui Faria (11/02/2026)*
