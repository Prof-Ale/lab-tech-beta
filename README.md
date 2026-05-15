# 🧪 LABORATÓRIO TECH v11.0 — Módulo Beta "The Pedagogy Alchemist"

![Versão](https://img.shields.io/badge/Vers%C3%A3o-11.0--beta-purple)
![Governança](https://img.shields.io/badge/Governan%C3%A7a-Data%20Quality-cyan)
![Motor](https://img.shields.io/badge/Motor-Mastery%20Learning-magenta)
![Ambiente](https://img.shields.io/badge/Ambiente-Homologa%C3%A7%C3%A3o-orange)

> **Ambiente de Homologação e Pesquisa Avançada (Sandbox)** do LabTech. Este repositório é o parquinho de diversões científico para testes de arquitetura adaptativa profunda, modelagem de perfis cognitivos e validação de dados antes do deploy na versão de produção.

---

## 🧭 O Próximo Salto: Governança Pedagógica

Com o banco de dados escalando para as **300+ questões**, o desafio do LabTech deixou de ser puramente técnico e passou a focar na **Qualidade e Rastreabilidade do Dado**. No ecossistema Beta, a questão deixa de ser apenas um elemento estático e passa a ser tratada como um **Sensor Cognitivo Dinâmico**.

O objetivo desta versão é implementar o modelo de **Mastery Learning (Aprendizagem de Domínio)** e o mapeamento implícito de **Perfis Mentais**.

---

## 🧠 Arquitetura Científica do Módulo Beta

### 1. A Questão como Entidade Pedagógica
O novo motor de dados isola o texto do fluxo lógico e passa a ler uma matriz complexa de metadados científicos no JSON. Cada elemento agora carrega as seguintes propriedades na camada do `question-normalizer.js`:
* **`habilidade`:** Vinculação estrita à taxonomia curricular.
* **`prerequisitos`:** Mapeamento de dependências de base (âncoras de anos anteriores).
* **`misconception`:** A causa raiz por trás do distrator (o modelo mental errado do aluno).
* **`tipoIntervencao`:** O tipo de remédio pedagógico que a ADA deve aplicar.
* **`representacao`:** Classificação entre estímulo *concreto/visual* ou *abstrato*.
* **`cargaCognitiva`:** O peso intrínseco do esforço de processamento mental exigido.
* **`objetivoDiagnostico`:** O alvo que a telemetria do professor irá monitorar no mapa de calor.

### 2. Motor Adaptativo Baseado em Perfil (A Evolução da ADA)
A ADA agora analisa a latência do clique (`timestamp`), a natureza do erro e a frequência de recorrência para traçar, sem formulários intrusivos, os seguintes **Perfis Cognitivos**:
* 🏃‍♂️ **Perfil Impulsivo:** Respostas rápidas (< 8s) com alta incidência de erros de atenção. *Ação da ADA: Aplica Scaffold de ritmo e trava alternativas temporariamente.*
* 🧱 **Perfil Concreto/Visual:** Alta precisão em itens geométricos, mas bloqueio em abstrações. *Ação da ADA: Filtra o banco priorizando representações visuais no canvas.*
* ⚙️ **Perfil Procedural:** Domina o algoritmo da conta, mas falha no conceito da habilidade principal.

### 3. Sistema de Domínio (Mastery Learning)
O aluno não avança de bloco simplesmente por "limpar o banco". A ADA rastreia uma janela móvel de estabilização conceitual. Se o aluno demonstrar uma *misconception* recorrente, o sistema reduz a carga cognitiva da próxima questão e injeta um suporte contextualizado antes de penalizar o progresso.

---

## 🛠️ Blindagem e Ferramentas de Engenharia (Injetadas)

### 🛡️ `question-validator.js`
Script utilitário autônomo desenvolvido para higienização e controle de qualidade do banco de dados (Data Quality). Executado antes de qualquer atualização, ele varre os registros buscando:
- IDs e alternativas duplicadas.
- Incompatibilidade entre o gabarito (`res`) e a alternativa de acerto.
- Inconsistência na distribuição de pesos (1 a 3) dos distratores.
- Ausência de metadados obrigatórios de governança.

### 🧪 `question-normalizer.js v2.0`
O "Alquimista de Dados" da plataforma. Ele garante **retrocompatibilidade total**. Caso uma questão antiga do banco de dados estável (v10.1) entre no fluxo, o normalizador injeta os metadados avançados dinamicamente em tempo de execução através de inferência lógica, impedindo falhas catastróficas (*Race Conditions*) no console.

---

## 🏆 Centro de Treinamento Olímpico (Bloco 7)
Esta versão consolida o isolamento do **Módulo 7**, alimentado com 50 desafios de lógica extrema e criptoaritmética estilo OBMEP/OMASP. Ele atua como o ambiente de teste de estresse perfeito para os estudantes com Altas Habilidades ou Superdotação (AHSD).

---
*"A tecnologia remove as barreiras físicas da sala de aula; a engenharia de dados pedagógicos decodifica o mapa da mente humana."* — **LabTech v11.0-beta • Desenvolvido por Prof. Alê Chocolate**
