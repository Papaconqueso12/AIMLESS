let mode = "study";

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
  const prompt = `${prompts[mode]}\nUsuario: ${userMessage}\nAIMLESS:`;

  try {
    const response = await fetch("https://yuntian-deng-chatgpt.hf.space/run/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [prompt] })
    });

    const data = await response.json();
    const reply = data.data[0].trim();

    return reply || "🤖 AIMLESS no respondió. Intenta de nuevo.";
  } catch (error) {
    console.error("Error al obtener respuesta:", error);
    return "⚠️ Error al conectar con la IA. Verifica tu conexión o intenta más tarde.";
  }
}
