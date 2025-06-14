
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
    'common.search': 'Search',
    
    // Find Doctor Page
    'findDoctor.title': 'Find a Doctor',
    'findDoctor.subtitle': 'Search for healthcare professionals',
    'findDoctor.searchPlaceholder': 'Search by name or specialty...',
    'findDoctor.allSpecialties': 'All Specialties',
    'findDoctor.bookAppointment': 'Book Appointment',
    'findDoctor.yearsExp': 'years exp.',
    'findDoctor.noResults': 'No doctors found matching your criteria.',
    
    // About Page
    'about.title': 'About MEDS Healthcare',
    'about.subtitle': 'Quality healthcare services in Sudan',
    'about.mission': 'Our Mission',
    'about.missionText': 'To provide accessible, quality healthcare services to the people of Sudan through modern technology and compassionate care.',
    'about.vision': 'Our Vision',
    'about.visionText': 'To be the leading healthcare provider in Sudan, combining traditional care with innovative medical solutions.',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our healthcare team',
    'contact.sendMessage': 'Send us a Message',
    'contact.fullName': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.sendBtn': 'Send Message',
    'contact.phoneTitle': 'Phone',
    'contact.emergencyLine': '24/7 Emergency Line',
    'contact.emailTitle': 'Email',
    'contact.location': 'Location',
    'contact.locationText': 'Khartoum, Sudan',
    'contact.hours': 'Hours',
    'contact.weekdayHours': 'Mon-Fri: 8:00 AM - 8:00 PM',
    'contact.weekendHours': 'Sat-Sun: 9:00 AM - 6:00 PM',
    'contact.emergencyNote': 'Emergency services 24/7',
    'contact.successMessage': 'Message sent successfully! We will get back to you soon.',
    
    // Login Page
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to access your healthcare dashboard',
    'login.loginAs': 'Login as',
    'login.selectRole': 'Select your role',
    'login.patient': 'Patient',
    'login.doctor': 'Doctor',
    'login.admin': 'Admin',
    'login.emailAddress': 'Email Address',
    'login.emailPlaceholder': 'Enter your email',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.signIn': 'Sign In',
    'login.noAccount': "Don't have an account?",
    'login.signUpHere': 'Sign up here',
    'login.demoCredentials': 'Demo Credentials:',
    'login.fillAllFields': 'Please fill in all fields',
    'login.loginSuccessful': 'Login successful!',
    'login.invalidCredentials': 'Invalid credentials or role',
    'login.loginError': 'An error occurred during login',
    
    // Register Page
    'register.title': 'Join MEDS Healthcare',
    'register.subtitle': 'Create your account to access quality healthcare services',
    'register.registerAs': 'I am registering as',
    'register.selectRole': 'Select your role',
    'register.fullName': 'Full Name',
    'register.fullNamePlaceholder': 'Enter your full name',
    'register.phoneNumber': 'Phone Number',
    'register.phonePlaceholder': '+249 123 456 789',
    'register.emailAddress': 'Email Address',
    'register.emailPlaceholder': 'Enter your email',
    'register.dateOfBirth': 'Date of Birth',
    'register.professionalInfo': 'Professional Information',
    'register.medicalSpecialty': 'Medical Specialty',
    'register.selectSpecialty': 'Select specialty',
    'register.yearsOfExperience': 'Years of Experience',
    'register.experiencePlaceholder': 'e.g., 5',
    'register.licenseNumber': 'Medical License Number',
    'register.licensePlaceholder': 'Enter your license number',
    'register.professionalBio': 'Professional Bio',
    'register.bioPlaceholder': 'Brief description of your experience and specializations...',
    'register.password': 'Password',
    'register.passwordPlaceholder': 'Create a password',
    'register.confirmPassword': 'Confirm Password',
    'register.confirmPasswordPlaceholder': 'Confirm your password',
    'register.createAccount': 'Create Account',
    'register.alreadyHaveAccount': 'Already have an account?',
    'register.signInHere': 'Sign in here',
    'register.doctorNote': 'Doctor accounts require verification before activation. You\'ll be contacted within 24-48 hours for document verification.',
    'register.passwordsNoMatch': 'Passwords do not match',
    'register.passwordTooShort': 'Password must be at least 6 characters',
    'register.registrationSuccessful': 'Registration successful! Please login to continue.',
    'register.emailExists': 'Email already exists',
    'register.registrationError': 'An error occurred during registration',
    
    // Home Page
    'home.whyChoose': 'Why Choose',
    'home.medsHealthcare': 'MEDS Healthcare',
    'home.whyChooseSubtitle': 'We provide comprehensive healthcare services with cutting-edge technology and compassionate care',
    'home.feature1Title': 'Easy Appointment Booking',
    'home.feature1Desc': 'Book appointments with your preferred doctors quickly and easily',
    'home.feature2Title': 'Expert Medical Team',
    'home.feature2Desc': 'Qualified doctors and healthcare professionals at your service',
    'home.feature3Title': '24/7 Emergency Care',
    'home.feature3Desc': 'Round-the-clock emergency medical services when you need them most',
    'home.feature4Title': 'Safe & Secure',
    'home.feature4Desc': 'Your health data is protected with the highest security standards',
    'home.stat1': '50+',
    'home.stat1Label': 'Expert Doctors',
    'home.stat2': '1000+',
    'home.stat2Label': 'Happy Patients',
    'home.stat3': '15+',
    'home.stat3Label': 'Medical Departments',
    'home.stat4': '24/7',
    'home.stat4Label': 'Emergency Support',
    'home.ctaTitle': 'Ready to Take Care of Your Health?',
    'home.ctaSubtitle': 'Join thousands of patients who trust MEDS Healthcare for their medical needs',
    'home.getStarted': 'Get Started Today',
    'home.contactUs': 'Contact Us',
    'home.healthGuidance': 'Health Guidance'
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
    'common.search': 'بحث',
    
    // Find Doctor Page
    'findDoctor.title': 'البحث عن طبيب',
    'findDoctor.subtitle': 'ابحث عن المهنيين الصحيين',
    'findDoctor.searchPlaceholder': 'ابحث بالاسم أو التخصص...',
    'findDoctor.allSpecialties': 'جميع التخصصات',
    'findDoctor.bookAppointment': 'حجز موعد',
    'findDoctor.yearsExp': 'سنوات خبرة',
    'findDoctor.noResults': 'لم يتم العثور على أطباء يطابقون معاييرك.',
    
    // About Page
    'about.title': 'عن مستشفى MEDS للرعاية الصحية',
    'about.subtitle': 'خدمات الرعاية الصحية عالية الجودة في السودان',
    'about.mission': 'مهمتنا',
    'about.missionText': 'تقديم خدمات الرعاية الصحية عالية الجودة وسهلة المنال لشعب السودان من خلال التكنولوجيا الحديثة والرعاية الرحيمة.',
    'about.vision': 'رؤيتنا',
    'about.visionText': 'أن نكون مقدم الرعاية الصحية الرائد في السودان، من خلال الجمع بين الرعاية التقليدية والحلول الطبية المبتكرة.',
    
    // Contact Page
    'contact.title': 'اتصل بنا',
    'contact.subtitle': 'تواصل مع فريق الرعاية الصحية لدينا',
    'contact.sendMessage': 'أرسل لنا رسالة',
    'contact.fullName': 'الاسم الكامل',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'الهاتف',
    'contact.message': 'الرسالة',
    'contact.sendBtn': 'إرسال الرسالة',
    'contact.phoneTitle': 'الهاتف',
    'contact.emergencyLine': 'خط الطوارئ 24/7',
    'contact.emailTitle': 'البريد الإلكتروني',
    'contact.location': 'الموقع',
    'contact.locationText': 'الخرطوم، السودان',
    'contact.hours': 'ساعات العمل',
    'contact.weekdayHours': 'الإثنين - الجمعة: 8:00 ص - 8:00 م',
    'contact.weekendHours': 'السبت - الأحد: 9:00 ص - 6:00 م',
    'contact.emergencyNote': 'خدمات الطوارئ 24/7',
    'contact.successMessage': 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
    
    // Login Page
    'login.title': 'مرحباً بعودتك',
    'login.subtitle': 'سجل دخولك للوصول إلى لوحة الرعاية الصحية',
    'login.loginAs': 'تسجيل الدخول كـ',
    'login.selectRole': 'اختر دورك',
    'login.patient': 'مريض',
    'login.doctor': 'طبيب',
    'login.admin': 'مدير',
    'login.emailAddress': 'عنوان البريد الإلكتروني',
    'login.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.passwordPlaceholder': 'أدخل كلمة المرور',
    'login.signIn': 'تسجيل الدخول',
    'login.noAccount': 'ليس لديك حساب؟',
    'login.signUpHere': 'سجل هنا',
    'login.demoCredentials': 'بيانات تجريبية:',
    'login.fillAllFields': 'يرجى ملء جميع الحقول',
    'login.loginSuccessful': 'تم تسجيل الدخول بنجاح!',
    'login.invalidCredentials': 'بيانات اعتماد أو دور غير صحيح',
    'login.loginError': 'حدث خطأ أثناء تسجيل الدخول',
    
    // Register Page
    'register.title': 'انضم إلى MEDS للرعاية الصحية',
    'register.subtitle': 'أنشئ حسابك للوصول إلى خدمات الرعاية الصحية عالية الجودة',
    'register.registerAs': 'أسجل كـ',
    'register.selectRole': 'اختر دورك',
    'register.fullName': 'الاسم الكامل',
    'register.fullNamePlaceholder': 'أدخل اسمك الكامل',
    'register.phoneNumber': 'رقم الهاتف',
    'register.phonePlaceholder': '+249 123 456 789',
    'register.emailAddress': 'عنوان البريد الإلكتروني',
    'register.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'register.dateOfBirth': 'تاريخ الميلاد',
    'register.professionalInfo': 'المعلومات المهنية',
    'register.medicalSpecialty': 'التخصص الطبي',
    'register.selectSpecialty': 'اختر التخصص',
    'register.yearsOfExperience': 'سنوات الخبرة',
    'register.experiencePlaceholder': 'مثل، 5',
    'register.licenseNumber': 'رقم الترخيص الطبي',
    'register.licensePlaceholder': 'أدخل رقم ترخيصك',
    'register.professionalBio': 'السيرة المهنية',
    'register.bioPlaceholder': 'وصف موجز لخبرتك وتخصصاتك...',
    'register.password': 'كلمة المرور',
    'register.passwordPlaceholder': 'إنشاء كلمة مرور',
    'register.confirmPassword': 'تأكيد كلمة المرور',
    'register.confirmPasswordPlaceholder': 'أكد كلمة المرور',
    'register.createAccount': 'إنشاء حساب',
    'register.alreadyHaveAccount': 'لديك حساب بالفعل؟',
    'register.signInHere': 'سجل دخولك هنا',
    'register.doctorNote': 'حسابات الأطباء تتطلب التحقق قبل التفعيل. سيتم التواصل معك خلال 24-48 ساعة للتحقق من الوثائق.',
    'register.passwordsNoMatch': 'كلمات المرور غير متطابقة',
    'register.passwordTooShort': 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    'register.registrationSuccessful': 'تم التسجيل بنجاح! يرجى تسجيل الدخول للمتابعة.',
    'register.emailExists': 'البريد الإلكتروني موجود بالفعل',
    'register.registrationError': 'حدث خطأ أثناء التسجيل',
    
    // Home Page
    'home.whyChoose': 'لماذا تختار',
    'home.medsHealthcare': 'MEDS للرعاية الصحية',
    'home.whyChooseSubtitle': 'نحن نقدم خدمات الرعاية الصحية الشاملة بأحدث التقنيات والرعاية الرحيمة',
    'home.feature1Title': 'حجز مواعيد سهل',
    'home.feature1Desc': 'احجز مواعيد مع أطبائك المفضلين بسرعة وسهولة',
    'home.feature2Title': 'فريق طبي خبير',
    'home.feature2Desc': 'أطباء مؤهلون ومتخصصون في الرعاية الصحية في خدمتكم',
    'home.feature3Title': 'رعاية طوارئ 24/7',
    'home.feature3Desc': 'خدمات طبية طارئة على مدار الساعة عندما تحتاجونها أكثر',
    'home.feature4Title': 'آمن ومحمي',
    'home.feature4Desc': 'بياناتك الصحية محمية بأعلى معايير الأمان',
    'home.stat1': '50+',
    'home.stat1Label': 'طبيب خبير',
    'home.stat2': '1000+',
    'home.stat2Label': 'مريض سعيد',
    'home.stat3': '15+',
    'home.stat3Label': 'قسم طبي',
    'home.stat4': '24/7',
    'home.stat4Label': 'دعم طوارئ',
    'home.ctaTitle': 'مستعد للاعتناء بصحتك؟',
    'home.ctaSubtitle': 'انضم إلى آلاف المرضى الذين يثقون في MEDS للرعاية الصحية لاحتياجاتهم الطبية',
    'home.getStarted': 'ابدأ اليوم',
    'home.contactUs': 'اتصل بنا',
    'home.healthGuidance': 'التوجيه الصحي'
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
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
