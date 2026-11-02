export interface IngredientItem {
  item: string;
  amount: string;
  unit: string;
  notes?: string;
  isPantryStaple?: boolean;
}

export interface InstructionStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
  chefTip?: string;
}

export interface Substitution {
  original: string;
  substitute: string;
  rationale: string;
}

export interface RecipeMacros {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced' | string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  macros: RecipeMacros;
  dietaryTags: string[];
  matchedIngredients: string[];
  additionalPantryNeeded: string[];
  ingredients: IngredientItem[];
  instructions: InstructionStep[];
  substitutions: Substitution[];
  chefNotes: string;
  wineOrBeveragePairing: string;
  isFavorite?: boolean;
  userNotes?: string;
  rating?: number;
}

export interface FilterPreferences {
  cuisine: string;
  dietaryRestrictions: string[];
  mealType: string;
  skillLevel: string;
  maxCookTimeMinutes: number;
  servings: number;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy' | 'Authentic Indian Heat';
  appliances: string[];
  avoidIngredients: string[];
  calorieGoal: string;
}

export interface MealPlanDayMeal {
  title: string;
  prepMinutes: number;
  calories: number;
  keyIngredients: string[];
  recipeId?: string;
}

export interface MealPlanDay {
  day: string;
  meals: {
    breakfast: MealPlanDayMeal;
    lunch: MealPlanDayMeal;
    dinner: MealPlanDayMeal;
  };
}

export interface ConsolidatedGroceryList {
  produce: string[];
  dairyAndProteins: string[];
  dryGoodsAndPantry: string[];
  herbsAndSpices: string[];
}

export interface MealPlan {
  planTitle: string;
  weeklySummary: string;
  days: MealPlanDay[];
  consolidatedGroceryList: ConsolidatedGroceryList;
}
