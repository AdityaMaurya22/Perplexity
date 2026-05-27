import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_GEMINI_API_KEY
});


export async function testAi(){
    model.invoke("Which is the best food in the world in 1 word?").then((response) => {
        console.log("AI Response:", response.text);
    })
}