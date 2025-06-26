
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DIET_PLAN, SUPPLEMENTS } from './constants';
import { UserProfile, DailyPlan, MealItem, Supplement as SupplementType, DailyChecklist, DayOfWeek, DAY_ORDER, dayDisplayName, MeasurementRecord, Macros } from './types';
import { getDailyDietTip, getDietAdjustmentSuggestion } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import Modal from './components/Modal';
import MealMacroPieChart from './components/MealMacroPieChart';
import EditMealModal from './components/EditMealModal';
import LineGraph from './components/LineGraph';
import AddMeasurementModal from './components/AddMeasurementModal';
import MealIcon from './components/MealIcon';

const initialUserProfile: UserProfile = {
  initialWeightKg: 80,
  currentWeightKg: 80,
  goalWeightKg: 74,
  initialBodyFatPercent: 20,
  currentBodyFatPercent: 20,
  goalBodyFatPercent: 14,
  dietStartDate: new Date().toISOString().split('T')[0],
  lastMeasurementUpdate: new Date().toISOString().split('T')[0],
  measurementHistory: [],
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [tempProfile, setTempProfile] = useState<UserProfile>(initialUserProfile);
  const [dailyChecklists, setDailyChecklists] = useState<Record<string, DailyChecklist>>({});
  
  const [displayedDate, setDisplayedDate] = useState<Date>(new Date());

  const [aiDailyTip, setAiDailyTip] = useState<string>('');
  const [isTipLoading, setIsTipLoading] = useState<boolean>(false);
  const [aiAdjustmentSuggestion, setAiAdjustmentSuggestion] = useState<string>('');
  const [isAdjustmentLoading, setIsAdjustmentLoading] = useState<boolean>(false);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [weeklyProgressReport, setWeeklyProgressReport] = useState<string>("");
  const [isProgressReportModalOpen, setIsProgressReportModalOpen] = useState<boolean>(false);
  const [measurementUpdateNeeded, setMeasurementUpdateNeeded] = useState<string>('');

  const [isEditMealModalOpen, setIsEditMealModalOpen] = useState<boolean>(false);
  const [editingMeal, setEditingMeal] = useState<MealItem | null>(null);
  
  const [isAddMeasurementModalOpen, setIsAddMeasurementModalOpen] = useState<boolean>(false);


  useEffect(() => {
    let profileForLogic = { ...initialUserProfile };
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const parsedProfile: UserProfile = JSON.parse(storedProfile);
        if (parsedProfile && typeof parsedProfile.currentWeightKg === 'number' && typeof parsedProfile.lastMeasurementUpdate === 'string') {
          // Ensure measurementHistory is an array, provide default if not
          parsedProfile.measurementHistory = Array.isArray(parsedProfile.measurementHistory) ? parsedProfile.measurementHistory : [];
          setUserProfile(parsedProfile);
          setTempProfile(parsedProfile);
          profileForLogic = parsedProfile;
        } else {
          console.warn("Stored profile data is malformed. Resetting to initial and clearing stored.");
          localStorage.removeItem('userProfile');
          setUserProfile({...initialUserProfile, measurementHistory: []});
          setTempProfile({...initialUserProfile, measurementHistory: []});
          setIsProfileModalOpen(true);
        }
      } catch (e) {
        console.error("Failed to parse userProfile from localStorage", e);
        localStorage.removeItem('userProfile');
        setUserProfile({...initialUserProfile, measurementHistory: []});
        setTempProfile({...initialUserProfile, measurementHistory: []});
        setIsProfileModalOpen(true);
      }
    } else {
      setIsProfileModalOpen(true);
    }

    const storedChecklists = localStorage.getItem('dailyChecklists');
    if (storedChecklists) {
       try {
        const parsedChecklists = JSON.parse(storedChecklists);
        if (typeof parsedChecklists === 'object' && parsedChecklists !== null) {
            setDailyChecklists(parsedChecklists);
        } else {
            console.warn("Stored checklists data is malformed. Clearing.");
            localStorage.removeItem('dailyChecklists');
        }
       } catch (e) {
         console.error("Failed to parse dailyChecklists from localStorage", e);
         localStorage.removeItem('dailyChecklists');
       }
    }

    const lastUpdate = new Date(profileForLogic.lastMeasurementUpdate);
    const today = new Date();
    if (profileForLogic.lastMeasurementUpdate && !isNaN(lastUpdate.getTime())) {
        const daysSinceLastUpdate = (today.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);
        if (daysSinceLastUpdate >= 7) {
            const reminderMsg = `Han pasado ${Math.floor(daysSinceLastUpdate)} días desde tu última actualización de medidas. ¡Considera actualizarla!`;
            setMeasurementUpdateNeeded(reminderMsg);
        }
    } else if (profileForLogic.lastMeasurementUpdate) { 
        console.warn("Invalid lastMeasurementUpdate date in profile:", profileForLogic.lastMeasurementUpdate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('dailyChecklists', JSON.stringify(dailyChecklists));
  }, [dailyChecklists]);

  const getDayOfWeekEnumFromDate = (date: Date): DayOfWeek => {
    const dayNum = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    return DAY_ORDER[dayNum === 0 ? 6 : dayNum - 1]; 
  };

  const currentDayOfWeekEnum = getDayOfWeekEnumFromDate(displayedDate);
  const baseDietDayDetails = DIET_PLAN[currentDayOfWeekEnum];
  const displayedDateString = displayedDate.toISOString().split('T')[0];

  const getMealsForDisplay = useCallback((): MealItem[] => {
    const baseMeals = DIET_PLAN[getDayOfWeekEnumFromDate(displayedDate)].meals;
    const checklistForDate = dailyChecklists[displayedDateString];
    const customMealsForDate = checklistForDate?.customMeals;

    if (!customMealsForDate || customMealsForDate.length === 0) {
      return baseMeals;
    }

    return baseMeals.map(baseMeal => {
      const customVersion = customMealsForDate.find(cm => cm.id === baseMeal.id);
      return customVersion ? customVersion : baseMeal;
    });
  }, [dailyChecklists, displayedDate, displayedDateString]);

  const mealsForDisplay = useMemo(() => getMealsForDisplay(), [getMealsForDisplay]);

  const actualDailyMacros = useMemo((): Macros => {
    return mealsForDisplay.reduce((acc, meal) => {
      acc.protein += meal.macros.protein;
      acc.fats += meal.macros.fats;
      acc.carbsNet += meal.macros.carbsNet;
      acc.calories += meal.macros.calories;
      return acc;
    }, { protein: 0, fats: 0, carbsNet: 0, calories: 0 });
  }, [mealsForDisplay]);


  const getChecklistForDisplayedDate = useCallback((): DailyChecklist => {
    const currentPlanMeals = DIET_PLAN[getDayOfWeekEnumFromDate(displayedDate)].meals;

    if (dailyChecklists[displayedDateString]) {
      const stored = dailyChecklists[displayedDateString];
      const currentPlanMealIds = new Set(currentPlanMeals.map(m => m.id));
      const storedChecklistMealIds = new Set(stored.meals.map(m => m.id));
      
      let mealIdsMatch = storedChecklistMealIds.size === currentPlanMealIds.size;
      if (mealIdsMatch) {
        for (const id of storedChecklistMealIds) {
          if (!currentPlanMealIds.has(id)) {
            mealIdsMatch = false;
            break;
          }
        }
      }
      
      if (stored.meals.length === currentPlanMeals.length && 
          stored.supplements.length === SUPPLEMENTS.length &&
          mealIdsMatch) {
        return stored;
      } else {
         console.warn(`Checklist for ${displayedDateString} has structural mismatch or missing customMeals field. Re-initializing.`);
      }
    }
    return {
      date: displayedDateString,
      meals: currentPlanMeals.map(m => ({ id: m.id, completed: false })),
      supplements: SUPPLEMENTS.map(s => ({ id: s.id, completed: false })),
      customMeals: [], // Initialize with empty customMeals
    };
  }, [dailyChecklists, displayedDateString, displayedDate]);


  const handleToggleChecklistItem = (itemId: string, type: 'meal' | 'supplement') => {
    setDailyChecklists(prev => {
      const checklist = JSON.parse(JSON.stringify(getChecklistForDisplayedDate())); 
      const listToUpdate = type === 'meal' ? checklist.meals : checklist.supplements;
      const itemIndex = listToUpdate.findIndex(item => item.id === itemId);
      if (itemIndex > -1) {
        listToUpdate[itemIndex].completed = !listToUpdate[itemIndex].completed;
      }
      return { ...prev, [displayedDateString]: checklist };
    });
  };

  const handleFetchDailyTip = async () => {
    setIsTipLoading(true);
    setAiDailyTip('');
    const tip = await getDailyDietTip();
    setAiDailyTip(tip);
    setIsTipLoading(false);
  };

  const handleFetchAdjustmentSuggestion = async () => {
    if(!weeklyProgressReport.trim()){
      alert("Por favor, describe tu progreso semanal antes de pedir una sugerencia.");
      setIsProgressReportModalOpen(true);
      return;
    }
    setIsAdjustmentLoading(true);
    setAiAdjustmentSuggestion('');
    const suggestion = await getDietAdjustmentSuggestion(userProfile, baseDietDayDetails, weeklyProgressReport);
    setAiAdjustmentSuggestion(suggestion);
    setIsAdjustmentLoading(false);
    setIsProgressReportModalOpen(false); 
  };
  
  const handleProfileInputChange = <K extends keyof UserProfile,>(field: K, value: UserProfile[K]) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    if (isNaN(Number(tempProfile.initialWeightKg)) || Number(tempProfile.initialWeightKg) <= 0 ||
        isNaN(Number(tempProfile.currentWeightKg)) || Number(tempProfile.currentWeightKg) <= 0 ||
        isNaN(Number(tempProfile.goalWeightKg)) || Number(tempProfile.goalWeightKg) <= 0 ||
        isNaN(Number(tempProfile.initialBodyFatPercent)) || Number(tempProfile.initialBodyFatPercent) < 0 ||
        isNaN(Number(tempProfile.currentBodyFatPercent)) || Number(tempProfile.currentBodyFatPercent) < 0 ||
        isNaN(Number(tempProfile.goalBodyFatPercent)) || Number(tempProfile.goalBodyFatPercent) < 0 ||
        !tempProfile.dietStartDate 
        ) {
      alert("Por favor, introduce valores numéricos válidos y asegúrate que todos los campos estén completos.");
      return;
    }
    
    const todayStr = getTodayDateString();
    const newMeasurementHistory = [...(tempProfile.measurementHistory || [])];
    const todayRecordIndex = newMeasurementHistory.findIndex(record => record.date === todayStr);

    const newRecord: MeasurementRecord = {
      date: todayStr,
      weightKg: Number(tempProfile.currentWeightKg),
      bodyFatPercent: Number(tempProfile.currentBodyFatPercent),
    };

    if (todayRecordIndex > -1) {
      if(newMeasurementHistory[todayRecordIndex].weightKg !== newRecord.weightKg || newMeasurementHistory[todayRecordIndex].bodyFatPercent !== newRecord.bodyFatPercent) {
        newMeasurementHistory[todayRecordIndex] = newRecord;
      }
    } else {
      newMeasurementHistory.push(newRecord);
    }
    newMeasurementHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const updatedProfile: UserProfile = {
      initialWeightKg: Number(tempProfile.initialWeightKg),
      currentWeightKg: Number(tempProfile.currentWeightKg),
      goalWeightKg: Number(tempProfile.goalWeightKg),
      initialBodyFatPercent: Number(tempProfile.initialBodyFatPercent),
      currentBodyFatPercent: Number(tempProfile.currentBodyFatPercent),
      goalBodyFatPercent: Number(tempProfile.goalBodyFatPercent),
      dietStartDate: tempProfile.dietStartDate,
      lastMeasurementUpdate: todayStr, 
      measurementHistory: newMeasurementHistory,
    };
    
    setUserProfile(updatedProfile);
    setTempProfile(updatedProfile); 
    setIsProfileModalOpen(false);
    setMeasurementUpdateNeeded(''); 
  };
  
  const handleSaveManualMeasurement = (date: string, weightKg: number, bodyFatPercent: number) => {
    const newRecord: MeasurementRecord = { date, weightKg, bodyFatPercent };
    const newHistory = [...userProfile.measurementHistory];
    const existingRecordIndex = newHistory.findIndex(r => r.date === date);

    if (existingRecordIndex > -1) {
      newHistory[existingRecordIndex] = newRecord;
    } else {
      newHistory.push(newRecord);
    }

    newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const latestRecord = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;

    setUserProfile(prev => ({
      ...prev,
      measurementHistory: newHistory,
      currentWeightKg: latestRecord ? latestRecord.weightKg : prev.currentWeightKg,
      currentBodyFatPercent: latestRecord ? latestRecord.bodyFatPercent : prev.currentBodyFatPercent,
      lastMeasurementUpdate: latestRecord ? latestRecord.date : prev.lastMeasurementUpdate,
    }));

    setIsAddMeasurementModalOpen(false);
  };


  const navigateDay = (direction: 'prev' | 'next') => {
    setDisplayedDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'next') {
        newDate.setDate(newDate.getDate() + 1);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
    setAiDailyTip('');
    setAiAdjustmentSuggestion('');
  };

  const openProgressReportModal = () => {
    let initialReportText = "";
    const lastUpdateDate = new Date(userProfile.lastMeasurementUpdate);
    const today = new Date();
    
    if (userProfile.lastMeasurementUpdate && !isNaN(lastUpdateDate.getTime())) {
        const daysSinceLastUpdate = (today.getTime() - lastUpdateDate.getTime()) / (1000 * 3600 * 24);
        if (daysSinceLastUpdate < 2) { 
            const weightChangeSinceStart = userProfile.initialWeightKg - userProfile.currentWeightKg;
            const fatChangeSinceStart = userProfile.initialBodyFatPercent - userProfile.currentBodyFatPercent;
            initialReportText = 
`Actualicé mis medidas recientemente.
Peso actual: ${userProfile.currentWeightKg.toFixed(1)} kg (cambio total desde inicio: ${weightChangeSinceStart.toFixed(1)} kg).
Grasa corporal actual: ${userProfile.currentBodyFatPercent.toFixed(1)}% (cambio total desde inicio: ${fatChangeSinceStart.toFixed(1)}%).

[Describe aquí cómo te has sentido esta semana, tu energía, adherencia al plan, calidad del sueño, etc.]`;
        }
    }
    setWeeklyProgressReport(initialReportText);
    setIsProgressReportModalOpen(true);
  };
  
  const checklistDataForDisplayedDate = getChecklistForDisplayedDate();

  const completedMealsCount = checklistDataForDisplayedDate.meals.filter(m => m.completed).length;
  const mealProgressPercent = mealsForDisplay.length > 0 ? (completedMealsCount / mealsForDisplay.length) * 100 : 0;

  const weightLost = userProfile.initialWeightKg - userProfile.currentWeightKg;
  const fatLost = userProfile.initialBodyFatPercent - userProfile.currentBodyFatPercent;

  const handleOpenEditMealModal = (meal: MealItem) => {
    setEditingMeal(meal);
    setIsEditMealModalOpen(true);
  };

  const handleSaveEditedMeal = (updatedMeal: MealItem) => {
    setDailyChecklists(prev => {
      const newChecklists = { ...prev };
      const checklistForDate = JSON.parse(JSON.stringify(getChecklistForDisplayedDate()));
      
      if (!checklistForDate.customMeals) {
        checklistForDate.customMeals = [];
      }

      const mealIndex = checklistForDate.customMeals.findIndex(cm => cm.id === updatedMeal.id);
      if (mealIndex > -1) {
        checklistForDate.customMeals[mealIndex] = updatedMeal;
      } else {
        checklistForDate.customMeals.push(updatedMeal);
      }
      newChecklists[displayedDateString] = checklistForDate;
      return newChecklists;
    });
    setEditingMeal(null);
    setIsEditMealModalOpen(false);
  };
  
  const weightHistoryForGraph = userProfile.measurementHistory.map((record, index) => ({
    x: index,
    y: record.weightKg,
    originalDate: record.date,
  }));

  const bodyFatHistoryForGraph = userProfile.measurementHistory.map((record, index) => ({
    x: index,
    y: record.bodyFatPercent,
    originalDate: record.date,
  }));

  const UserAvatar = () => (
    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center ring-4 ring-white shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-slate-700 p-3 md:p-4 max-w-2xl mx-auto">
      
      <section className="mb-8 p-4 bg-white rounded-xl shadow-md">
        <div className="flex items-center space-x-4 mb-4">
          <UserAvatar />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Mi Progreso</h2>
            <p className="text-sm text-gray-500">Última actualización: {new Date(userProfile.lastMeasurementUpdate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">Peso Actual</div>
                <div className="text-lg font-bold text-teal-600">{userProfile.currentWeightKg.toFixed(1)} kg</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">% Grasa</div>
                <div className="text-lg font-bold text-teal-600">{userProfile.currentBodyFatPercent.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">Peso Perdido</div>
                <div className="text-lg font-bold text-rose-500">{weightLost.toFixed(1)} kg</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">Grasa Perdida</div>
                <div className="text-lg font-bold text-rose-500">{fatLost.toFixed(1)}%</div>
            </div>
        </div>
        <button onClick={() => { setTempProfile(JSON.parse(JSON.stringify(userProfile))); setIsProfileModalOpen(true);}} className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-semibold shadow hover:shadow-md transition-all">
          Editar Perfil y Metas
        </button>
      </section>

      {measurementUpdateNeeded && (
        <div className="mb-6 p-3 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-sm shadow-md">
          {measurementUpdateNeeded}
        </div>
      )}

      <section className="mb-8 p-4 bg-white rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">Historial de Progreso</h2>
          <button onClick={() => setIsAddMeasurementModalOpen(true)} className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded-lg text-sm font-semibold shadow hover:shadow-md transition-all">
            Añadir
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <LineGraph data={weightHistoryForGraph} title="Evolución del Peso" yLabel="Peso (kg)" color="rgb(20 184 166)" />
            <LineGraph data={bodyFatHistoryForGraph} title="Evolución del % Grasa" yLabel="% Grasa" color="rgb(250 204 21)" />
        </div>
        {userProfile.measurementHistory.length > 0 && (
            <div>
                <div className="max-h-48 overflow-y-auto bg-gray-50 p-2 rounded-lg text-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="p-2 border-b border-gray-200">Fecha</th>
                                <th className="p-2 border-b border-gray-200 text-center">Peso (kg)</th>
                                <th className="p-2 border-b border-gray-200 text-center">% Grasa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userProfile.measurementHistory.slice().reverse().map(record => (
                                <tr key={record.date} className="border-b border-gray-200/50 hover:bg-gray-200/50">
                                    <td className="p-2 font-medium">{new Date(record.date + 'T00:00:00').toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'2-digit'})}</td>
                                    <td className="p-2 text-center">{record.weightKg.toFixed(1)}</td>
                                    <td className="p-2 text-center">{record.bodyFatPercent.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigateDay('prev')} className="bg-teal-500 hover:bg-teal-600 p-2.5 rounded-full text-white text-xl leading-none shadow hover:shadow-md transition-all" aria-label="Día anterior">‹</button>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-teal-600">
              {dayDisplayName(currentDayOfWeekEnum)} 
            </h2>
            <span className="block text-lg text-gray-500">({new Date(displayedDateString+'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })})</span>
          </div>
          <button onClick={() => navigateDay('next')} className="bg-teal-500 hover:bg-teal-600 p-2.5 rounded-full text-white text-xl leading-none shadow hover:shadow-md transition-all" aria-label="Día siguiente">›</button>
        </div>
        <p className="text-center text-amber-600 font-medium mb-1">{baseDietDayDetails.dayName}</p>
        {baseDietDayDetails.eatingWindow && <p className="text-center text-gray-500 text-sm mb-4">Ventana: {baseDietDayDetails.eatingWindow}</p>}
        
        <div className="p-4 bg-white rounded-xl shadow-md mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Macros Planificados para Hoy:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <span>P: <span className="font-bold text-rose-500">{actualDailyMacros.protein.toFixed(0)}g</span></span>
            <span>G: <span className="font-bold text-yellow-500">{actualDailyMacros.fats.toFixed(0)}g</span></span>
            <span>C: <span className="font-bold text-cyan-500">{actualDailyMacros.carbsNet.toFixed(0)}g</span></span>
            <span>Cal: <span className="font-bold text-slate-600">{actualDailyMacros.calories.toFixed(0)}</span></span>
          </div>
           { (Math.abs(actualDailyMacros.calories - baseDietDayDetails.targetMacros.calories) > 10 ||
             Math.abs(actualDailyMacros.protein - baseDietDayDetails.targetMacros.protein) > 5) &&
            <p className="text-xs text-gray-400 mt-2">
                (Meta del plan: P:{baseDietDayDetails.targetMacros.protein}g, G:{baseDietDayDetails.targetMacros.fats}g, C:{baseDietDayDetails.targetMacros.carbsNet}g, Cal:{baseDietDayDetails.targetMacros.calories})
            </p>
           }
        </div>

        <div className="mb-6">
          <p className="text-xs text-right mb-1 text-gray-500">{completedMealsCount}/{mealsForDisplay.length} comidas ({mealProgressPercent.toFixed(0)}%)</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-teal-500 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${mealProgressPercent}%` }} aria-valuenow={mealProgressPercent} aria-valuemin={0} aria-valuemax={100}></div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-slate-800">Comidas del Día:</h3>
          {mealsForDisplay.map((meal) => (
            <div key={meal.id} className="bg-white rounded-xl shadow-md transition-shadow duration-300 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <MealIcon mealName={meal.name} />
                </div>
                <div className="flex-grow flex justify-between items-start">
                    <div className="flex-grow">
                      <h4 className="font-bold text-teal-700">{meal.name}</h4>
                      <p className="text-sm text-gray-600 my-1 whitespace-pre-wrap break-words">{meal.description}</p>
                      <p className="text-xs text-gray-400">
                        Macros: P:{meal.macros.protein.toFixed(0)}g, G:{meal.macros.fats.toFixed(0)}g, C:{meal.macros.carbsNet.toFixed(0)}g, Cal:{meal.macros.calories.toFixed(0)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-2 shrink-0 space-y-2">
                        <input
                        type="checkbox"
                        id={`meal-${displayedDateString}-${meal.id}`}
                        checked={checklistDataForDisplayedDate.meals.find(m => m.id === meal.id)?.completed || false}
                        onChange={() => handleToggleChecklistItem(meal.id, 'meal')}
                        className="form-checkbox h-6 w-6 text-teal-500 bg-gray-100 border-gray-300 rounded-md focus:ring-teal-400 cursor-pointer"
                        aria-labelledby={`meal-label-${meal.id}`}
                        />
                        <label id={`meal-label-${meal.id}`} htmlFor={`meal-${displayedDateString}-${meal.id}`} className="sr-only">Completar {meal.name}</label>
                        <button onClick={() => handleOpenEditMealModal(meal)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-teal-600 hover:text-teal-700 transition-colors" aria-label={`Editar ${meal.name}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
          {baseDietDayDetails.notes && <p className="text-xs italic text-gray-500 mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">{baseDietDayDetails.notes}</p>}
        </div>

        <div className="p-4 bg-white rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Suplementos Diarios:</h3>
          <div className="space-y-3">
            {SUPPLEMENTS.map((supplement) => (
              <div key={supplement.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center transition-shadow duration-300">
                <div>
                  <h4 className="font-semibold text-teal-700 text-sm">{supplement.name}</h4>
                  <p className="text-xs text-gray-500">{supplement.dosage} - {supplement.timing}</p>
                </div>
                <input
                  type="checkbox"
                  id={`supplement-${displayedDateString}-${supplement.id}`}
                  checked={checklistDataForDisplayedDate.supplements.find(s => s.id === supplement.id)?.completed || false}
                  onChange={() => handleToggleChecklistItem(supplement.id, 'supplement')}
                  className="form-checkbox h-5 w-5 text-teal-500 bg-gray-200 border-gray-300 rounded focus:ring-teal-400 ml-4 shrink-0 cursor-pointer"
                  aria-labelledby={`supplement-label-${supplement.id}`}
                />
                <label id={`supplement-label-${supplement.id}`} htmlFor={`supplement-${displayedDateString}-${supplement.id}`} className="sr-only">Completar {supplement.name}</label>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="my-8 p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Análisis de Macros por Comida</h2>
        <div className="space-y-6">
          {mealsForDisplay.map((meal) => (
            <MealMacroPieChart key={`pie-${displayedDateString}-${meal.id}`} meal={meal} />
          ))}
        </div>
      </section>

      <section className="my-8 p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Consejos y Ajustes con IA 🤖</h2>
        
        <div className="mb-6">
          <button onClick={handleFetchDailyTip} disabled={isTipLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-4 rounded-lg disabled:opacity-50 shadow hover:shadow-md transition-all">
            {isTipLoading ? 'Obteniendo consejo...' : 'Dame un Consejo para Hoy'}
          </button>
          {isTipLoading && <LoadingSpinner />}
          {aiDailyTip && <p className="mt-3 p-3 bg-gray-100 rounded-lg text-sm text-slate-600 whitespace-pre-wrap shadow-inner">{aiDailyTip}</p>}
        </div>

        <div>
          <button onClick={openProgressReportModal} disabled={isAdjustmentLoading} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg disabled:opacity-50 shadow hover:shadow-md transition-all">
            {isAdjustmentLoading ? 'Analizando...' : 'Analizar Mi Progreso'}
          </button>
          {isAdjustmentLoading && <LoadingSpinner />}
          {aiAdjustmentSuggestion && <p className="mt-3 p-3 bg-gray-100 rounded-lg text-sm text-slate-600 whitespace-pre-wrap shadow-inner">{aiAdjustmentSuggestion}</p>}
        </div>
      </section>
      
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Editar Perfil y Metas">
        <div className="space-y-4 text-sm">
          <div>
            <label htmlFor="initialWeightKg" className="block mb-1 font-medium text-gray-600">Peso Inicial (kg):</label>
            <input id="initialWeightKg" type="number" step="0.1" value={tempProfile.initialWeightKg} onChange={e => handleProfileInputChange('initialWeightKg', parseFloat(e.target.value))} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="currentWeightKg" className="block mb-1 font-medium text-gray-600">Peso Actual (kg):</label>
            <input id="currentWeightKg" type="number" step="0.1" value={tempProfile.currentWeightKg} onChange={e => handleProfileInputChange('currentWeightKg', parseFloat(e.target.value))} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="goalWeightKg" className="block mb-1 font-medium text-gray-600">Meta de Peso (kg):</label>
            <input id="goalWeightKg" type="number" step="0.1" value={tempProfile.goalWeightKg} onChange={e => handleProfileInputChange('goalWeightKg', parseFloat(e.target.value))} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
           <div>
            <label htmlFor="initialBodyFatPercent" className="block mb-1 font-medium text-gray-600">% Grasa Corporal Inicial:</label>
            <input id="initialBodyFatPercent" type="number" step="0.1" value={tempProfile.initialBodyFatPercent} onChange={e => handleProfileInputChange('initialBodyFatPercent', parseFloat(e.target.value))} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="currentBodyFatPercent" className="block mb-1 font-medium text-gray-600">% Grasa Corporal Actual:</label>
            <input id="currentBodyFatPercent" type="number" step="0.1" value={tempProfile.currentBodyFatPercent} onChange={e => handleProfileInputChange('currentBodyFatPercent', parseFloat(e.target.value))} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="goalBodyFatPercent" className="block mb-1 font-medium text-gray-600">Meta de % Grasa Corporal:</label>
            <input id="goalBodyFatPercent" type="number" step="0.1" value={tempProfile.goalBodyFatPercent} onChange={e => handleProfileInputChange('goalBodyFatPercent', parseFloat(e.target.value))} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="dietStartDate" className="block mb-1 font-medium text-gray-600">Fecha Inicio Dieta:</label>
            <input id="dietStartDate" type="date" value={tempProfile.dietStartDate} onChange={e => handleProfileInputChange('dietStartDate', e.target.value)} className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 calendar-picker-indicator-slate"/>
          </div>
          <button onClick={saveProfile} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow hover:shadow-md transition-all">Guardar Perfil y Medición Actual</button>
        </div>
      </Modal>

      <Modal isOpen={isProgressReportModalOpen} onClose={() => setIsProgressReportModalOpen(false)} title="Reporte de Progreso Semanal">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Describe brevemente tu progreso o estancamiento esta semana. Esta información se usará para la sugerencia de IA.</p>
          <textarea 
            value={weeklyProgressReport}
            onChange={(e) => setWeeklyProgressReport(e.target.value)}
            rows={6} 
            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm whitespace-pre-wrap"
            placeholder="Escribe tu reporte aquí..."
            aria-label="Reporte de progreso semanal"
          />
          <button onClick={handleFetchAdjustmentSuggestion} disabled={isAdjustmentLoading || !weeklyProgressReport.trim()} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg disabled:opacity-60 shadow hover:shadow-md transition-all">
            {isAdjustmentLoading ? 'Enviando...' : 'Enviar y Obtener Sugerencia'}
          </button>
        </div>
      </Modal>
      
      <AddMeasurementModal
        isOpen={isAddMeasurementModalOpen}
        onClose={() => setIsAddMeasurementModalOpen(false)}
        onSave={handleSaveManualMeasurement}
        latestWeight={userProfile.currentWeightKg}
        latestBodyFat={userProfile.currentBodyFatPercent}
      />


      {editingMeal && (
        <EditMealModal
            isOpen={isEditMealModalOpen}
            onClose={() => { setIsEditMealModalOpen(false); setEditingMeal(null);}}
            meal={editingMeal}
            onSave={handleSaveEditedMeal}
        />
      )}

      <footer className="text-center mt-12 py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Diet & Fitness Tracker AI.</p>
        <p className="text-xs text-gray-400 mt-1">Recuerda: Este plan es una guía. Escucha a tu cuerpo y consulta a un profesional.</p>
      </footer>
    </div>
  );
};

export default App;
