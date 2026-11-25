# M3 AI

تطبيق دردشة عربي باسم M3 AI، يعمل عبر Node.js وGoogle Gemini API.

## المتطلبات
- Node.js 22 أو أحدث
- مفتاح Gemini API من Google AI Studio

## التشغيل محلياً
1. فك ضغط المشروع.
2. افتح مجلد المشروع في الطرفية.
3. نفّذ `npm install`.
4. انسخ `.env.example` إلى `.env` وأضف مفتاح Gemini API.
5. شغّل `npm start`.
6. افتح `http://localhost:3000`.

## النشر على GitHub وRender
1. أنشئ مستودعاً جديداً على GitHub وارفع كل ملفات هذا المشروع.
2. في Render اختر **New +** ثم **Blueprint**، واربط مستودع GitHub.
3. سيتعرف Render على `render.yaml`.
4. في إعدادات الخدمة، افتح **Environment** وأضف `GEMINI_API_KEY` مع قيمة مفتاحك.
5. أعد النشر إن لزم، ثم افتح رابط الخدمة.

## الحصول على مفتاح Gemini
أنشئ مفتاح API من Google AI Studio:
https://aistudio.google.com/app/apikey

لا تضع المفتاح في `public/index.html` ولا ترفعه إلى GitHub. أضفه فقط كمتغير بيئة سري في Render أو في ملف `.env` محلياً. لا تشارك المفتاح مع أحد.

## إعداد النموذج
القيمة الافتراضية هي `gemini-3.8-flash`. يمكن تغيير `GEMINI_MODEL` من إعدادات Environment في Render إلى نموذج متاح لحسابك.

## تنبيه حول الاستخدام
توفر Gemini API وحدودها وتكاليفها تعتمد على حساب Google وإعدادات الفوترة والحصة المتاحة. إنشاء مفتاح API لا يعني تلقائياً اشتراكاً مدفوعاً أو استخداماً غير محدود.
