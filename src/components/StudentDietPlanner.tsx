import React, { useState } from 'react';
import { 
  Utensils, 
  DollarSign, 
  Clock, 
  RefreshCw, 
  Plus, 
  Tag, 
  Flame,
  Check
} from 'lucide-react';
import { BudgetMealItem, DormFacilities } from '../types';
import { STUDENT_BUDGET_MEALS } from '../data/mockData';

interface StudentDietPlannerProps {
  budgetPerDay: number;
  dormFacilities: DormFacilities;
  fitnessGoal: string;
  initialMeals?: BudgetMealItem[];
  medicalRestrictions?: string;
}

export const StudentDietPlanner: React.FC<StudentDietPlannerProps> = ({
  budgetPerDay,
  dormFacilities,
  fitnessGoal,
  initialMeals,
  medicalRestrictions,
}) => {
  const [meals, setMeals] = useState<BudgetMealItem[]>(
    initialMeals && initialMeals.length > 0 ? initialMeals : STUDENT_BUDGET_MEALS
  );

  React.useEffect(() => {
    if (initialMeals && initialMeals.length > 0) {
      setMeals(initialMeals);
    }
  }, [initialMeals]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New meal form state
  const [newMealName, setNewMealName] = useState('');
  const [newMealType, setNewMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Study Snack'>('Lunch');
  const [newMealCost, setNewMealCost] = useState(1.5);
  const [newMealProtein, setNewMealProtein] = useState(20);
  const [newMealCalories, setNewMealCalories] = useState(400);
  const [newMealAppliances, setNewMealAppliances] = useState('None (No cooking / Ready-to-eat)');

  const totalCost = meals.reduce((sum, m) => sum + m.cost, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.proteinGrams, 0);
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  const handleGenerateDormSwaps = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/meal-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetPerDay,
          cookingFacilities: dormFacilities,
          dietGoal: fitnessGoal,
          foodDislikes: medicalRestrictions || 'None',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.meals) {
          const formatted: BudgetMealItem[] = data.data.meals.map((m: any, idx: number) => ({
            id: `ai-meal-${Date.now()}-${idx}`,
            name: m.name,
            mealType: idx === 0 ? 'Breakfast' : idx === 1 ? 'Lunch' : 'Dinner',
            cost: parseFloat(String(m.costEstimate).replace('$', '')) || 1.5,
            prepTimeMinutes: parseInt(m.prepTime) || 5,
            calories: m.calories || 420,
            proteinGrams: m.proteinGrams || 24,
            appliances: m.appliancesNeeded || 'Microwave / Kettle',
            ingredients: m.groceryList || [],
            studentHack: m.studentHack || 'Quick dorm preparation',
          }));
          setMeals(formatted);
        }
      }
    } catch (err) {
      console.error('Error generating dorm meals:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName.trim()) return;

    const newMeal: BudgetMealItem = {
      id: `custom-meal-${Date.now()}`,
      name: newMealName,
      mealType: newMealType,
      cost: newMealCost,
      prepTimeMinutes: 5,
      calories: newMealCalories,
      proteinGrams: newMealProtein,
      appliances: newMealAppliances,
      ingredients: ['Custom items'],
      studentHack: 'Custom added meal',
    };

    setMeals([...meals, newMeal]);
    setNewMealName('');
    setShowAddModal(false);
  };

  const filteredMeals = activeFilter === 'all' 
    ? meals 
    : meals.filter((m) => m.mealType.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Dorm & Hostel Meal Planner
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Affordable, high-protein meals adapted to dorm microwaves and electric kettles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Meal
          </button>

          <button
            onClick={handleGenerateDormSwaps}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate New Plan'}
          </button>
        </div>
      </div>

      {/* Daily Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Target Budget
          </span>
          <span className="text-lg font-bold text-slate-900">
            ${budgetPerDay.toFixed(2)}/day
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Current Cost
          </span>
          <span className={`text-lg font-bold ${totalCost <= budgetPerDay ? 'text-emerald-600' : 'text-amber-600'}`}>
            ${totalCost.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Protein
          </span>
          <span className="text-lg font-bold text-slate-900">
            {totalProtein}g
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Calories
          </span>
          <span className="text-lg font-bold text-slate-900">
            {totalCalories} kcal
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['all', 'breakfast', 'lunch', 'dinner', 'study snack'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition cursor-pointer ${
              activeFilter === tab
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meal Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {meal.mealType}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {meal.name}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-emerald-700 block">
                  ${meal.cost.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  {meal.prepTimeMinutes}m prep
                </span>
              </div>
            </div>

            {/* Macros & Appliance badge */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span>
                <strong className="text-slate-900 font-semibold">{meal.proteinGrams}g</strong> protein
              </span>
              <span>•</span>
              <span>
                <strong className="text-slate-900 font-semibold">{meal.calories}</strong> kcal
              </span>
              <span>•</span>
              <span>
                Tool: <strong className="text-slate-900 font-semibold">{meal.appliances}</strong>
              </span>
            </div>

            {/* Ingredients */}
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-700 block">Ingredients:</span>
              <p className="text-slate-500">
                {meal.ingredients.join(', ')}
              </p>
            </div>

            {/* Preparation tip */}
            {meal.studentHack && (
              <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Tip:</span> {meal.studentHack}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Custom Meal</h3>

            <form onSubmit={handleAddMeal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Meal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Peanut Butter Banana Toast"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Meal Type</label>
                  <select
                    value={newMealType}
                    onChange={(e) => setNewMealType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Study Snack">Study Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMealCost}
                    onChange={(e) => setNewMealCost(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={newMealProtein}
                    onChange={(e) => setNewMealProtein(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Calories</label>
                  <input
                    type="number"
                    value={newMealCalories}
                    onChange={(e) => setNewMealCalories(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Required Appliance</label>
                <select
                  value={newMealAppliances}
                  onChange={(e) => setNewMealAppliances(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="None (No cooking / Ready-to-eat)">None (No cooking / Ready-to-eat)</option>
                  <option value="Electric Kettle Only">Electric Kettle Only</option>
                  <option value="Microwave Only">Microwave Only</option>
                  <option value="Microwave + Kettle">Microwave + Kettle</option>
                  <option value="Full Kitchen / Stove">Full Kitchen / Stove</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
