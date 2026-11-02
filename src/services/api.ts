import { FilterPreferences, MealPlan, Recipe } from '../types/recipe';

export interface GenerateRecipesResponse {
  recipes: Recipe[];
  isAiGenerated: boolean;
  notice?: string;
  warning?: string;
}

export async function fetchGeneratedRecipes(
  ingredients: string[],
  pantryStaples: string[],
  preferences: FilterPreferences
): Promise<GenerateRecipesResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 28000);

  try {
    const response = await fetch('/api/recipes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        ingredients,
        pantryStaples,
        dietaryRestrictions: preferences.dietaryRestrictions,
        mealType: preferences.mealType,
        cuisine: preferences.cuisine,
        skillLevel: preferences.skillLevel,
        maxCookTimeMinutes: preferences.maxCookTimeMinutes,
        servings: preferences.servings,
        spiceLevel: preferences.spiceLevel,
        appliances: preferences.appliances,
        avoidIngredients: preferences.avoidIngredients,
        calorieGoal: preferences.calorieGoal,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate recipes. Please try again.');
    }

    return await response.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('AI request took longer than expected. Loading curated culinary recipes for you.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function parseIngredientsFromText(textInput: string): Promise<string[]> {
  const response = await fetch('/api/ingredients/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textInput }),
  });

  if (!response.ok) {
    throw new Error('Failed to parse ingredients text');
  }

  const data = await response.json();
  return data.ingredients || [];
}

export async function generateWeeklyMealPlan(params: {
  days: number;
  dietaryRestrictions: string[];
  calorieTargetPerDay: number;
  servings: number;
  availableIngredients: string[];
  dislikedIngredients: string[];
  focusGoal: string;
  cuisinePreference: string;
}): Promise<{ mealPlan: MealPlan; isAiGenerated: boolean }> {
  const response = await fetch('/api/mealplan/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to generate meal plan');
  }

  return response.json();
}

export async function fetchSubstitutes(
  ingredient: string,
  recipeContext?: string,
  dietaryReason?: string
): Promise<{ substitutes: Array<{ substitute: string; ratio: string; flavorProfile: string; cookAdjustment: string }> }> {
  const response = await fetch('/api/recipes/substitute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredient, recipeContext, dietaryReason }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch substitutions');
  }

  return response.json();
  }
