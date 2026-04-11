// Seed questions for development and initial testing.
//
// 36 entries: one per (topic × difficulty) combination, so the game
// flow can never dead-end on a topic+tile combo that has no question.
// Document IDs are stable ("seed-<slug>-<difficulty>-01") so re-running
// the seed is idempotent — setDoc overwrites instead of duplicating.
//
// This is explicitly NOT the final content — the real question set
// (50 per topic, per PLAN.md) will be generated later and loaded
// through the admin batch uploader. Treat these as placeholders,
// adequate for exercising the game loop end-to-end.

export const SEED_QUESTIONS = [
  // جغرافیا — Geography
  {
    id: 'seed-geography-easy-01',
    topic: 'جغرافیا',
    difficulty: 'easy',
    hint1: 'در مرکز کشور قرار دارد.',
    hint2: 'بزرگ‌ترین و پرجمعیت‌ترین شهر ایران است.',
    answer: 'تهران',
  },
  {
    id: 'seed-geography-medium-01',
    topic: 'جغرافیا',
    difficulty: 'medium',
    hint1: 'از کوه‌های زاگرس سرچشمه می‌گیرد.',
    hint2: 'طولانی‌ترین رود ایران است و به خلیج فارس می‌ریزد.',
    answer: 'کارون',
  },
  {
    id: 'seed-geography-hard-01',
    topic: 'جغرافیا',
    difficulty: 'hard',
    hint1: 'بلندترین قله ایران در این رشته‌کوه قرار دارد.',
    hint2: 'موازی دریای خزر از غرب به شرق کشیده شده است.',
    answer: 'البرز',
  },

  // تاریخ ایران — Iranian History
  {
    id: 'seed-history-iran-easy-01',
    topic: 'تاریخ ایران',
    difficulty: 'easy',
    hint1: 'بنیان‌گذار نخستین امپراتوری ایرانی بود.',
    hint2: 'سلسله هخامنشیان را پایه گذاشت و منشور حقوق بشر منسوب به اوست.',
    answer: 'کوروش بزرگ',
  },
  {
    id: 'seed-history-iran-medium-01',
    topic: 'تاریخ ایران',
    difficulty: 'medium',
    hint1: 'در قرن هجدهم میلادی به هندوستان لشکر کشید.',
    hint2: 'بنیان‌گذار سلسله افشاریه بود و الماس کوه نور را از هند آورد.',
    answer: 'نادرشاه افشار',
  },
  {
    id: 'seed-history-iran-hard-01',
    topic: 'تاریخ ایران',
    difficulty: 'hard',
    hint1: 'در سال ۱۵۱۴ میلادی میان صفویان و یک امپراتوری مسلمان دیگر رخ داد.',
    hint2: 'شاه اسماعیل صفوی در این نبرد از سلطان سلیم عثمانی شکست خورد.',
    answer: 'جنگ چالدران',
  },

  // تاریخ جهان — World History
  {
    id: 'seed-history-world-easy-01',
    topic: 'تاریخ جهان',
    difficulty: 'easy',
    hint1: 'اولین رئیس‌جمهور ایالات متحده آمریکا بود.',
    hint2: 'پایتخت فعلی آمریکا به نام او خوانده می‌شود.',
    answer: 'جرج واشنگتن',
  },
  {
    id: 'seed-history-world-medium-01',
    topic: 'تاریخ جهان',
    difficulty: 'medium',
    hint1: 'این رویداد در اواخر قرن بیستم نشانه پایان جنگ سرد بود.',
    hint2: 'در سال ۱۹۸۹ دیوار میان دو بخش یک شهر آلمانی فرو ریخت.',
    answer: 'سقوط دیوار برلین',
  },
  {
    id: 'seed-history-world-hard-01',
    topic: 'تاریخ جهان',
    difficulty: 'hard',
    hint1: 'با سقوط این شهر در سال ۱۴۵۳ امپراتوری بیزانس پایان یافت.',
    hint2: 'توسط سلطان محمد دوم عثمانی، ملقب به فاتح، فتح شد.',
    answer: 'قسطنطنیه',
  },

  // سینمای ایران — Iranian Cinema
  {
    id: 'seed-cinema-iran-easy-01',
    topic: 'سینمای ایران',
    difficulty: 'easy',
    hint1: 'فیلم «بچه‌های آسمان» را کارگردانی کرده است.',
    hint2: 'نخستین کارگردان ایرانی نامزد اسکار بهترین فیلم خارجی‌زبان بود.',
    answer: 'مجید مجیدی',
  },
  {
    id: 'seed-cinema-iran-medium-01',
    topic: 'سینمای ایران',
    difficulty: 'medium',
    hint1: 'این فیلم در سال ۱۹۹۷ نخل طلای جشنواره کن را برد.',
    hint2: 'عباس کیارستمی کارگردان آن است و درباره مردی است که کسی را برای دفن خود می‌جوید.',
    answer: 'طعم گیلاس',
  },
  {
    id: 'seed-cinema-iran-hard-01',
    topic: 'سینمای ایران',
    difficulty: 'hard',
    hint1: 'اولین فیلم ناطق سینمای ایران است.',
    hint2: 'در سال ۱۳۱۲ شمسی به کارگردانی عبدالحسین سپنتا ساخته شد.',
    answer: 'دختر لر',
  },

  // سینمای جهان — World Cinema
  {
    id: 'seed-cinema-world-easy-01',
    topic: 'سینمای جهان',
    difficulty: 'easy',
    hint1: 'کارگردان فیلم‌های «تایتانیک» و «آواتار» است.',
    hint2: 'اهل کاناداست و نام کوچکش جیمز است.',
    answer: 'جیمز کامرون',
  },
  {
    id: 'seed-cinema-world-medium-01',
    topic: 'سینمای جهان',
    difficulty: 'medium',
    hint1: 'فیلمی از کریستوفر نولان درباره نفوذ به رویاها.',
    hint2: 'در سال ۲۰۱۰ با بازی لئوناردو دی‌کاپریو اکران شد.',
    answer: 'تلقین (Inception)',
  },
  {
    id: 'seed-cinema-world-hard-01',
    topic: 'سینمای جهان',
    difficulty: 'hard',
    hint1: 'کارگردان ژاپنی فیلم «هفت سامورایی» و «راشومون».',
    hint2: 'از تأثیرگذارترین کارگردانان تاریخ سینما و نام کوچکش آکیرا است.',
    answer: 'آکیرا کوروساوا',
  },

  // موسیقی — Music
  {
    id: 'seed-music-easy-01',
    topic: 'موسیقی',
    difficulty: 'easy',
    hint1: 'از بزرگ‌ترین خوانندگان آواز سنتی ایران.',
    hint2: 'به «خسرو آواز ایران» شهرت داشت و تصنیف «مرغ سحر» را اجرا کرده است.',
    answer: 'محمدرضا شجریان',
  },
  {
    id: 'seed-music-medium-01',
    topic: 'موسیقی',
    difficulty: 'medium',
    hint1: 'مشهورترین گروه موسیقی بریتانیا در دهه ۱۹۶۰.',
    hint2: 'اعضای اصلی آن جان، پل، جورج و رینگو بودند و اهل لیورپول بودند.',
    answer: 'بیتلز',
  },
  {
    id: 'seed-music-hard-01',
    topic: 'موسیقی',
    difficulty: 'hard',
    hint1: 'آهنگساز آلمانی سمفونی نهم معروف به «سرود شادی».',
    hint2: 'در اواخر عمر ناشنوا شد اما همچنان آهنگ می‌ساخت.',
    answer: 'لودویگ فان بتهوون',
  },

  // ورزش — Sports
  {
    id: 'seed-sports-easy-01',
    topic: 'ورزش',
    difficulty: 'easy',
    hint1: 'یکی از بزرگ‌ترین فوتبالیست‌های تاریخ، اهل آمریکای جنوبی.',
    hint2: 'چندین بار توپ طلا برده و در جام جهانی ۲۰۲۲ با آرژانتین قهرمان شد.',
    answer: 'لیونل مسی',
  },
  {
    id: 'seed-sports-medium-01',
    topic: 'ورزش',
    difficulty: 'medium',
    hint1: 'ورزشی که مایکل جردن در آن افسانه است.',
    hint2: 'در المپیک ۱۹۹۲ تیم رؤیایی آمریکا در این رشته قهرمان جهان شد.',
    answer: 'بسکتبال',
  },
  {
    id: 'seed-sports-hard-01',
    topic: 'ورزش',
    difficulty: 'hard',
    hint1: 'دونده‌ای جامائیکایی که رکورد دوی ۱۰۰ متر مردان به نام اوست.',
    hint2: 'رکورد ۹٫۵۸ ثانیه را در مسابقات جهانی ۲۰۰۹ برلین به ثبت رساند.',
    answer: 'یوسین بولت',
  },

  // علم و فناوری — Science & Technology
  {
    id: 'seed-science-easy-01',
    topic: 'علم و فناوری',
    difficulty: 'easy',
    hint1: 'مولکول آب از دو عنصر ساخته شده است.',
    hint2: 'دو اتم هیدروژن و یک اتم اکسیژن.',
    answer: 'H2O',
  },
  {
    id: 'seed-science-medium-01',
    topic: 'علم و فناوری',
    difficulty: 'medium',
    hint1: 'نزدیک‌ترین ستاره به منظومه شمسی پس از خورشید.',
    hint2: 'در صورت فلکی قنطورس قرار دارد و حدود ۴٫۲ سال نوری از ما فاصله دارد.',
    answer: 'پروکسیما قنطورس',
  },
  {
    id: 'seed-science-hard-01',
    topic: 'علم و فناوری',
    difficulty: 'hard',
    hint1: 'فیزیکدانی که نظریه نسبیت عام را در سال ۱۹۱۵ ارائه کرد.',
    hint2: 'فرمول معروف E=mc² از اوست و جایزه نوبل فیزیک را برای اثر فوتوالکتریک برد.',
    answer: 'آلبرت اینشتین',
  },

  // ادبیات — Literature
  {
    id: 'seed-literature-easy-01',
    topic: 'ادبیات',
    difficulty: 'easy',
    hint1: 'شاعر حماسه‌سرای بزرگ ایران، اهل توس.',
    hint2: 'شاهنامه را در سی سال به نظم درآورد.',
    answer: 'فردوسی',
  },
  {
    id: 'seed-literature-medium-01',
    topic: 'ادبیات',
    difficulty: 'medium',
    hint1: 'نویسنده رمان «بوف کور».',
    hint2: 'از پیشگامان داستان‌نویسی مدرن ایران و نویسنده «سه قطره خون».',
    answer: 'صادق هدایت',
  },
  {
    id: 'seed-literature-hard-01',
    topic: 'ادبیات',
    difficulty: 'hard',
    hint1: 'نویسنده روس رمان «جنگ و صلح».',
    hint2: 'خالق «آنا کارنینا» و از بزرگ‌ترین رمان‌نویسان قرن نوزدهم.',
    answer: 'لئو تولستوی',
  },

  // هنر و معماری — Art & Architecture
  {
    id: 'seed-art-easy-01',
    topic: 'هنر و معماری',
    difficulty: 'easy',
    hint1: 'تخت جمشید در نزدیکی این شهر ایران قرار دارد.',
    hint2: 'مرکز استان فارس، شهر حافظ و سعدی.',
    answer: 'شیراز',
  },
  {
    id: 'seed-art-medium-01',
    topic: 'هنر و معماری',
    difficulty: 'medium',
    hint1: 'دومین میدان بزرگ جهان و از میراث یونسکو.',
    hint2: 'در اصفهان قرار دارد و مسجد شیخ لطف‌الله و کاخ عالی‌قاپو پیرامون آن است.',
    answer: 'میدان نقش جهان',
  },
  {
    id: 'seed-art-hard-01',
    topic: 'هنر و معماری',
    difficulty: 'hard',
    hint1: 'نقاش هلندی معروف که یک گوش خود را برید.',
    hint2: 'تابلوهای «شب پرستاره» و «گل‌های آفتابگردان» از اوست.',
    answer: 'ونسان ون گوگ',
  },

  // طبیعت و حیوانات — Nature & Animals
  {
    id: 'seed-nature-easy-01',
    topic: 'طبیعت و حیوانات',
    difficulty: 'easy',
    hint1: 'بزرگ‌ترین حیوان خشکی روی زمین.',
    hint2: 'خرطومی بلند دارد و گونه آفریقایی آن بزرگ‌تر از آسیایی است.',
    answer: 'فیل',
  },
  {
    id: 'seed-nature-medium-01',
    topic: 'طبیعت و حیوانات',
    difficulty: 'medium',
    hint1: 'گونه‌ای در خطر انقراض که تنها در ایران باقی مانده است.',
    hint2: 'بیشتر در کویرهای مرکزی ایران (سمنان و یزد) زندگی می‌کند.',
    answer: 'یوزپلنگ ایرانی',
  },
  {
    id: 'seed-nature-hard-01',
    topic: 'طبیعت و حیوانات',
    difficulty: 'hard',
    hint1: 'بلندترین درختان جهان از این گونه هستند.',
    hint2: 'در غرب آمریکای شمالی می‌رویند و ارتفاع برخی به بیش از ۱۰۰ متر می‌رسد.',
    answer: 'سکویا',
  },

  // شخصیت‌های مشهور — Famous People
  {
    id: 'seed-people-easy-01',
    topic: 'شخصیت‌های مشهور',
    difficulty: 'easy',
    hint1: 'پزشک و فیلسوف ایرانی قرن چهارم هجری.',
    hint2: 'کتاب «قانون در پزشکی» از آثار اوست و در غرب به Avicenna معروف است.',
    answer: 'ابن سینا',
  },
  {
    id: 'seed-people-medium-01',
    topic: 'شخصیت‌های مشهور',
    difficulty: 'medium',
    hint1: 'نوجوان فعال حقوق دختران اهل پاکستان.',
    hint2: 'در سال ۲۰۱۴ جوان‌ترین برنده جایزه صلح نوبل شد.',
    answer: 'مالالا یوسف‌زی',
  },
  {
    id: 'seed-people-hard-01',
    topic: 'شخصیت‌های مشهور',
    difficulty: 'hard',
    hint1: 'شاعر و عارف بزرگ پارسی‌گو، اهل بلخ.',
    hint2: 'بیشتر عمرش را در قونیه گذراند و مثنوی معنوی را سرود.',
    answer: 'جلال‌الدین محمد بلخی (مولوی)',
  },
]
