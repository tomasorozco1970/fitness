
export interface Macros {
  protein: number;
  fats: number;
  carbsNet: number;
  calories: number;
}

export interface MealItem {
  id: string;
  name: string; // e.g., "Comida 1 (19:00 hrs): Batido de Recuperación Post-Ayuno"
  description: string;
  macros: Macros; // Macros for this specific meal
}

export interface DailyPlan {
  dayId: string; // e.g., "monday", "tuesday"
  dayName: string; // e.g., "Lunes (Día de Fuerza)"
  eatingWindow?: string; // e.g., "19:00 - 21:00 hrs"
  meals: MealItem[];
  targetMacros: Macros;
  notes?: string;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  justification?: string; // Optional as not all have it in user text
}

export interface MeasurementRecord {
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercent: number;
}

export interface UserProfile {
  initialWeightKg: number;
  currentWeightKg: number;
  goalWeightKg: number;
  initialBodyFatPercent: number;
  currentBodyFatPercent: number;
  goalBodyFatPercent: number;
  dietStartDate: string; // ISO string for the date diet started
  lastMeasurementUpdate: string; // ISO string for last weight/fat update
  measurementHistory: MeasurementRecord[];
}

export interface ChecklistItem {
  id: string; // meal.id or supplement.id
  completed: boolean;
}

export interface DailyChecklist {
  date: string; // YYYY-MM-DD
  meals: ChecklistItem[];
  supplements: ChecklistItem[];
  customMeals?: MealItem[]; // For storing edited meals for a specific date
}

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export const DAY_ORDER: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

export const dayDisplayName = (dayId: DayOfWeek): string => {
  const names: Record<DayOfWeek, string> = {
    [DayOfWeek.MONDAY]: "Lunes",
    [DayOfWeek.TUESDAY]: "Martes",
    [DayOfWeek.WEDNESDAY]: "Miércoles",
    [DayOfWeek.THURSDAY]: "Jueves",
    [DayOfWeek.FRIDAY]: "Viernes",
    [DayOfWeek.SATURDAY]: "Sábado",
    [DayOfWeek.SUNDAY]: "Domingo",
  };
  return names[dayId];
};
