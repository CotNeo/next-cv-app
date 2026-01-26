'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t('privacy.title') || 'Gizlilik Politikası'}
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed">
            {t('privacy.subtitle') || 'Son güncelleme: 26 Ocak 2026'}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-stone-200 p-8 sm:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.intro.title') || '1. Giriş'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.intro.content') || 'CV Builder olarak, kullanıcılarımızın gizliliğini korumayı taahhüt ediyoruz. Bu Gizlilik Politikası, kişisel bilgilerinizi nasıl topladığımız, kullandığımız, sakladığımız ve koruduğumuz hakkında bilgi sağlar.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.data.title') || '2. Toplanan Bilgiler'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.data.content') || 'Topladığımız bilgiler şunları içerir:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('privacy.data.item1') || 'Hesap oluştururken sağladığınız kişisel bilgiler (ad, e-posta adresi)'}</li>
                <li>{t('privacy.data.item2') || 'CV\'nize eklediğiniz bilgiler (iş deneyimi, eğitim, beceriler vb.)'}</li>
                <li>{t('privacy.data.item3') || 'Kullanım verileri (sayfa görüntülemeleri, özellik kullanımı)'}</li>
                <li>{t('privacy.data.item4') || 'Teknik bilgiler (IP adresi, tarayıcı türü, cihaz bilgileri)'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.use.title') || '3. Bilgilerin Kullanımı'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.use.content') || 'Topladığımız bilgileri şu amaçlarla kullanıyoruz:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('privacy.use.item1') || 'Hizmetlerimizi sağlamak ve iyileştirmek'}</li>
                <li>{t('privacy.use.item2') || 'CV\'lerinizi oluşturmanıza, düzenlemenize ve saklamanıza olanak tanımak'}</li>
                <li>{t('privacy.use.item3') || 'AI destekli öneriler ve özellikler sunmak'}</li>
                <li>{t('privacy.use.item4') || 'Müşteri desteği sağlamak'}</li>
                <li>{t('privacy.use.item5') || 'Yasal yükümlülüklerimizi yerine getirmek'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.sharing.title') || '4. Bilgi Paylaşımı'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.sharing.content') || 'Kişisel bilgilerinizi üçüncü taraflarla paylaşmıyoruz, ancak aşağıdaki durumlar hariç:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('privacy.sharing.item1') || 'Hizmet sağlayıcılarımız (bulut depolama, analitik) - sadece hizmet sağlamak için gerekli olduğunda'}</li>
                <li>{t('privacy.sharing.item2') || 'Yasal gereklilikler - yasal bir zorunluluk olduğunda'}</li>
                <li>{t('privacy.sharing.item3') || 'İzin verdiğiniz durumlar - açıkça izin verdiğinizde'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.security.title') || '5. Veri Güvenliği'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('privacy.security.content') || 'Bilgilerinizin güvenliğini sağlamak için endüstri standardı şifreleme ve güvenlik önlemleri kullanıyoruz. Verileriniz güvenli sunucularda saklanır ve yetkisiz erişime karşı korunur.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.rights.title') || '6. Haklarınız'}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.rights.content') || 'Aşağıdaki haklara sahipsiniz:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('privacy.rights.item1') || 'Kişisel bilgilerinize erişim'}</li>
                <li>{t('privacy.rights.item2') || 'Bilgilerinizi düzeltme veya güncelleme'}</li>
                <li>{t('privacy.rights.item3') || 'Hesabınızı ve verilerinizi silme'}</li>
                <li>{t('privacy.rights.item4') || 'Veri işlemeye itiraz etme'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.cookies.title') || '7. Çerezler'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('privacy.cookies.content') || 'Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.changes.title') || '8. Değişiklikler'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('privacy.changes.content') || 'Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler için size bildirim göndereceğiz.'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.contact.title') || '9. İletişim'}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('privacy.contact.content') || 'Gizlilik ile ilgili sorularınız için lütfen bizimle iletişime geçin:'}
              </p>
              <p className="text-stone-600 mt-2">
                <a href="/contact" className="text-teal-600 hover:underline">
                  {t('privacy.contact.link') || 'İletişim Sayfası'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
