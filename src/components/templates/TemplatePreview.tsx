'use client';

import type { TemplateVariant } from '@/components/templates/TemplateThumbnail';
import TemplateThumbnail from '@/components/templates/TemplateThumbnail';

interface TemplatePreviewProps {
  variant: TemplateVariant;
  className?: string;
}

const PREVIEW_W = 280;
const PREVIEW_H = 373;
const THUMB_W = 120;
const THUMB_H = 160;
const SCALE = PREVIEW_W / THUMB_W;

/** Büyük önizleme: thumbnail scale ile A4 benzeri oranda gösterilir. */
export default function TemplatePreview({ variant, className = '' }: TemplatePreviewProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-stone-200 bg-stone-50 shadow-md ${className}`}
      style={{ width: PREVIEW_W, height: PREVIEW_H }}
    >
      <div
        style={{
          width: THUMB_W,
          height: THUMB_H,
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
        }}
      >
        <TemplateThumbnail variant={variant} />
      </div>
    </div>
  );
}
