// qlearning.js - Motor do Agente Q-Learning e Ambiente Estocástico do Estudante

class StudentEnvironment {
  constructor() {
    this.states = ["E0 (Ruim)", "E1 (Regular)", "E2 (Bom)", "E3 (M. Bom)", "E4 (Excelente)"];
    this.rewards = [1, 3, 5, 7, 10];
    this.currentState = 0; // Inicia em E0
    // Ações ótimas parametrizadas no TCC (Zona de Desenvolvimento Proximal)
    // E0->A0 (Revisão base), E1->A2 (Exemplo), E2->A4 (Fixação), E3->A7 (Problema), E4->A9 (Desafio)
    this.idealActions = { 0: 0, 1: 2, 2: 4, 3: 7, 4: 9 };
  }

  reset() {
    this.currentState = 0;
    return this.currentState;
  }

  step(action) {
    const s = this.currentState;
    const rand = Math.random();

    if (action === this.idealActions[s]) {
      // Ação compatível com o estado cognitivo: alta chance de progressão
      if (s < 4) {
        if (rand < 0.75) {
          this.currentState = s + 1;
        } else if (rand < 0.90) {
          this.currentState = Math.min(s + 2, 4);
        } else {
          this.currentState = s;
        }
      } else {
        this.currentState = 4;
      }
    } else {
      // Ação pedagógica descalibrada: risco de estagnação ou regressão
      if (rand < 0.40) {
        this.currentState = Math.max(0, s - 1);
      } else if (rand < 0.90) {
        this.currentState = s;
      } else {
        this.currentState = Math.min(s + 1, 4);
      }
    }

    const reward = this.rewards[this.currentState];
    return { nextState: this.currentState, reward: reward };
  }
}

class QLearningAgent {
  constructor(alpha = 0.20, gamma = 0.90, epsilon = 1.00, epsilonMin = 0.05, decay = 0.985) {
    this.nStates = 5;
    this.nActions = 10;
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.epsilonMin = epsilonMin;
    this.decay = decay;

    // Inicializa a Tabela Q (5 x 10) com zeros
    this.qTable = Array.from({ length: this.nStates }, () => Array(this.nActions).fill(0));
  }

  chooseAction(state) {
    // Dilema Exploration vs. Exploitation (Epsilon-Greedy)
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.nActions); // Exploração aleatória
    }
    // Explotação: seleciona o índice de ação com maior utilidade Q*(s, a)
    const row = this.qTable[state];
    return row.indexOf(Math.max(...row));
  }

  update(s, a, r, nextS) {
    const bestNextA = Math.max(...this.qTable[nextS]);
    const tdTarget = r + this.gamma * bestNextA;
    const tdError = tdTarget - this.qTable[s][a];
    this.qTable[s][a] += this.alpha * tdError;
    return Math.abs(tdError);
  }

  decayEpsilon() {
    this.epsilon = Math.max(this.epsilonMin, this.epsilon * this.decay);
  }
}
