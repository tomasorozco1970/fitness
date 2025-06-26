
import React, { useState, useEffect } from 'react';
import { MealItem, Macros } from '../types';
import Modal from './Modal';

interface EditMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealItem | null;
  onSave: (updatedMeal: MealItem) => void;
}

const calculateCalories = (protein: number, fats: number, carbsNet: number): number => {
  return (protein * 4) + (fats * 9) + (carbsNet * 4);
};

const EditMealModal: React.FC<EditMealModalProps> = ({ isOpen, onClose, meal, onSave }) => {
  const [editedMeal, setEditedMeal] = useState<MealItem | null>(null);
  const [tempMacros, setTempMacros] = useState<Macros | null>(null);

  useEffect(() => {
    if (meal) {
      setEditedMeal(JSON.parse(JSON.stringify(meal))); // Deep copy
      setTempMacros(JSON.parse(JSON.stringify(meal.macros)));
    } else {
      setEditedMeal(null);
      setTempMacros(null);
    }
  }, [meal, isOpen]);

  if (!isOpen || !editedMeal || !tempMacros) return null;

  const handleInputChange = (field: keyof MealItem, value: string) => {
    setEditedMeal(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleMacroChange = (field: keyof Macros, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setTempMacros(prevMacros => {
        if (!prevMacros) return null;
        const newMacros = { ...prevMacros, [field]: numValue };
        if (field !== 'calories') { // Recalculate calories if P, F, or C change
            newMacros.calories = calculateCalories(newMacros.protein, newMacros.fats, newMacros.carbsNet);
        }
        return newMacros;
      });
    } else if (value === "") { // Allow clearing the field
        setTempMacros(prevMacros => {
            if (!prevMacros) return null;
            const newMacros = { ...prevMacros, [field]: 0 }; // Set to 0 if cleared, or handle as needed
             if (field !== 'calories') {
                newMacros.calories = calculateCalories(newMacros.protein, newMacros.fats, newMacros.carbsNet);
            }
            return newMacros;
        });
    }
  };

  const handleSaveChanges = () => {
    if (editedMeal && tempMacros) {
      const finalMeal = { ...editedMeal, macros: tempMacros };
      finalMeal.macros.calories = calculateCalories(finalMeal.macros.protein, finalMeal.macros.fats, finalMeal.macros.carbsNet);
      onSave(finalMeal);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar Comida`}>
      <div className="space-y-4 text-sm">
        <div>
          <label htmlFor="mealName" className="block mb-1 font-medium text-gray-600">Nombre de la Comida:</label>
          <input
            id="mealName"
            type="text"
            value={editedMeal.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="mealDescription" className="block mb-1 font-medium text-gray-600">Descripción:</label>
          <textarea
            id="mealDescription"
            value={editedMeal.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="protein" className="block mb-1 font-medium text-gray-600">Proteína (g):</label>
            <input id="protein" type="number" step="0.1" min="0" value={tempMacros.protein} onChange={e => handleMacroChange('protein', e.target.value)} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="fats" className="block mb-1 font-medium text-gray-600">Grasas (g):</label>
            <input id="fats" type="number" step="0.1" min="0" value={tempMacros.fats} onChange={e => handleMacroChange('fats', e.target.value)} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="carbsNet" className="block mb-1 font-medium text-gray-600">Carbs Netos (g):</label>
            <input id="carbsNet" type="number" step="0.1" min="0" value={tempMacros.carbsNet} onChange={e => handleMacroChange('carbsNet', e.target.value)} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="calories" className="block mb-1 font-medium text-gray-600">Calorías (kcal):</label>
            <input id="calories" type="number" value={tempMacros.calories.toFixed(0)} readOnly className="w-full p-2.5 bg-gray-200 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"/>
          </div>
        </div>
        <button onClick={handleSaveChanges} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow hover:shadow-md transition-all">
          Guardar Cambios
        </button>
      </div>
    </Modal>
  );
};

export default EditMealModal;