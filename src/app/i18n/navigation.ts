import { LanguageCode } from './languages';

export interface NavigationLabels {
  language: string;
  timeline: string;
  themes: string;
  empires: string;
  kingdoms: string;
  personalities: string;
  worldHistory: string;
  blogs: string;
  books: string;
  search: string;
}

export const NAVIGATION: Record<LanguageCode, NavigationLabels> = {
  sa: { language: 'भाषा', timeline: 'कालक्रमः', themes: 'विषयाः', empires: 'साम्राज्यानि', kingdoms: 'राज्यानि', personalities: 'व्यक्तित्वानि', worldHistory: 'विश्वेतिहासः', blogs: 'जाललेखाः', books: 'पुस्तकानि', search: 'अन्वेषणम्' },
  en: { language: 'Language', timeline: 'Timeline', themes: 'Themes', empires: 'Empires', kingdoms: 'Kingdoms', personalities: 'Personalities', worldHistory: 'World History', blogs: 'Blogs', books: 'Books', search: 'Search' },
  hi: { language: 'भाषा', timeline: 'कालक्रम', themes: 'विषय', empires: 'साम्राज्य', kingdoms: 'राज्य', personalities: 'व्यक्तित्व', worldHistory: 'विश्व इतिहास', blogs: 'ब्लॉग', books: 'पुस्तकें', search: 'खोजें' },
  bn: { language: 'ভাষা', timeline: 'সময়রেখা', themes: 'বিষয়', empires: 'সাম্রাজ্য', kingdoms: 'রাজ্য', personalities: 'ব্যক্তিত্ব', worldHistory: 'বিশ্ব ইতিহাস', blogs: 'ব্লগ', books: 'বই', search: 'অনুসন্ধান' },
  ta: { language: 'மொழி', timeline: 'காலவரிசை', themes: 'கருப்பொருள்கள்', empires: 'பேரரசுகள்', kingdoms: 'அரசுகள்', personalities: 'ஆளுமைகள்', worldHistory: 'உலக வரலாறு', blogs: 'வலைப்பதிவுகள்', books: 'நூல்கள்', search: 'தேடு' },
  te: { language: 'భాష', timeline: 'కాలక్రమం', themes: 'అంశాలు', empires: 'సామ్రాజ్యాలు', kingdoms: 'రాజ్యాలు', personalities: 'వ్యక్తులు', worldHistory: 'ప్రపంచ చరిత్ర', blogs: 'బ్లాగులు', books: 'పుస్తకాలు', search: 'శోధన' },
  mr: { language: 'भाषा', timeline: 'कालरेषा', themes: 'विषय', empires: 'साम्राज्ये', kingdoms: 'राज्ये', personalities: 'व्यक्तिमत्त्वे', worldHistory: 'जागतिक इतिहास', blogs: 'ब्लॉग', books: 'पुस्तके', search: 'शोधा' },
  ur: { language: 'زبان', timeline: 'خط زمانی', themes: 'موضوعات', empires: 'سلطنتیں', kingdoms: 'ریاستیں', personalities: 'شخصیات', worldHistory: 'عالمی تاریخ', blogs: 'بلاگز', books: 'کتابیں', search: 'تلاش' },
  gu: { language: 'ભાષા', timeline: 'સમયરેખા', themes: 'વિષયો', empires: 'સામ્રાજ્યો', kingdoms: 'રાજ્યો', personalities: 'વ્યક્તિત્વો', worldHistory: 'વિશ્વ ઇતિહાસ', blogs: 'બ્લૉગ', books: 'પુસ્તકો', search: 'શોધો' },
  kn: { language: 'ಭಾಷೆ', timeline: 'ಕಾಲರೇಖೆ', themes: 'ವಿಷಯಗಳು', empires: 'ಸಾಮ್ರಾಜ್ಯಗಳು', kingdoms: 'ರಾಜ್ಯಗಳು', personalities: 'ವ್ಯಕ್ತಿಗಳು', worldHistory: 'ವಿಶ್ವ ಇತಿಹಾಸ', blogs: 'ಬ್ಲಾಗ್‌ಗಳು', books: 'ಪುಸ್ತಕಗಳು', search: 'ಹುಡುಕಿ' },
  ml: { language: 'ഭാഷ', timeline: 'കാലരേഖ', themes: 'വിഷയങ്ങൾ', empires: 'സാമ്രാജ്യങ്ങൾ', kingdoms: 'രാജ്യങ്ങൾ', personalities: 'വ്യക്തികൾ', worldHistory: 'ലോകചരിത്രം', blogs: 'ബ്ലോഗുകൾ', books: 'പുസ്തകങ്ങൾ', search: 'തിരയുക' },
  pa: { language: 'ਭਾਸ਼ਾ', timeline: 'ਸਮਾਂਰੇਖਾ', themes: 'ਵਿਸ਼ੇ', empires: 'ਸਾਮਰਾਜ', kingdoms: 'ਰਾਜ', personalities: 'ਸ਼ਖ਼ਸੀਅਤਾਂ', worldHistory: 'ਵਿਸ਼ਵ ਇਤਿਹਾਸ', blogs: 'ਬਲੌਗ', books: 'ਕਿਤਾਬਾਂ', search: 'ਖੋਜੋ' },
  es: { language: 'Idioma', timeline: 'Cronología', themes: 'Temas', empires: 'Imperios', kingdoms: 'Reinos', personalities: 'Personajes', worldHistory: 'Historia mundial', blogs: 'Blogs', books: 'Libros', search: 'Buscar' },
  fr: { language: 'Langue', timeline: 'Chronologie', themes: 'Thèmes', empires: 'Empires', kingdoms: 'Royaumes', personalities: 'Personnalités', worldHistory: 'Histoire mondiale', blogs: 'Blogues', books: 'Livres', search: 'Rechercher' },
  ar: { language: 'اللغة', timeline: 'الخط الزمني', themes: 'الموضوعات', empires: 'الإمبراطوريات', kingdoms: 'الممالك', personalities: 'الشخصيات', worldHistory: 'تاريخ العالم', blogs: 'المدونات', books: 'الكتب', search: 'بحث' },
  zh: { language: '语言', timeline: '时间线', themes: '主题', empires: '帝国', kingdoms: '王国', personalities: '历史人物', worldHistory: '世界历史', blogs: '博客', books: '书籍', search: '搜索' },
  pt: { language: 'Idioma', timeline: 'Cronologia', themes: 'Temas', empires: 'Impérios', kingdoms: 'Reinos', personalities: 'Personalidades', worldHistory: 'História mundial', blogs: 'Blogs', books: 'Livros', search: 'Buscar' },
  or: { language: 'ଭାଷା', timeline: 'ସମୟରେଖା', themes: 'ବିଷୟ', empires: 'ସାମ୍ରାଜ୍ୟ', kingdoms: 'ରାଜ୍ୟ', personalities: 'ବ୍ୟକ୍ତିତ୍ୱ', worldHistory: 'ବିଶ୍ୱ ଇତିହାସ', blogs: 'ବ୍ଲଗ୍', books: 'ପୁସ୍ତକ', search: 'ଖୋଜ' },
  si: { language: 'භාෂාව', timeline: 'කාලරේඛාව', themes: 'තේමා', empires: 'අධිරාජ්‍යයන්', kingdoms: 'රාජ්‍යයන්', personalities: 'පෞද්ගලිකත්වයන්', worldHistory: 'ලෝක ඉතිහාසය', blogs: 'බ්ලොග්', books: 'පොත්', search: 'සොයන්න' },
  ja: { language: '言語', timeline: '年表', themes: 'テーマ', empires: '帝国', kingdoms: '王国', personalities: '人物', worldHistory: '世界史', blogs: 'ブログ', books: '書籍', search: '検索' },
  ne: { language: 'भाषा', timeline: 'समयरेखा', themes: 'विषय', empires: 'साम्राज्य', kingdoms: 'राज्य', personalities: 'व्यक्तित्व', worldHistory: 'विश्व इतिहास', blogs: 'ब्लग', books: 'पुस्तक', search: 'खोज्नुहोस्' },
  id: { language: 'Bahasa', timeline: 'Garis Waktu', themes: 'Tema', empires: 'Kekaisaran', kingdoms: 'Kerajaan', personalities: 'Tokoh', worldHistory: 'Sejarah Dunia', blogs: 'Blog', books: 'Buku', search: 'Cari' },
  th: { language: 'ภาษา', timeline: 'เส้นเวลา', themes: 'ธีม', empires: 'จักรวรรดิ', kingdoms: 'อาณาจักร', personalities: 'บุคคลสำคัญ', worldHistory: 'ประวัติศาสตร์โลก', blogs: 'บล็อก', books: 'หนังสือ', search: 'ค้นหา' },
  de: { language: 'Sprache', timeline: 'Zeitleiste', themes: 'Themen', empires: 'Reiche', kingdoms: 'Königreiche', personalities: 'Persönlichkeiten', worldHistory: 'Weltgeschichte', blogs: 'Blogs', books: 'Bücher', search: 'Suche' },
  fa: { language: 'زبان', timeline: 'خط زمانی', themes: 'موضوعات', empires: 'امپراتوری‌ها', kingdoms: 'پادشاهی‌ها', personalities: 'شخصیت‌ها', worldHistory: 'تاریخ جهان', blogs: 'وبلاگ‌ها', books: 'کتاب‌ها', search: 'جستجو' },
  ru: { language: 'Язык', timeline: 'Хронология', themes: 'Темы', empires: 'Империи', kingdoms: 'Королевства', personalities: 'Личности', worldHistory: 'Всемирная история', blogs: 'Блоги', books: 'Книги', search: 'Поиск' },
  ks: { language: 'زَبان', timeline: 'دورَن ہٕنٛز ترتیب', themes: 'موٗضوٗع', empires: 'سلطنت', kingdoms: 'رِیاست', personalities: 'شَخصِیات', worldHistory: 'عالمی توٲریخ', blogs: 'بلاگز', books: 'کِتابہِ', search: 'تلاش' },
};
