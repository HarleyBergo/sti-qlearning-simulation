# Sistema Tutor Inteligente Adaptativo com Aprendizado por Reforço (Q-Learning)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen)](https://harleybergo.github.io/sti-qlearning-simulation/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Concluído](https://img.shields.io/badge/Status-Concluído-success)](https://github.com/HarleyBergo/sti-qlearning-simulation)

Repositório oficial da simulação computacional desenvolvida no âmbito do Trabalho de Conclusão de Curso (TCC).

* **Título do Trabalho:** *IA na Educação: Como o Aprendizado por Reforço (Reinforcement Learning) Pode Criar Sistemas Tutores Inteligentes Personalizados*
* **Autor:** Harley Augusto Bergo
* **Ambiente de Simulação Online:** [https://harleybergo.github.io/sti-qlearning-simulation/](https://harleybergo.github.io/sti-qlearning-simulation/)

---

## 1. Visão Geral

Softwares educacionais convencionais dependem tipicamente de trilhas estáticas lineares ou árvores de decisão pré-programadas, incapazes de responder dinamicamente às oscilações cognitivas individuais de cada discente.

Este simulador implementa a modelagem computacional proposta na monografia de pós-graduação, transpondo o processo pedagógico interativo para a estrutura formal de **Processos de Decisão Markovianos (PDM / MDP)** resolvidos via **Aprendizado por Reforço Tabular (Q-Learning)**.

O agente tutor aprende autonomamente uma política ótima ($\pi^*$) capaz de conduzir o estudante desde estados basais de aprendizagem até o domínio avançado do conteúdo, respeitando as premissas pedagógicas da **Zona de Desenvolvimento Proximal (ZDP)** de Vygotsky.

---

## 2. Modelagem Matemática do Sistema

A interação entre o tutor (agente) e o estudante (ambiente) é formalizada pela quádrupla $\langle \mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R} \rangle$:

### Espaço Discreto de Estados Cognitivos ($\mathcal{S}$)
O Módulo de Diagnóstico discretiza o perfil de retenção e autonomia do discente em 5 estados:
* $E_0$ (**Ruim**): Retenção insuficiente, erros conceituais graves e necessidade de suporte imediato.
* $E_1$ (**Regular**): Compreensão conceitual preliminar, mas com hesitação elevada e lacunas conceituais.
* $E_2$ (**Bom**): Domínio satisfatório dos fundamentos, resolução de problemas estruturados com autonomia parcial.
* $E_3$ (**Muito Bom**): Autonomia consolidada e resolução consistente de problemas de média/alta complexidade.
* $E_4$ (**Excelente**): Domínio pleno da ementa e prontidão para desafios conceituais e síntese curricular.

### Espaço de Ações Pedagógicas ($\mathcal{A}$)
O Modelo Pedagógico seleciona intervenções didáticas a partir de um conjunto de 10 ações discretas:
* $A_0, A_1$: Revisão teórica passo a passo de conceitos basilares.
* $A_2, A_3$: Exemplos práticos resolvidos e comentados.
* $A_4, A_5, A_6$: Listas de exercícios de fixação com suporte gradual (*scaffolding*).
* $A_7, A_8$: Problemas aplicados de nível médio-alto com mínima intervenção.
* $A_9$: Desafios avançados de síntese curricular.

### Função de Recompensa ($\mathcal{R}$) e Dinâmica Estocástica
A cada transição completada, o ambiente emite uma recompensa escalar imediata atrelada ao estado atingido:

$$r(E_0) = 1, \quad r(E_1) = 3, \quad r(E_2) = 5, \quad r(E_3) = 7, \quad r(E_4) = 10$$

As probabilidades de transição modelam a **Zona de Desenvolvimento Proximal**: quando o tutor seleciona a intervenção pedagógica ideal para o estado atual ($E_0 \rightarrow A_0$, $E_1 \rightarrow A_2$, $E_2 \rightarrow A_4$, $E_3 \rightarrow A_7$, $E_4 \rightarrow A_9$), a probabilidade de avanço cognitivo é alta:
* $P(s+1 \mid s, a_{\text{ideal}}) = 0{,}75$
* $P(\min(s+2, 4) \mid s, a_{\text{ideal}}) = 0{,}15$
* $P(s \mid s, a_{\text{ideal}}) = 0{,}10$

Caso o agente escolha uma ação descalibrada (fora da ZDP), há risco elevado de frustração ou tédio:
* $P(\max(0, s-1) \mid s, a_{\text{outro}}) = 0{,}40$
* $P(s \mid s, a_{\text{outro}}) = 0{,}50$
* $P(\min(s+1, 4) \mid s, a_{\text{outro}}) = 0{,}10$

### Regra de Atualização por Diferença Temporal (TD)
A Tabela Q de dimensão $5 \times 10$ tem suas células atualizadas a cada passo de iteração:

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha \left[ r_{t+1} + \gamma \max_{a} Q(s_{t+1}, a) - Q(s_t, a_t) \right]$$

* **Taxa de aprendizado ($\alpha$):** $0{,}20$
* **Fator de desconto temporal ($\gamma$):** $0{,}90$
* **Exploração vs. Explotação ($\epsilon$-greedy):** $\epsilon_0 = 1{,}00$ com decaimento exponencial a $0{,}985$ por episódio até o piso $\epsilon_{\min} = 0{,}05$.

---

## 3. Resultados Experimentais Obtidos

Ao longo de 500 episódios simulados (20 passos por sessão), o agente exibe convergência estável:

| Métrica | Episódio 1 ($\epsilon = 0{,}985$) | Episódio 50 ($\epsilon = 0{,}470$) | Episódio 200 ($\epsilon = 0{,}050$) | Episódio 500 ($\epsilon = 0{,}050$) |
| :--- | :---: | :---: | :---: | :---: |
| **Recompensa Média** | 2,60 | 4,75 | 9,45 | **9,55** |
| **Erro TD Médio Absoluto** | 3,07 | 9,60 | 0,75 | **0,70** |

### Tabela Q Convergida ($Q^*$) após 500 Episódios

| Estado \ Ação | $A_0$ | $A_1$ | $A_2$ | $A_3$ | $A_4$ | $A_5$ | $A_6$ | $A_7$ | $A_8$ | $A_9$ | Ação Ótima |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$E_0$ (Ruim)** | **83,2** | 40,4 | 46,7 | 33,6 | 39,6 | 25,3 | 33,8 | 36,5 | 31,4 | 34,2 | **$A_0$ (Revisão Base)** |
| **$E_1$ (Regular)** | 60,5 | 63,3 | **87,4** | 45,9 | 63,6 | 59,6 | 67,7 | 53,2 | 51,0 | 48,9 | **$A_2$ (Exemplo Prático)** |
| **$E_2$ (Bom)** | 70,0 | 65,3 | 67,8 | 68,9 | **92,6** | 64,6 | 70,7 | 70,2 | 68,4 | 69,5 | **$A_4$ (Fixação)** |
| **$E_3$ (M. Bom)** | 86,8 | 87,3 | 84,6 | 88,6 | 88,0 | 89,3 | 88,3 | **96,1** | 87,1 | 86,5 | **$A_7$ (Problema Aplicado)** |
| **$E_4$ (Excelente)** | 91,7 | 92,3 | 92,5 | 92,6 | 93,2 | 93,1 | 91,8 | 92,8 | 92,4 | **97,5** | **$A_9$ (Desafio Avançado)** |

---

## 4. Governança, MLOps e Implicações Éticas

O projeto incorpora os preceitos de sustentação e governança discutidos na monografia:
1. **Transparência e Explicabilidade (XAI):** A arquitetura tabular $5 \times 10$ confere total interpretabilidade às decisões pedagógicas tomadas pela IA, permitindo auditoria pedagógica em tempo real sem opacidade de "caixa-preta".
2. **Mitigação de Riscos de Exploração (*Warm Start*):** Destaca-se a obrigatoriedade de treinamento prévio e supervisão pedagógica antes de testes em salas reais, evitando submeter discentes reais a estratégias pedagógicas aleatórias.
3. **Engenharia de MLOps:** Versionamento contínuo de matrizes e parâmetros via Git com publicação automatizada diretamente via GitHub Pages na branch `main`.

---

## 5. Estrutura do Repositório

```text
sti-qlearning-simulation/
├── index.html              # Interface gráfica do dashboard e painéis de controle
├── style.css               # Folha de estilos e formatação visual responsiva
├── qlearning.js            # Implementação formal do ambiente PDM e do agente Q-Learning
├── README.md               # Documentação técnica e científica do projeto
├── LICENSE                 # Licença MIT de código aberto
└── .gitignore              # Regras de exclusão do Git
```

---

## 6. Como Executar Localmente

### Pré-requisitos
* Qualquer navegador web moderno (Google Chrome, Mozilla Firefox, Safari ou Microsoft Edge).
* Git instalado.
* Editor de código (Antigravity IDE ou VS Code).

### Instruções

1. Clone este repositório:
   ```bash
   git clone https://github.com/HarleyBergo/sti-qlearning-simulation.git
   cd sti-qlearning-simulation
   ```

2. Abra o arquivo `index.html` diretamente no navegador ou utilize um servidor local HTTP:
   ```bash
   # Alternativa via Python
   python -m http.server 8000
   ```

3. Acesse `http://localhost:8000` no seu navegador.

4. Ajuste os hiperparâmetros desejados nos campos de controle e clique em **"Executar Simulação"** para observar a convergência gráfica e o preenchimento matricial.

---

## 7. Referências Bibliográficas

* **ARRIETA**, Alejandro Barredo et al. Explainable Artificial Intelligence (XAI): Concepts, taxonomies, opportunities and challenges toward responsible AI. *Information Fusion*, v. 58, p. 82-115, 2020.
* **BELLMAN**, Richard. *Dynamic Programming*. Princeton: Princeton University Press, 1957.
* **BRASIL**. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018.
* **KREUZBERGER**, Dominik; KÜHL, Niklas; HIRSCHL, Sebastian. Machine Learning Operations (MLOps): Overview, Definition, and Architecture. *IEEE Access*, v. 11, p. 31866-31879, 2023.
* **LEITE**, A. S. *Um Modelo de Sistema Educativo Cognitivista Baseado em Tutoria Inteligente Adaptativa via Aderência Conceitual*. 1999. Tese (Doutorado) – Instituto Tecnológico de Aeronáutica, São José dos Campos, 1999.
* **MARIETTO**, Maria das Graças Bruno. *Definição Dinâmica de Estratégias Instrucionais em Sistemas de Tutoria Inteligente: Uma Abordagem Multiagentes na WWW*. 2000. Tese (Doutorado) – Instituto Tecnológico de Aeronáutica, São José dos Campos, 2000.
* **MNIH**, Volodymyr et al. Human-level control through deep reinforcement learning. *Nature*, v. 518, n. 7540, p. 529-533, 2015.
* **SUTTON**, Richard S.; **BARTO**, Andrew G. *Reinforcement Learning: An Introduction*. Cambridge: MIT Press, 1998.
* **UNESCO**. *Recommendation on the Ethics of Artificial Intelligence*. Paris: UNESCO, 2021.
* **VICCARI**, Rosa Maria. *Um Tutor Inteligente para a Programação em Lógica: Idealização, Projeto e Desenvolvimento*. 1990. Tese (Doutorado) – Universidade de Coimbra, Coimbra, 1990.
* **WATKINS**, Christopher J. C. H.; **DAYAN**, Peter. Q-learning. *Machine Learning*, v. 8, n. 3-4, p. 279-292, 1992.
