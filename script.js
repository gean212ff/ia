// ============================================================
// 1. FUNÇÕES LÓGICAS PRINCIPAIS (ALGORITMOS DA IA)
// ============================================================

/**
 * Avalia a temperatura do reator e devolve a condição de segurança.
 * @param {number} temp - Temperatura em graus Celsius
 * @returns {object} { statusTexto, mensagemLog, nivelAlerta }
 */
function checarTemperaturaReator(temp) {
  if (temp > 100) {
    return {
      statusTexto: "CRÍTICO (SUPERAQUECIMENTO)",
      mensagemLog: `ALERTA DE SEGURANÇA: Reator em ${temp}°C! Níveis críticos atingidos!`,
      nivelAlerta: "red"
    };
  } else if (temp > 75) {
    return {
      statusTexto: "ATENÇÃO (ELEVADO)",
      mensagemLog: `AVISO: Temperatura em ${temp}°C. Ajustando refrigeração primária.`,
      nivelAlerta: "amber"
    };
  } else {
    return {
      statusTexto: "ESTÁVEL",
      mensagemLog: `Reator operando em níveis ideais (${temp}°C).`,
      nivelAlerta: "green"
    };
  }
}

/**
 * Avalia a distância do obstáculo e decide se é necessário desviar.
 * @param {number} distancia - Distância do obstáculo em metros
 * @returns {object} { precisaDesviar, statusTexto, mensagemLog, nivelAlerta }
 */
function checarRadarEvasao(distancia) {
  const DISTANCIA_MINIMA = 500;
  
  if (distancia < DISTANCIA_MINIMA) {
    return {
      precisaDesviar: true,
      statusTexto: "MANOBRA NECESSÁRIA",
      mensagemLog: `RADAR: Objeto detectado a ${distancia}m. Distância inferior ao limite de segurança (${DISTANCIA_MINIMA}m).`,
      nivelAlerta: "red"
    };
  } else {
    return {
      precisaDesviar: false,
      statusTexto: "CURSO SEGURO",
      mensagemLog: `RADAR: Nenhum risco iminente. Objeto mais próximo a ${distancia}m.`,
      nivelAlerta: "green"
    };
  }
}

/**
 * Gera um relatório formatado combinando os dados do piloto e do sistema.
 * @param {string} piloto - Nome do piloto
 * @param {string} statusReator - Texto de status do reator
 * @param {string} statusRadar - Texto de status da navegação
 * @returns {string} Mensagem de relatório pronta para exibição
 */
function gerarRelatorioIA(piloto, statusReator, statusRadar) {
  const nomePiloto = piloto.trim() !== "" ? piloto : "Não Identificado";
  return `RELATÓRIO DE BORDO: Piloto [${nomePiloto.toUpperCase()}] | Reator: ${statusReator} | Navegação: ${statusRadar}`;
}


// ============================================================
// 2. INTERAÇÃO COM A INTERFACE (DOM)
// ============================================================

// Elementos da interface (DOM)
const tempInput = document.getElementById("tempInput");
const tempValueDisplay = document.getElementById("tempValueDisplay");
const distInput = document.getElementById("distInput");
const distValueDisplay = document.getElementById("distValueDisplay");
const pilotoInput = document.getElementById("pilotoInput");

const cardReator = document.getElementById("statusReatorTexto");
const cardNavegacao = document.getElementById("statusNavegacaoTexto");
const terminalLog = document.getElementById("terminalLog");

// Atualização dinâmica dos sliders na tela
tempInput.addEventListener("input", (e) => {
  tempValueDisplay.innerText = `${e.target.value} °C`;
});

distInput.addEventListener("input", (e) => {
  distValueDisplay.innerText = `${e.target.value} m`;
});

/**
 * Adiciona uma linha formatada de texto no terminal.
 * @param {string} mensagem - Texto a ser exibido no log
 * @param {string} tipo - 'info', 'warn' ou 'alert'
 */
function adicionarLogTerminal(mensagem, tipo = "info") {
  const agora = new Date();
  const horaFormatada = agora.toTimeString().split(" ")[0];

  const novaLinha = document.createElement("div");
  novaLinha.className = "log-line";

  const classeTexto = tipo === "alert" ? "log-alert" : (tipo === "warn" ? "log-warn" : "log-info");

  novaLinha.innerHTML = `<span class="log-time">[${horaFormatada}]</span> <span class="${classeTexto}">${mensagem}</span>`;

  terminalLog.appendChild(novaLinha);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

/**
 * Atualiza visualmente as cores dos cards de status.
 */
function atualizarCorStatusCard(elemento, nivel) {
  elemento.className = "card-status";
  if (nivel === "red") elemento.classList.add("status-red");
  else if (nivel === "amber") elemento.classList.add("status-amber");
  else elemento.classList.add("status-green");
}


// ============================================================
// 3. AÇÕES DISPARADAS PELOS BOTÕES
// ============================================================

function executarChecagemReator() {
  const tempAtual = Number(tempInput.value);
  const resultado = checarTemperaturaReator(tempAtual);

  cardReator.innerText = resultado.statusTexto;
  atualizarCorStatusCard(cardReator, resultado.nivelAlerta);

  const tipoLog = resultado.nivelAlerta === "red" ? "alert" : (resultado.nivelAlerta === "amber" ? "warn" : "info");
  adicionarLogTerminal(resultado.mensagemLog, tipoLog);
}

function executarChecagemRadar() {
  const distanciaAtual = Number(distInput.value);
  const resultado = checarRadarEvasao(distanciaAtual);

  cardNavegacao.innerText = resultado.statusTexto;
  atualizarCorStatusCard(cardNavegacao, resultado.nivelAlerta);

  const tipoLog = resultado.nivelAlerta === "red" ? "alert" : "info";
  adicionarLogTerminal(resultado.mensagemLog, tipoLog);
}

function executarRelatorioCompleto() {
  const tempAtual = Number(tempInput.value);
  const distanciaAtual = Number(distInput.value);
  const nomePiloto = pilotoInput.value;

  const resultadoReator = checarTemperaturaReator(tempAtual);
  const resultadoRadar = checarRadarEvasao(distanciaAtual);

  cardReator.innerText = resultadoReator.statusTexto;
  atualizarCorStatusCard(cardReator, resultadoReator.nivelAlerta);

  cardNavegacao.innerText = resultadoRadar.statusTexto;
  atualizarCorStatusCard(cardNavegacao, resultadoRadar.nivelAlerta);

  const relatorioFinal = gerarRelatorioIA(
    nomePiloto,
    resultadoReator.statusTexto,
    resultadoRadar.statusTexto
  );

  adicionarLogTerminal(relatorioFinal, "info");
}

function simularEmergencia() {
  tempInput.value = 115;
  distInput.value = 180;

  tempValueDisplay.innerText = "115 °C";
  distValueDisplay.innerText = "180 m";

  adicionarLogTerminal("⚠️ SIMULAÇÃO DE EMERGÊNCIA INICIADA!", "alert");
  executarRelatorioCompleto();
}