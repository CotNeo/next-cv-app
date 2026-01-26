'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'CV Builder nedir?',
    answer: 'CV Builder, profesyonel CV\'ler oluşturmanıza yardımcı olan bir platformdur. AI destekli öneriler, ATS optimizasyonu ve çok sayıda profesyonel şablon sunar.',
  },
  {
    question: 'CV Builder ücretsiz mi?',
    answer: 'Evet, temel özellikler ücretsizdir. Daha gelişmiş özellikler için ücretli planlarımız mevcuttur.',
  },
  {
    question: 'CV\'m güvende mi?',
    answer: 'Evet, tüm verileriniz şifrelenmiş olarak güvenli sunucularda saklanır. Gizlilik politikamızı inceleyebilirsiniz.',
  },
  {
    question: 'CV\'mi PDF olarak indirebilir miyim?',
    answer: 'Evet, CV\'nizi PDF formatında indirebilir ve yazdırabilirsiniz.',
  },
  {
    question: 'CV\'mi başka dillere çevirebilir miyim?',
    answer: 'Evet, AI destekli çeviri özelliğimizle CV\'nizi birden fazla dile çevirebilirsiniz.',
  },
  {
    question: 'Kaç CV oluşturabilirim?',
    answer: 'Ücretsiz planda sınırlı sayıda CV oluşturabilirsiniz. Ücretli planlarda sınırsız CV oluşturma imkanı sunulur.',
  },
  {
    question: 'CV\'mi paylaşabilir miyim?',
    answer: 'Evet, CV\'nizi paylaşılabilir bir link ile paylaşabilir veya PDF olarak indirip gönderebilirsiniz.',
  },
  {
    question: 'ATS nedir ve neden önemlidir?',
    answer: 'ATS (Applicant Tracking System), işverenlerin başvuruları filtrelemek için kullandığı sistemlerdir. CV\'nizin ATS\'lerden geçmesi, iş başvurularınızın görülme şansını artırır.',
  },
  {
    question: 'Hesabımı nasıl silebilirim?',
    answer: 'Hesap ayarlarınızdan hesabınızı silebilirsiniz. Hesap silindiğinde tüm verileriniz kalıcı olarak silinir.',
  },
  {
    question: 'Destek nasıl alabilirim?',
    answer: 'İletişim sayfamızdan veya e-posta yoluyla destek ekibimizle iletişime geçebilirsiniz.',
  },
];

export default function FAQPage() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t('faq.title') || 'Sıkça Sorulan Sorular'}
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed">
            {t('faq.subtitle') || 'CV Builder hakkında merak ettikleriniz'}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <span className="font-semibold text-stone-900 pr-4">
                    {t(`faq.items.${index}.question`) || faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-stone-500 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
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
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-stone-600 leading-relaxed">
                      {t(`faq.items.${index}.answer`) || faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-teal-50 border border-teal-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              {t('faq.cta.title') || 'Hala sorunuz mu var?'}
            </h2>
            <p className="text-stone-600 mb-4">
              {t('faq.cta.description') || 'Bizimle iletişime geçmekten çekinmeyin'}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              {t('faq.cta.button') || 'İletişime Geç'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
