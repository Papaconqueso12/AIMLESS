let mode = "study";
let conversationHistory = [];

const prompts = {
  study: "Eres un tutor académico serio y claro. Responde con precisión y sin bromas.",
  code: "Eres un experto en programación. Enseña con ejemplos claros y código bien comentado.",
  fun: "Eres un amigo divertido que hace roleplay, cuenta chistes y anima al usuario."
};

function setMode(newMode, button) {
  mode = newMode;
  document.getElementById("modeLabel").textContent = `Modo: ${{
    study: "Estudio",
    code: "Programación",
    fun: "Roleplay"
  }[mode]}`;

  document.querySelectorAll(".mode-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");

  conversationHistory = []; // Reinicia el historial al cambiar de modo
  document.getElementById("chat").innerHTML = "";
}

document.getElementById("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("Tú", message);
  input.value = "";

  const reply = await getAIResponse(message);
  appendMessage("AIMLESS", reply);
});

function appendMessage(sender, text) {
  const chat = document.getElementById("chat");
  const msg = document.createElement("div");
  msg.className = "mb-2";
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function getAIResponse(userMessage) {
  const prompt = `${prompts[mode]}\n${conversationHistory.join('\n')}\nUsuario: ${userMessage}\nAIMLESS:`;

  try {
    const response = await fetch("https://mys-llama2-chat.hf.space/run/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [prompt] })
    });

    const data = await response.json();
    const reply = data.data[0].trim();

    conversationHistory.push(`Usuario: ${userMessage}`);
    conversationHistory.push(`AIMLESS: ${reply}`);

    return reply;
  } catch (error) {
    console.error("Error al obtener respuesta:", error);
    return "⚠️ Hubo un problema al conectar con la IA. Intenta de nuevo más tarde.";
  }
}
