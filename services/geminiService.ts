
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DIET_PHILOSOPHY_CONTEXT, GEMINI_MODEL_NAME } from '../constants';
import { UserProfile, DailyPlan } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Provide a fallback to prevent crash if undefined

export const getDailyDietTip = async (): Promise<string> => {
  if (!API_KEY) return "API Key no configurada. No se pueden obtener consejos.";
  try {
    const prompt = `
Contexto: Usuario sigue un plan de recomposición corporal agresiva. ${DIET_PHILOSOPHY_CONTEXT}
Tarea: Proporciona un consejo corto, motivador y práctico para hoy relacionado con su dieta, entrenamiento, mentalidad o recuperación. Máximo 2-3 frases.
Formato de respuesta: Texto plano.
`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
       config: { thinkingConfig: { thinkingBudget: 0 } } // Low latency
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching daily tip from Gemini:", error);
    return "Error al obtener consejo de IA. Intenta de nuevo.";
  }
};

export const getDietAdjustmentSuggestion = async (userProfile: UserProfile, currentDayPlan: DailyPlan, weeklyProgress: string): Promise<string> => {
  if (!API_KEY) return "API Key no configurada. No se pueden obtener sugerencias.";
  try {
    const prompt = `
Contexto del Usuario y Plan:
${DIET_PHILOSOPHY_CONTEXT}
Usuario actual:
- Peso Inicial: ${userProfile.initialWeightKg} kg, Grasa Corporal Inicial: ${userProfile.initialBodyFatPercent}%
- Peso Actual: ${userProfile.currentWeightKg} kg, Grasa Corporal Actual: ${userProfile.currentBodyFatPercent}%
- Meta Peso: ${userProfile.goalWeightKg} kg, Meta Grasa Corporal: ${userProfile.goalBodyFatPercent}%
- Progreso Semanal Reportado: ${weeklyProgress}

Plan del día actual (${currentDayPlan.dayName}):
- Ventana alimentación: ${currentDayPlan.eatingWindow}
- Macros Objetivo: P ${currentDayPlan.targetMacros.protein}g, G ${currentDayPlan.targetMacros.fats}g, C ${currentDayPlan.targetMacros.carbsNet}g, Cal ${currentDayPlan.targetMacros.calories}
- Comidas:
${currentDayPlan.meals.map(m => `  - ${m.name}: ${m.description} (P:${m.macros.protein} G:${m.macros.fats} C:${m.macros.carbsNet})`).join('\n')}

Tarea:
Basado en el progreso reportado y el plan, si el progreso es insuficiente o nulo ("no hay avances", "estancado", "subí de peso/grasa"), sugiere 1-2 ajustes específicos y accionables al menú actual o a los suplementos para mejorar la recomposición corporal. Si el progreso es bueno, ofrece una palabra de aliento y un pequeño consejo para mantener el rumbo.
Las sugerencias deben ser concisas y prácticas.
Considera la posibilidad de ajustar porciones, tipos de alimentos (manteniendo la filosofía low-carb/high-protein/healthy-fats), o timing de nutrientes/suplementos.
No cambies drásticamente la estructura del plan, solo sugiere pequeños ajustes.

Formato de respuesta: Texto plano, máximo 4-5 frases.
`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching diet adjustment suggestion from Gemini:", error);
    return "Error al obtener sugerencia de ajuste de IA. Intenta de nuevo.";
  }
};
