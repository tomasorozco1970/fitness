
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface AddMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, weightKg: number, bodyFatPercent: number) => void;
  latestWeight: number;
  latestBodyFat: number;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({ isOpen, onClose, onSave, latestWeight, latestBodyFat }) => {
  const [date, setDate] = useState(getTodayDateString());
  const [weight, setWeight] = useState(latestWeight);
  const [bodyFat, setBodyFat] = useState(latestBodyFat);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDate(getTodayDateString());
      setWeight(latestWeight);
      setBodyFat(latestBodyFat);
      setError('');
    }
  }, [isOpen, latestWeight, latestBodyFat]);

  const handleSave = () => {
    const weightNum = Number(weight);
    const bodyFatNum = Number(bodyFat);

    if (!date) {
      setError('Por favor, selecciona una fecha.');
      return;
    }
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Por favor, introduce un peso válido.');
      return;
    }
    if (isNaN(bodyFatNum) || bodyFatNum < 0) {
      setError('Por favor, introduce un porcentaje de grasa válido.');
      return;
    }

    setError('');
    onSave(date, weightNum, bodyFatNum);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Medición Manual">
      <div className="space-y-4 text-sm">
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
        <div>
          <label htmlFor="measurementDate" className="block mb-1 font-medium text-gray-600">Fecha de la Medición:</label>
          <input
            id="measurementDate"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            max={getTodayDateString()} // Prevent selecting future dates
          />
        </div>
        <div>
          <label htmlFor="manualWeight" className="block mb-1 font-medium text-gray-600">Peso (kg):</label>
          <input
            id="manualWeight"
            type="number"
            step="0.1"
            min="0"
            value={weight}
            onChange={e => setWeight(parseFloat(e.target.value))}
            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="manualBodyFat" className="block mb-1 font-medium text-gray-600">% Grasa Corporal:</label>
          <input
            id="manualBodyFat"
            type="number"
            step="0.1"
            min="0"
            value={bodyFat}
            onChange={e => setBodyFat(parseFloat(e.target.value))}
            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow hover:shadow-md transition-all"
        >
          Guardar Medición
        </button>
      </div>
    </Modal>
  );
};

export default AddMeasurementModal;