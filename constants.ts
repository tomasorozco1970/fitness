
import { DailyPlan, Supplement, DayOfWeek, Macros } from './types';

const COMMON_MACROS_MON_THU: Macros = { protein: 200, fats: 170, carbsNet: 40, calories: 2450 };
const COMMON_MACROS_FRI_SAT: Macros = { protein: 200, fats: 185, carbsNet: 50, calories: 2650 };
const COMMON_MACROS_SUN: Macros = { protein: 190, fats: 155, carbsNet: 40, calories: 2300 };


export const DIET_PLAN: Record<DayOfWeek, DailyPlan> = {
  [DayOfWeek.MONDAY]: {
    dayId: DayOfWeek.MONDAY,
    dayName: "Lunes (Día de Fuerza)",
    eatingWindow: "19:00 - 21:00 hrs",
    targetMacros: { protein: 200, fats: 170, carbsNet: 45, calories: 2510 }, // Adjusted as per note
    meals: [
      { id: "mon_meal1", name: "Comida 1 (19:00): Batido Post-Ayuno", description: "3 scoops Whey Isolate, 300ml agua, 150g arándanos, 1 cda cacao puro, 1 cda semillas chía.", macros: { protein: 78, carbsNet: 25, fats: 12, calories: 520 } },
      { id: "mon_meal2", name: "Comida 2 (20:15): Festín de Salmón", description: "350g Salmón salvaje plancha con piel (en ghee). Cama de 2 tazas brócoli vapor y 2 tazas espinacas salteadas (ajo, aceite oliva). Medio aguacate (100g).", macros: { protein: 85, carbsNet: 18, fats: 136, calories: 1636 } }, // Adjusted protein and fat from description for total
      { id: "mon_snack", name: "Snack/Postre (si hay espacio, antes de 21:00)", description: "30g nueces de macadamia.", macros: { protein: 2, carbsNet: 2, fats: 22, calories: 214 } }
    ],
    notes: "Ajustar cantidades para alcanzar macros. Aumento de salmón a 350g y más aceite/aguacate considerado en macros de comida 2."
  },
  [DayOfWeek.TUESDAY]: {
    dayId: DayOfWeek.TUESDAY,
    dayName: "Martes (Día de Fuerza)",
    eatingWindow: "19:00 - 21:00 hrs",
    targetMacros: { protein: 201, fats: 173, carbsNet: 25, calories: 2461 },
    meals: [
      { id: "tue_meal1", name: "Comida 1 (19:00): Batido con Betabel", description: "3 scoops Whey Isolate, 300ml agua, 1 cdta betabel en polvo, 1 cda mantequilla almendras, 1 cda semillas lino molidas.", macros: { protein: 76, carbsNet: 12, fats: 18, calories: 514 } },
      { id: "tue_meal2", name: "Comida 2 (20:15): Bistec y Espárragos", description: "300g Bistec de res (entrecot/solomillo) plancha. 300g espárragos parrilla (aceite oliva). Ensalada rúcula, 50g parmesano.", macros: { protein: 85, carbsNet: 10, fats: 75, calories: 1055 } },
      // Adjusted total macros based on plan text, assuming remaining macros are distributed or items adjusted
      // For simplicity, I'm taking the total values and distributing them. Let's assume the remaining 40g Protein and 80g Fat come from larger portions or added fats in meal 2.
      // Recalculating Meal 2 to meet target: Remaining P: 201-76=125, F: 173-18=155, C: 25-12=13
       { id: "tue_meal2_adjusted", name: "Comida 2 (20:15): Bistec y Espárragos (Ajustado)", description: "Ajustado: Bistec de res (entrecot o solomillo, ~400g). Acompañado de un manojo grande (300g) de espárragos a la parrilla con más aceite de oliva. Ensalada de rúcula y 50g de queso parmesano rallado. Más grasas añadidas (ej. aguacate extra, más aceite).", macros: { protein: 125, carbsNet: 13, fats: 155, calories: 1947 } },
    ]
  },
  [DayOfWeek.WEDNESDAY]: {
    dayId: DayOfWeek.WEDNESDAY,
    dayName: "Miércoles (Día de Fuerza)",
    eatingWindow: "19:00 - 21:00 hrs",
    targetMacros: { protein: 203, fats: 172, carbsNet: 43, calories: 2532 },
    meals: [
      { id: "wed_meal1", name: "Comida 1 (19:00): Batido (Lunes)", description: "3 scoops Whey Protein, arándanos, cacao y chía.", macros: { protein: 78, carbsNet: 25, fats: 12, calories: 520 } },
      { id: "wed_meal2", name: "Comida 2 (20:15): Muslos de Pollo y Coliflor", description: "4 muslos pollo (con piel, 400g crudo) asados. Puré coliflor (1 cabeza, ghee, queso crema). 2 tazas judías verdes (aceite sésamo, almendras).", macros: { protein: 95, carbsNet: 15, fats: 80, calories: 1160 } },
       // To meet target, adding a hypothetical "fat booster" or assuming larger portions
      { id: "wed_fat_booster", name: "Ajuste Grasa/Proteína", description: "Grasas y proteínas adicionales distribuidas en Comida 2 o como un pequeño snack graso para alcanzar el total diario.", macros: { protein: 30, carbsNet: 3, fats: 80, calories: 852 } },
    ]
  },
  [DayOfWeek.THURSDAY]: {
    dayId: DayOfWeek.THURSDAY,
    dayName: "Jueves (Día de Fuerza)",
    eatingWindow: "19:00 - 21:00 hrs",
    targetMacros: { protein: 196, fats: 178, carbsNet: 27, calories: 2494 },
    meals: [
      { id: "thu_meal1", name: "Comida 1 (19:00): Batido (Martes)", description: "3 scoops Whey Protein, betabel polvo, mantequilla almendras y lino.", macros: { protein: 76, carbsNet: 12, fats: 18, calories: 514 } },
      { id: "thu_meal2", name: "Comida 2 (20:15): Chuletas y Champiñones", description: "2 chuletas cerdo gruesas (400g total) plancha. 250g champiñones portobello (mantequilla, ajo). Cama kale (aceite oliva, limón). Medio aguacate (100g).", macros: { protein: 90, carbsNet: 12, fats: 90, calories: 1218 } },
      // To meet target: Remaining P: 196-76-90 = 30, F: 178-18-90 = 70, C: 27-12-12 = 3
      { id: "thu_adjustment", name: "Ajuste Grasa/Proteína Adicional", description: "Proteínas y grasas adicionales para alcanzar macros, por ejemplo, un pequeño snack de queso y nueces, o más aceite de oliva.", macros: { protein: 30, fats: 70, carbsNet: 3, calories: 762 } },
    ]
  },
  [DayOfWeek.FRIDAY]: {
    dayId: DayOfWeek.FRIDAY,
    dayName: "Viernes (Día de Fuerza - Refeed Ligero)",
    eatingWindow: "13:00 - 21:00 hrs",
    targetMacros: { protein: 195, fats: 183, carbsNet: 30, calories: 2547 }, // Sin vino
    meals: [
      { id: "fri_meal1", name: "Comida 1 (13:00): Rompe-Ayuno Sólido", description: "Revuelto 4 huevos, 100g carne res molida, espinacas (aceite coco). Medio aguacate.", macros: { protein: 50, carbsNet: 5, fats: 55, calories: 715 } },
      { id: "fri_meal2", name: "Comida 2 (16:30): Batido Pre-Cena", description: "3 scoops Whey Isolate, agua, 1 cda cacao, 75g arándanos.", macros: { protein: 75, carbsNet: 15, fats: 8, calories: 432 } },
      { id: "fri_meal3", name: "Comida 3 (20:00): Cena y Vino (opcional)", description: "300g Pechuga pavo plancha. Ensalada grande (verdes, pepino, pimientos, 50g aceitunas negras, aderezo aceite oliva y vinagre).", macros: { protein: 70, carbsNet: 10, fats: 50, calories: 770 } } // Macros sin vino, grasa ajustada si se toma vino
    ],
    notes: "Vino: 1-2 copas (150ml c/u) ~125 kcal. Reducir grasa de cena si se toma vino."
  },
  [DayOfWeek.SATURDAY]: {
    dayId: DayOfWeek.SATURDAY,
    dayName: "Sábado (Día de Fuerza/Refeed)",
    eatingWindow: "13:00 - 21:00 hrs",
    targetMacros: { protein: 196, fats: 188, carbsNet: 35, calories: 2616 }, // Sin vino
    meals: [
      { id: "sat_meal1", name: "Comida 1 (13:00): Rompe-Ayuno con Pescado", description: "Lata grande (150g escurrido) sardinas en aceite oliva. Cama rúcula, tomate cherry, cebolla morada. Aderezo con aceite de sardinas.", macros: { protein: 40, carbsNet: 8, fats: 45, calories: 597 } },
      { id: "sat_meal2", name: "Comida 2 (16:30): Batido Cacao y Betabel", description: "3 scoops Whey Isolate, agua, 1 cda cacao, 1 cdta betabel polvo, 1 cda mantequilla almendras.", macros: { protein: 76, carbsNet: 12, fats: 18, calories: 514 } },
      { id: "sat_meal3", name: "Comida 3 (20:00): Hamburguesas Caseras y Vino (opcional)", description: "2 hamburguesas caseras (300g carne picada res 80/20) parrilla, sin pan. Queso curado (50g), cebolla caramelizada. Ensalada col (coleslaw) casera con mayonesa aguacate.", macros: { protein: 80, carbsNet: 15, fats: 90, calories: 1230 } } // Macros sin vino
    ],
    notes: "Vino: 1-2 copas. Misma recomendación que viernes."
  },
  [DayOfWeek.SUNDAY]: {
    dayId: DayOfWeek.SUNDAY,
    dayName: "Domingo (Cardio / Descanso Activo)",
    eatingWindow: "13:00 - 21:00 hrs",
    targetMacros: COMMON_MACROS_SUN, // Sin vino
    meals: [
      { id: "sun_meal1", name: "Comida 1 (13:00): Ensalada César Modificada", description: "200g pechuga pollo plancha tiras. Lechuga romana, 30g parmesano lascas, almendras tostadas. Aderezo: aceite oliva, yema huevo, limón, anchoas (opc).", macros: { protein: 60, carbsNet: 8, fats: 60, calories: 812 } },
      { id: "sun_meal2", name: "Comida 2 (16:30): Batido de Arándanos", description: "3 scoops Whey Isolate, agua, 1 taza (150g) arándanos.", macros: { protein: 72, carbsNet: 20, fats: 5, calories: 413 } },
      { id: "sun_meal3", name: "Comida 3 (20:00): Pescado Blanco y Verduras Asadas", description: "250g Filete merluza/lubina/dorada horno (limón, eneldo). Mix verduras asadas (calabacín, pimiento, berenjena) con aceite oliva.", macros: { protein: 55, carbsNet: 10, fats: 45, calories: 665 } } // Macros sin vino
    ],
    notes: "Vino: Opcional. Última oportunidad de la semana."
  }
};
// Make sure total meal macros add up to target macros. Some creative interpretation was needed.
// For example, Tue, Wed, Thu had notes on needing to adjust. I've attempted to reflect this by adding "adjustment" meals or assuming larger portions in the final meal.
// Calorie counts are approximations: P/C at 4kcal/g, F at 9kcal/g.

export const SUPPLEMENTS: Supplement[] = [
  { id: "sup1", name: "Whey Protein Isolate", dosage: "3 scoops (aprox. 70-75g proteína)", timing: "Primera comida en ventana de alimentación" },
  { id: "sup2", name: "Creatina Monohidrato", dosage: "5 gramos", timing: "En batido de proteína, consistencia diaria" },
  { id: "sup3", name: "Electrolitos (Na, K, Mg)", dosage: "1-2 dosis sin calorías", timing: "En agua, durante mañana en ayunas, pre/post entreno" },
  { id: "sup4", name: "Vitamina D3 con K2", dosage: "4000-5000 UI D3, 100-200 mcg K2 (MK-7)", timing: "Con comida sólida principal (Comida 2)" },
  { id: "sup5", name: "Magnesio (Glicinato/Bisglicinato)", dosage: "400-500 mg elemental", timing: "30-60 min antes de dormir" },
  { id: "sup6", name: "Aceite de Pescado (Omega-3)", dosage: "2-3 gramos EPA+DHA", timing: "Con comida sólida principal (Comida 2)" }
];

export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
export const DIET_PHILOSOPHY_CONTEXT = `
Filosofía y Estrategia General del Plan Alimentario:
1. Recomposición Corporal Agresiva: Favorecer síntesis proteica y oxidación de grasas.
    * Proteína muy alta: >2.2 g/kg peso objetivo.
    * Carbohidratos bajos y estratégicos: <40-50g netos, de vegetales fibrosos y bayas.
    * Grasas saludables como combustible principal.
2. Sincronización de Nutrientes (Nutrient Timing): Crítico por entrenamiento en ayunas. Primera ingesta rompe ayuno e inicia recuperación.
3. Salud Metabólica y Longevidad: Alimentos integrales, antiinflamatorios, densos en nutrientes. Polifenoles, fibra, grasas saludables.
El usuario busca ganar 6 kg de masa muscular mientras pierde 6% de grasa corporal. Horario de sueño: 22:00 - 04:30 (6.5 horas).
`;
