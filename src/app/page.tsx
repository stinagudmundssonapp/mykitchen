import Refrigerator from '@/components/Refrigerator';
import RecipeSuggestions from '@/components/RecipeSuggestions';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Refrigerator />
      <RecipeSuggestions />
    </div>
  );
}
