import type { TemplateVariant } from '@/components/templates/TemplateThumbnail';

export interface TemplateMeta {
  id: TemplateVariant;
  name: string;
  description: string;
  category: string;
  popular: boolean;
}

export const templates: TemplateMeta[] = [
  { id: 'modern', name: 'Modern', description: 'Sade, iki sütunlu profesyonel tasarım.', category: 'Professional', popular: true },
  { id: 'classic', name: 'Classic', description: 'Sol aksan şeridi, klasik düzen.', category: 'Professional', popular: true },
  { id: 'professional', name: 'Professional', description: 'Bölüm başlıklı, kurumsal görünüm.', category: 'Professional', popular: true },
  { id: 'executive', name: 'Executive', description: 'Üst koyu şerit, üst düzey pozisyonlar için.', category: 'Professional', popular: false },
  { id: 'elegant', name: 'Elegant', description: 'İnce çizgiler, sofistike görünüm.', category: 'Professional', popular: false },
  { id: 'corporate', name: 'Corporate', description: 'Grid yapı, resmi kurumsal stil.', category: 'Professional', popular: false },
  { id: 'minimal', name: 'Minimal', description: 'Az öğe, çok beyaz alan.', category: 'Minimalist', popular: true },
  { id: 'clean', name: 'Clean', description: 'Ultra sade, tek sütun, net odak.', category: 'Minimalist', popular: false },
  { id: 'technical', name: 'Technical', description: 'Yapılandırılmış, teknik profiller için.', category: 'Technical', popular: true },
  { id: 'developer', name: 'Developer', description: 'Koyu header, etiketler; yazılımcılar için.', category: 'Technical', popular: true },
  { id: 'creative', name: 'Creative', description: 'Asimetrik, yaratıcı alanlar için.', category: 'Creative', popular: true },
  { id: 'artistic', name: 'Artistic', description: 'Cesur aksan blokları, tasarım odaklı.', category: 'Creative', popular: false },
  { id: 'portfolio', name: 'Portfolio', description: 'Görsel alan + metin; portföy vurgusu.', category: 'Creative', popular: false },
  { id: 'innovative', name: 'Innovative', description: 'Asimetrik düzen, fark yaratan görünüm.', category: 'Creative', popular: false },
  { id: 'academic', name: 'Academic', description: 'Çok bölüm, akademik ve araştırma için.', category: 'Academic', popular: false },
  { id: 'scholar', name: 'Scholar', description: 'Ortalanmış, formal akademik stil.', category: 'Academic', popular: false },
];

export const categories = [
  { name: 'Tümü', count: templates.length },
  { name: 'Professional', count: templates.filter((t) => t.category === 'Professional').length },
  { name: 'Minimalist', count: templates.filter((t) => t.category === 'Minimalist').length },
  { name: 'Technical', count: templates.filter((t) => t.category === 'Technical').length },
  { name: 'Creative', count: templates.filter((t) => t.category === 'Creative').length },
  { name: 'Academic', count: templates.filter((t) => t.category === 'Academic').length },
];

export function getTemplateById(id: string): TemplateMeta | undefined {
  return templates.find((t) => t.id === id);
}
