import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, languageNames } from '@/i18n/settings';

export default function LanguageSelector() {
  const { changeLocale } = useTranslation();

  return (
    <div className="relative group">
      <select
        onChange={(e) => changeLocale(e.target.value as ValidLocale)}
        className="appearance-none bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-8 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-gray-50 transition-colors"
        aria-label="Select language"
      >
        {Object.entries(languageNames).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-4 w-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
} 