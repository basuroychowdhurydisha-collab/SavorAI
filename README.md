# SavorAI — AI Recipe Generator & Meal Planner

A full-stack, AI-powered kitchen assistant and meal planner specializing in **Continental** and **Indian** gastronomy, along with international cuisines. Built with React 19, TypeScript, Tailwind CSS v4, Express, Recharts, and Google Gemini (`@google/genai`).

---

## 🌟 Key Features

1. **Smart Pantry & Ingredient Input**
   - Quick categorized buttons (Indian Spices & Staples, Continental Essentials, Fresh Produce, Proteins, Dairy, Grains).
   - "Smart Fridge Dump / Text Paste" that parses free-form notes or grocery lists into structured ingredients.
   - Persistent pantry staples and allergy/avoid lists saved in browser storage.

2. **Continental & Indian Gastronomy Focus**
   - **Continental:** Classical techniques like *monter au beurre* (cold butter emulsion), pan fond deglazing with white wine/broth, and mushroom velouté stroganoffs.
   - **Indian:** Authentic *tadka / chhonk* (sizzling spice tempering in hot ghee), slow *bhunao* of onion-ginger-garlic-tomato masala, and royal *shahi paneer* / *dhaba dal tadka*.
   - Dedicated **Continental & Indian Showcase** tab with technique guides and one-click preset kits.

3. **Step-by-Step Hands-Free Cook Mode**
   - Kitchen-counter friendly high-contrast view with large step numbers.
   - Integrated countdown kitchen timers with Web Audio chime alerts.
   - Voice assistant ("Read Step Aloud") using browser Web Speech API.
   - In-step ingredient drawer and celebratory confetti upon completion.

4. **Weekly Meal Planner & Consolidated Shopping List**
   - 7-Day calendar for Breakfast, Lunch, and Dinner.
   - Weekly Meal Plan generation based on dietary restrictions and calorie targets.
   - Consolidated grocery checklist categorized by supermarket aisle (*Produce, Dairy & Proteins, Dry Goods, Herbs & Spices*).

5. **Dynamic Servings Scaler & AI Substitutions**
   - Dynamically scales ingredient amounts as you change portion count.
   - Instant AI culinary substitutions lookup with measurement ratios and cooking tips.

6. **Interactive Calorie Trends & Weekly Recharts Analytics**
   - Visualizes 7-day caloric intake with smooth trend lines, area fill, and a 2,000 kcal target baseline.
   - Interactive meal-by-meal stacked bar breakdown (Breakfast, Lunch, Dinner).
   - Calorie and macro nutrient summary badges on all recipe cards (`🔥 [cal] kcal | [P]g P · [C]g C · [F]g F`).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide React, Canvas Confetti
- **Backend:** Node.js, Express, tsx
- **AI Engine:** Google Gemini via `@google/genai` TypeScript SDK
- **Build Tool:** Vite

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/savor-ai.git
cd savor-ai
