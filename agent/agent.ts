import { chatgpt } from "eve/models/openai";
import { defineAgent } from "eve";

export default defineAgent({
  model: chatgpt("gpt-6-luna-fast"),
  reasoning: "high",
});
