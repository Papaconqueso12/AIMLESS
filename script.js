let conversationHistory = [];

async function getAIResponse(userMessage) {
  if (!window.generator) {
    return "⏳ El modelo aún se está cargando. Espera un momento...";
  }

  // Agrega el mensaje del usuario al historial
  conversationHistory.push(`Usuario: ${userMessage}`);

  // Construye el prompt con historial + instrucciones
  const prompt = `${prompts[mode]}\n${conversationHistory.join('\n')}\nAIMLESS:`;

  const output = await window.generator(prompt, {
    max_new_tokens: 80,
    temperature: 0.7,
    top_k: 50,
    repetition_penalty: 1.2
  });

  // Extrae solo la respuesta nueva
  const fullText = output[0].generated_text;
  const reply = fullText.replace(prompt, "").trim();

  // Guarda la respuesta en el historial
  conversationHistory.push(`AIMLESS: ${reply}`);

  return reply;
}

