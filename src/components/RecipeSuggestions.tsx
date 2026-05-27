'use client';

import { useState } from 'react';
import { useRefrigerator } from '@/context/RefrigeratorContext';
import { ChefHat, Sparkles, Clock, ShoppingCart, Loader2 } from 'lucide-react';

interface Recipe {
  title: string;
  description: string;
  usesExpiring: string[];
  ingredients: string[];
  missingIngredients: string[];
  steps: string[];
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export default function RecipeSuggestions() {
  const { items } = useRefrigerator();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    const payload = {
      items: items.map(item => ({
        name: item.name,
        daysInFridge: Math.floor((Date.now() - item.addedDate) / MS_PER_DAY),
      })),
    };

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Noe gikk galt.');
      } else {
        setRecipes(data.recipes ?? []);
      }
    } catch {
      setError('Klarte ikke å kontakte serveren.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 pb-12">
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="text-blue-500" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Middagsforslag</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          La AI foreslå middager basert på det du har i kjøleskapet — med ekstra vekt på varer som snart går ut.
        </p>
        <button
          onClick={fetchRecipes}
          disabled={loading || items.length === 0}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Tenker...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Foreslå middager
            </>
          )}
        </button>
        {items.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-3">Legg til varer i kjøleskapet først.</p>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {recipes.length > 0 && (
        <div className="mt-6 space-y-4">
          {recipes.map((recipe, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{recipe.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>

              {recipe.usesExpiring.length > 0 && (
                <div className="mb-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <Clock size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800">
                    Bruker opp: <span className="font-medium">{recipe.usesExpiring.join(', ')}</span>
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredienser</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.map((ing, j) => (
                    <span key={j} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-200">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {recipe.missingIngredients.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <ShoppingCart size={14} />
                    Må kjøpes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.missingIngredients.map((ing, j) => (
                      <span key={j} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Slik gjør du</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-600">
                  {recipe.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
