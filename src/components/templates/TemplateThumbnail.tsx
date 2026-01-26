'use client';

export type TemplateVariant =
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'professional'
  | 'technical'
  | 'creative'
  | 'executive'
  | 'clean'
  | 'elegant'
  | 'corporate'
  | 'developer'
  | 'portfolio'
  | 'academic'
  | 'innovative'
  | 'artistic'
  | 'scholar';

interface TemplateThumbnailProps {
  variant: TemplateVariant;
  className?: string;
}

const box = 'rounded overflow-hidden bg-white border border-stone-200 shadow-sm';
const w = 120;
const h = 160;

export default function TemplateThumbnail({ variant, className = '' }: TemplateThumbnailProps) {
  const cn = `${box} ${className}`.trim();

  switch (variant) {
    case 'modern':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="h-1.5 bg-teal-600 w-full" />
          <div className="p-2 space-y-1.5">
            <div className="h-2.5 bg-stone-800 rounded w-4/5" />
            <div className="h-1.5 bg-stone-300 rounded w-1/2" />
            <div className="flex gap-1.5 pt-1">
              <div className="w-1/3 space-y-1">
                <div className="h-1.5 bg-teal-100 rounded w-full" />
                <div className="h-1.5 bg-stone-200 rounded w-full" />
                <div className="h-1.5 bg-stone-200 rounded w-full" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-1.5 bg-stone-200 rounded w-full" />
                <div className="h-1.5 bg-stone-200 rounded w-4/5" />
                <div className="h-1.5 bg-stone-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'classic':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="flex h-full">
            <div className="w-1.5 bg-teal-700 flex-shrink-0" />
            <div className="flex-1 p-2 space-y-1.5">
              <div className="h-2.5 bg-stone-800 rounded w-3/4" />
              <div className="h-1.5 bg-stone-300 rounded w-1/2" />
              <div className="space-y-1 pt-1">
                <div className="h-1.5 bg-stone-200 rounded w-full" />
                <div className="h-1.5 bg-stone-200 rounded w-5/6" />
                <div className="h-1.5 bg-stone-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2.5 flex flex-col items-center">
            <div className="h-2.5 bg-stone-900 rounded w-2/3 mb-3" />
            <div className="h-px bg-stone-200 w-full mb-2" />
            <div className="space-y-1.5 w-full">
              <div className="h-1.5 bg-stone-200 rounded w-full mx-auto" />
              <div className="h-1.5 bg-stone-200 rounded w-4/5 mx-auto" />
              <div className="h-1.5 bg-stone-200 rounded w-full mx-auto" />
            </div>
          </div>
        </div>
      );
    case 'professional':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2 space-y-1">
            <div className="h-2.5 bg-stone-900 rounded w-1/2" />
            <div className="h-1.5 bg-stone-300 rounded w-2/3" />
            <div className="h-px bg-stone-300 my-1.5" />
            <div className="h-1.5 bg-stone-700 rounded w-1/4" />
            <div className="h-1.5 bg-stone-200 rounded w-full" />
            <div className="h-1.5 bg-stone-200 rounded w-5/6" />
            <div className="h-px bg-stone-300 my-1.5" />
            <div className="h-1.5 bg-stone-700 rounded w-1/4" />
            <div className="h-1.5 bg-stone-200 rounded w-full" />
          </div>
        </div>
      );
    case 'technical':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2 bg-stone-50/80 h-full">
            <div className="flex justify-between items-center mb-1.5">
              <div className="h-2.5 bg-stone-800 rounded w-1/3" />
              <div className="h-1.5 bg-stone-400 rounded w-1/4" />
            </div>
            <div className="grid grid-cols-2 gap-1 mb-2">
              <div className="h-1.5 bg-teal-200 rounded" />
              <div className="h-1.5 bg-stone-200 rounded" />
              <div className="h-1.5 bg-stone-200 rounded" />
              <div className="h-1.5 bg-stone-200 rounded" />
            </div>
            <div className="h-1.5 bg-stone-300 rounded w-1/5 mb-1" />
            <div className="h-1.5 bg-stone-200 rounded w-full mb-0.5" />
            <div className="h-1.5 bg-stone-200 rounded w-4/5" />
          </div>
        </div>
      );
    case 'creative':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2">
            <div className="flex gap-1.5 mb-2">
              <div className="w-1 bg-teal-500 rounded-full flex-shrink-0" />
              <div>
                <div className="h-2.5 bg-stone-900 rounded w-20 mb-0.5" />
                <div className="h-1.5 bg-stone-300 rounded w-14" />
              </div>
            </div>
            <div className="flex gap-1.5 border-l-2 border-stone-200 pl-2">
              <div className="w-1/4 space-y-1">
                <div className="h-1.5 bg-teal-100 rounded" />
                <div className="h-1.5 bg-stone-200 rounded" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-1.5 bg-stone-200 rounded w-full" />
                <div className="h-1.5 bg-stone-200 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'executive':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="h-2 bg-stone-900 w-full" />
          <div className="p-2 space-y-1">
            <div className="h-2.5 bg-stone-800 rounded w-2/3 mx-auto" />
            <div className="h-1.5 bg-stone-400 rounded w-1/2 mx-auto" />
            <div className="flex gap-1 pt-1">
              <div className="flex-1 space-y-1">
                <div className="h-1.5 bg-stone-700 rounded w-1/3" />
                <div className="h-1.5 bg-stone-200 rounded w-full" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-1.5 bg-stone-700 rounded w-1/3" />
                <div className="h-1.5 bg-stone-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'clean':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-3 flex flex-col items-center">
            <div className="h-2 bg-stone-900 rounded w-1/2 mb-4" />
            <div className="h-px bg-stone-200 w-full max-w-[80%] mb-3" />
            <div className="space-y-2 w-full max-w-[70%]">
              <div className="h-1.5 bg-stone-200 rounded w-full" />
              <div className="h-1.5 bg-stone-200 rounded w-4/5" />
              <div className="h-1.5 bg-stone-200 rounded w-full" />
            </div>
          </div>
        </div>
      );
    case 'elegant':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="flex h-full">
            <div className="w-2 bg-stone-100 flex-shrink-0" />
            <div className="flex-1 p-2 border-l border-stone-200">
              <div className="h-2.5 bg-stone-800 rounded w-3/4 mb-1" />
              <div className="h-1.5 bg-stone-300 rounded w-1/2 mb-2" />
              <div className="space-y-1">
                <div className="h-1.5 bg-stone-200 rounded w-full" />
                <div className="h-1.5 bg-stone-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'corporate':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2 space-y-1">
            <div className="h-2 bg-stone-900 rounded w-2/5" />
            <div className="h-1 bg-stone-400 rounded w-3/5" />
            <div className="h-px bg-stone-300 my-1" />
            <div className="grid grid-cols-2 gap-1">
              <div className="h-1.5 bg-stone-200 rounded" />
              <div className="h-1.5 bg-stone-200 rounded" />
              <div className="h-1.5 bg-stone-200 rounded" />
              <div className="h-1.5 bg-stone-200 rounded" />
            </div>
            <div className="h-px bg-stone-300 my-1" />
            <div className="h-1.5 bg-stone-200 rounded w-full" />
          </div>
        </div>
      );
    case 'developer':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="h-2 bg-stone-800 w-full" />
          <div className="p-2 space-y-1">
            <div className="flex gap-1 flex-wrap">
              <div className="h-1.5 bg-teal-600 rounded w-8" />
              <div className="h-1.5 bg-stone-400 rounded w-10" />
              <div className="h-1.5 bg-stone-400 rounded w-6" />
            </div>
            <div className="h-1.5 bg-stone-700 rounded w-1/4 font-mono" />
            <div className="h-1.5 bg-stone-200 rounded w-full" />
            <div className="h-1.5 bg-stone-200 rounded w-4/5" />
          </div>
        </div>
      );
    case 'portfolio':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="flex h-full">
            <div className="w-10 bg-stone-300 flex-shrink-0" />
            <div className="flex-1 p-2 space-y-1">
              <div className="h-2.5 bg-stone-800 rounded w-3/4" />
              <div className="h-1.5 bg-stone-300 rounded w-1/2" />
              <div className="space-y-1 pt-1">
                <div className="h-1.5 bg-stone-200 rounded w-full" />
                <div className="h-1.5 bg-stone-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'academic':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2 space-y-1">
            <div className="h-2 bg-stone-900 rounded w-2/3 mx-auto" />
            <div className="h-1 bg-stone-400 rounded w-1/2 mx-auto" />
            <div className="h-1 bg-stone-600 rounded w-1/5" />
            <div className="h-1.5 bg-stone-200 rounded w-full" />
            <div className="h-1 bg-stone-600 rounded w-1/5" />
            <div className="h-1.5 bg-stone-200 rounded w-5/6" />
          </div>
        </div>
      );
    case 'innovative':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2 flex gap-1">
            <div className="flex-1">
              <div className="h-2.5 bg-stone-900 rounded w-full mb-2" />
              <div className="h-1.5 bg-stone-300 rounded w-2/3" />
            </div>
            <div className="w-1.5 bg-teal-500 rounded self-stretch" />
          </div>
          <div className="px-2 pb-2 space-y-1">
            <div className="h-1.5 bg-stone-200 rounded w-full" />
            <div className="h-1.5 bg-stone-200 rounded w-4/5" />
          </div>
        </div>
      );
    case 'artistic':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2">
            <div className="h-3 bg-teal-600 rounded w-full mb-2" />
            <div className="flex gap-1">
              <div className="w-1/3 h-8 bg-stone-200 rounded" />
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-stone-800 rounded w-full" />
                <div className="h-1.5 bg-stone-200 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'scholar':
      return (
        <div className={cn} style={{ width: w, height: h }}>
          <div className="p-2.5 flex flex-col items-center">
            <div className="h-2 bg-stone-900 rounded w-1/2 mb-2" />
            <div className="h-px bg-stone-300 w-full mb-2" />
            <div className="h-1.5 bg-stone-600 rounded w-1/4 self-start mb-1" />
            <div className="h-1.5 bg-stone-200 rounded w-full mb-1" />
            <div className="h-1.5 bg-stone-600 rounded w-1/4 self-start mb-1" />
            <div className="h-1.5 bg-stone-200 rounded w-5/6" />
          </div>
        </div>
      );
    default:
      return <div className={cn} style={{ width: w, height: h }} />;
  }
}
