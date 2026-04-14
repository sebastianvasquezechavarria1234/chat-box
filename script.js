
const API_URL = "https://python-api-render-ubr9.onrender.com/ask";

let userName = "", currentId = null, currentMsgs = [];
let chats = JSON.parse(localStorage.getItem("chats") || "[]");

const $ = id => document.getElementById(id);

// Eventos teclado
$("nameInput").addEventListener("keydown", e => e.key === "Enter" && startChat());
$("questionInput").addEventListener("keydown", e => e.key === "Enter" && sendMessage());

// Inicio de sesión
/**
 * Inicia la sesión del chat capturando el nombre del usuario.
 */
function startChat() {
  const name = $("nameInput").value.trim();
  if (name.length < 2) return alert("Por favor, ingresa un nombre válido (mínimo 2 caracteres)");
  userName = name;
  $("activeName").textContent = name;
  $("modal").style.display = "none";
  $("questionInput").focus();
  currentId = currentId || Date.now().toString();
}

// Nuevo chat
function newChat() {
  currentId = Date.now().toString();
  currentMsgs = [];
  $("messages").innerHTML = "";
  $("suggestions").style.display = "";
  renderHistory();
}

// Sugerencias
function useSuggestion(btn) {
  $("questionInput").value = btn.textContent.slice(2).trim();
  sendMessage();
}

// Guardar y cargar historial
function saveChat() {
  if (!currentId || !currentMsgs.length) return;
  const title = currentMsgs.find(m => m.t === "u")?.x.slice(0, 35) || "Chat";
  const i = chats.findIndex(c => c.id === currentId);
  const entry = { id: currentId, title, msgs: currentMsgs, userName };
  i >= 0 ? chats[i] = entry : chats.unshift(entry);
  localStorage.setItem("chats", JSON.stringify(chats));
  renderHistory();
}

function loadChat(id) {
  const chat = chats.find(c => c.id === id);
  if (!chat) return;
  currentId = id; currentMsgs = [...chat.msgs]; userName = chat.userName;
  $("activeName").textContent = userName;
  $("messages").innerHTML = "";
  $("suggestions").style.display = "none";
  currentMsgs.forEach(m => addMessage(m.x, m.t, true));
  renderHistory();
}

function renderHistory() {
  const list = $("historyList");
  if (!chats.length) { list.innerHTML = '<p style="font-size:12px;color:#9ca3af;padding:8px">Sin chats aún</p>'; return; }
  list.innerHTML = chats.map(c =>
    `<button class="history-item${c.id === currentId ? " active" : ""}" onclick="loadChat('${c.id}')">${c.title}</button>`
  ).join("");
}

// Agregar mensaje al DOM
function addMessage(text, type, fromHistory = false) {
  const wrap = document.createElement("div");
  const isUser = type === "u";
  const isBot = type === "b";

  if (isUser) {
    wrap.style.cssText = "align-self:flex-end;background:#00000016;padding:14px 18px;border-radius:30px 0 30px 30px;max-width:320px;font-size:15px;";
    wrap.textContent = text;
  } else {
    const dot = document.createElement("span");
    const span = document.createElement("span");
    wrap.style.cssText = "align-self:flex-start;display:flex;align-items:flex-start;gap:10px;max-width:600px;";
    dot.style.cssText = `min-width:10px;height:10px;border-radius:50%;margin-top:6px;flex-shrink:0;background:${isBot ? "#b439fbe8" : "#d1d5db"};`;
    span.style.cssText = `font-size:${isBot ? "15" : "14"}px;color:${isBot ? "#1f2937" : "#9ca3af"};${!isBot ? "font-style:italic;" : "line-height:1.7;"}`;
    span.textContent = text;
    wrap.append(dot, span);
    if (!fromHistory && isBot && text) currentMsgs.push({ t: "b", x: text });
    $("messages").appendChild(wrap);
    $("messages").scrollTop = 99999;
    return span;
  }

  if (!fromHistory && isUser) currentMsgs.push({ t: "u", x: text });
  $("messages").appendChild(wrap);
  $("messages").scrollTop = 99999;
}

// Streaming typewriter
async function typeWriter(span, text) {
  for (const char of text) {
    span.textContent += char;
    $("messages").scrollTop = 99999;
    await new Promise(r => setTimeout(r, 7));
  }
}

// Enviar mensaje
async function sendMessage() {
  const q = $("questionInput").value.trim();
  const btn = $("sendBtn");
  if (!q) return;

  $("suggestions").style.display = "none";
  addMessage(q, "u");
  $("questionInput").value = "";
  btn.disabled = true;

  const loading = addMessage("Pensando...", "loading");
  const loadingWrap = loading.parentElement;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName, question: q })
    });
    const data = await res.json();
    loadingWrap.remove();
    const span = addMessage("", "b");
    await typeWriter(span, data.answer);
    currentMsgs.push({ t: "b", x: data.answer });
    saveChat();
  } catch {
    loadingWrap.remove();
    addMessage("Error al conectar con la API ❌", "b");
  }

  btn.disabled = false;
}

renderHistory();
