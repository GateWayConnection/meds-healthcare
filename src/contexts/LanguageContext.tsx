
import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.findDoctor': 'Find Doctor',
    'nav.bookAppointment': 'Book Appointment',
    'nav.healthNav': 'Health Navigation',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'hero.title': 'Your Health, Our Priority',
    'hero.subtitle': 'Quality healthcare services in Sudan with modern technology and caring professionals',
    'hero.bookNow': 'Book Appointment',
    'hero.learnMore': 'Learn More',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.search': 'Search'
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.about': 'عن المستشفى',
    'nav.findDoctor': 'البحث عن طبيب',
    'nav.bookAppointment': 'حجز موعد',
    'nav.healthNav': 'التوجيه الصحي',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'hero.title': 'صحتك، أولويتنا',
    'hero.subtitle': 'خدمات الرعاية الصحية عالية الجودة في السودان بتقنيات حديثة ومهنيين مهتمين',
    'hero.bookNow': 'احجز موعد',
    'hero.learnMore': 'اعرف المزيد',
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.search': 'بحث'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
