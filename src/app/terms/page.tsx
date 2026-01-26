'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t('terms.title') || 'Kullanım Koşulları'}
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed">
            {t('terms.subtitle') || 'Son güncelleme: 26 Ocak 2026'}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-stone-200 p-8 sm:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.acceptance.title') || '1. Kullanım Koşullarını Kabul Etme'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.acceptance.content') || 'CV Builder hizmetlerini kullanarak, bu Kullanım Koşullarını kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayın.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.account.title') || '2. Hesap Sorumluluğu'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.account.content') || 'Hesap oluştururken:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('terms.account.item1') || 'Doğru ve güncel bilgiler sağlamalısınız'}</li>
                <li>{t('terms.account.item2') || 'Hesap bilgilerinizin gizliliğinden sorumlusunuz'}</li>
                <li>{t('terms.account.item3') || 'Hesabınız altında yapılan tüm faaliyetlerden sorumlusunuz'}</li>
                <li>{t('terms.account.item4') || 'Şüpheli faaliyetleri derhal bildirmelisiniz'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.use.title') || '3. Hizmet Kullanımı'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.use.content') || 'Hizmetlerimizi kullanırken:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('terms.use.item1') || 'Yalnızca yasal amaçlar için kullanmalısınız'}</li>
                <li>{t('terms.use.item2') || 'Başkalarının haklarını ihlal etmemelisiniz'}</li>
                <li>{t('terms.use.item3') || 'Zararlı yazılım veya kod yüklememelisiniz'}</li>
                <li>{t('terms.use.item4') || 'Hizmetlerimizi bozmaya veya engellemeye çalışmamalısınız'}</li>
                <li>{t('terms.use.item5') || 'Başkalarının hesaplarına yetkisiz erişim sağlamamalısınız'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.content.title') || '4. İçerik Sorumluluğu'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.content.content') || 'CV\'nize eklediğiniz içerikten siz sorumlusunuz. İçeriğiniz:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('terms.content.item1') || 'Yasalara uygun olmalıdır'}</li>
                <li>{t('terms.content.item2') || 'Telif hakkı veya diğer hakları ihlal etmemelidir'}</li>
                <li>{t('terms.content.item3') || 'Yanıltıcı, zararlı veya saldırgan olmamalıdır'}</li>
                <li>{t('terms.content.item4') || 'Kişisel verilerin korunması yasalarına uygun olmalıdır'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.intellectual.title') || '5. Fikri Mülkiyet'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.intellectual.content') || 'CV Builder\'ın tüm içeriği, özellikleri ve işlevleri telif hakkı ve diğer fikri mülkiyet yasalarıyla korunmaktadır. Şablonlar, tasarımlar ve yazılım bizim mülkiyetimizdedir.'}
              </p>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.intellectual.userContent') || 'CV\'nize eklediğiniz içerik size aittir. Ancak, hizmetlerimizi kullanarak bize bu içeriği işlemek, saklamak ve görüntülemek için gerekli lisansları verirsiniz.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.payment.title') || '6. Ödeme ve Faturalandırma'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.payment.content') || 'Ücretli planlar için:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('terms.payment.item1') || 'Ödemeler önceden yapılır'}</li>
                <li>{t('terms.payment.item2') || 'Fiyatlar önceden bildirilmeden değiştirilebilir'}</li>
                <li>{t('terms.payment.item3') || 'İptal edilen abonelikler dönem sonuna kadar geçerlidir'}</li>
                <li>{t('terms.payment.item4') || 'İade politikası geçerli faturalandırma dönemi için geçerlidir'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.termination.title') || '7. Hesap Sonlandırma'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.termination.content') || 'Herhangi bir zamanda hesabınızı sonlandırabilirsiniz. Ayrıca, bu Kullanım Koşullarını ihlal etmeniz durumunda hesabınızı sonlandırma hakkımızı saklı tutarız. Hesap sonlandırıldığında, verileriniz yasal saklama süreleri gereği saklanabilir.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.disclaimer.title') || '8. Sorumluluk Reddi'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.disclaimer.content') || 'Hizmetlerimiz "olduğu gibi" sağlanmaktadır. Hizmetlerimizin kesintisiz, hatasız veya güvenli olacağını garanti etmiyoruz. Hizmetlerimizin kullanımından kaynaklanan herhangi bir zarardan sorumlu değiliz.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.changes.title') || '9. Değişiklikler'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.changes.content') || 'Bu Kullanım Koşullarını zaman zaman güncelleyebiliriz. Önemli değişiklikler için size bildirim göndereceğiz. Değişikliklerden sonra hizmetleri kullanmaya devam etmeniz, güncellenmiş koşulları kabul ettiğiniz anlamına gelir.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.contact.title') || '10. İletişim'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.contact.content') || 'Kullanım Koşulları ile ilgili sorularınız için lütfen bizimle iletişime geçin:'}
              </p>
              <p className="text-stone-600 mt-2">
                <a href="/contact" className="text-teal-600 hover:underline">
                  {t('terms.contact.link') || 'İletişim Sayfası'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
