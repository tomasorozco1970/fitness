
import React from 'react';
import { MealItem } from '../types';

interface MealMacroPieChartProps {
  meal: MealItem;
}

const MealMacroPieChart: React.FC<MealMacroPieChartProps> = ({ meal }) => {
  const { protein, fats, carbsNet } = meal.macros;
  const mealName = meal.name;
  const totalMealCalories = meal.macros.calories;

  const proteinCalories = protein * 4;
  const carbsCalories = carbsNet * 4;
  const fatsCalories = fats * 9;
  
  const calorieBaseForPercentage = totalMealCalories > 0 ? totalMealCalories : (proteinCalories + carbsCalories + fatsCalories);

  const pPercent = calorieBaseForPercentage > 0 ? (proteinCalories / calorieBaseForPercentage) * 100 : 0;
  const cPercent = calorieBaseForPercentage > 0 ? (carbsCalories / calorieBaseForPercentage) * 100 : 0;
  const fPercent = calorieBaseForPercentage > 0 ? (fatsCalories / calorieBaseForPercentage) * 100 : 0;
  
  const totalPercent = pPercent + cPercent + fPercent;
  const pNorm = totalPercent > 0 ? (pPercent / totalPercent) * 100 : (100/3);
  const cNorm = totalPercent > 0 ? (cPercent / totalPercent) * 100 : (100/3);

  const proteinColor = "rgb(244 63 94)"; // Tailwind rose-500
  const carbsColor = "rgb(34 211 238)";   // Tailwind cyan-400
  const fatsColor = "rgb(250 204 21)";    // Tailwind yellow-400

  const gradientStyle = {
    background: `conic-gradient(
      ${proteinColor} 0% ${pNorm.toFixed(1)}%,
      ${carbsColor} ${pNorm.toFixed(1)}% ${(pNorm + cNorm).toFixed(1)}%,
      ${fatsColor} ${(pNorm + cNorm).toFixed(1)}% 100%
    )`,
  };
  
  const totalCalculatedMacroCalories = proteinCalories + carbsCalories + fatsCalories;


  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 transition-shadow duration-300">
      <h4 className="text-lg font-semibold text-teal-600 mb-3">{mealName}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div 
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto sm:mx-0"
          style={gradientStyle}
          role="img"
          aria-label={`Gráfica de macros para ${mealName}: Proteína ${pPercent.toFixed(0)}%, Carbohidratos ${cPercent.toFixed(0)}%, Grasas ${fPercent.toFixed(0)}%`}
        >
        </div>
        <div className="sm:col-span-2">
          <ul className="space-y-1.5 text-sm text-slate-600">
            <li className="flex items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 mr-2 inline-block flex-shrink-0"></span>
              Proteína: {protein.toFixed(0)}g ({pPercent.toFixed(0)}%) - {proteinCalories.toFixed(0)} kcal
            </li>
            <li className="flex items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 mr-2 inline-block flex-shrink-0"></span>
              Carbs Netos: {carbsNet.toFixed(0)}g ({cPercent.toFixed(0)}%) - {carbsCalories.toFixed(0)} kcal
            </li>
            <li className="flex items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 mr-2 inline-block flex-shrink-0"></span>
              Grasas: {fats.toFixed(0)}g ({fPercent.toFixed(0)}%) - {fatsCalories.toFixed(0)} kcal
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
            Total Comida: {totalMealCalories.toFixed(0)} kcal 
            {Math.abs(totalMealCalories - totalCalculatedMacroCalories) > 1 &&
             ` (Macros suman: ${totalCalculatedMacroCalories.toFixed(0)} kcal)`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealMacroPieChart;