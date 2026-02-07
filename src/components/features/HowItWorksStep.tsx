import { useTranslation } from '@/hooks/useTranslation';
import { defaultLocale, type ValidLocale } from '@/i18n/settings';

interface HowItWorksStepProps {
  step: number;
  locale?: ValidLocale;
}

export default function HowItWorksStep({ step, locale = defaultLocale }: HowItWorksStepProps) {
  const { t } = useTranslation(locale);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-stone-900 mb-2">
        {t(`home.howItWorks.steps.${step}.title`)}
      </h3>
      <p className="text-sm text-stone-600 leading-relaxed max-w-xs">
        {t(`home.howItWorks.steps.${step}.description`)}
      </p>
    </div>
  );
}
