# 🚀 خطوات النشر النهائية - Intravvel

## ✅ الخطوة 1: تشغيل SQL في Supabase (يدوياً)

### افتح SQL Editor:
1. اذهب إلى: https://supabase.com/dashboard/project/lwbtihgsuumfzrgxatge/sql/new
2. ستجد مربع كبير لكتابة الكود

### انسخ والصق الكود:
1. افتح ملف: `d:\backend - Copy\supabase-schema.sql`
2. اضغط `Ctrl+A` لتحديد كل الكود
3. اضغط `Ctrl+C` للنسخ
4. ارجع لصفحة SQL Editor في Supabase
5. اضغط `Ctrl+V` للصق
6. اضغط زر **"RUN"** (أخضر في الزاوية اليمنى)
7. انتظر رسالة "Success" ✓

---

## ✅ الخطوة 2: رفع الكود على GitHub

افتح **Command Prompt** أو **PowerShell** واكتب:

```bash
cd "d:\backend - Copy"
git add .
git commit -m "Complete Supabase migration with full integration"
git push
```

---

## ✅ الخطوة 3: إضافة Environment Variables في Vercel

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروعك (Intravvel)
3. اضغط **Settings** → **Environment Variables**
4. أضف المتغيرات التالية (لكل واحد: اضغط "Add New"):

### المتغيرات المطلوبة:

```
SUPABASE_URL
https://lwbtihgsuumfzrgxatge.supabase.co

SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3YnRpaGdzdXVtZnpyZ3hhdGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODY0MzQsImV4cCI6MjA4MDQ2MjQzNH0.IQiMgRBEu0zFHR9S_aZfUTADnSbsxa2ror3zAS5D6Ys

SUPABASE_SERVICE_ROLE_KEY
sb_secret_PYeLdY0bHGt2-n9Fug0CrQ_rqs8PDtB

VITE_SUPABASE_URL
https://lwbtihgsuumfzrgxatge.supabase.co

VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3YnRpaGdzdXVtZnpyZ3hhdGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODY0MzQsImV4cCI6MjA4MDQ2MjQzNH0.IQiMgRBEu0zFHR9S_aZfUTADnSbsxa2ror3zAS5D6Ys

ADMIN_EMAIL
admin@intravvel.com

ALLOWED_ORIGINS
https://your-domain.vercel.app,http://localhost:5173
```

**ملاحظة:** استبدل `your-domain.vercel.app` برابط موقعك الفعلي على Vercel

---

## ✅ الخطوة 4: انتظار النشر التلقائي

- Vercel سيبدأ النشر تلقائياً بعد `git push`
- اذهب إلى: https://vercel.com/dashboard
- انتظر حتى يظهر "Ready" ✓ (حوالي 2-3 دقائق)

---

## ✅ الخطوة 5: إنشاء المستخدم Admin

بعد نجاح النشر:

1. انسخ رابط موقعك من Vercel (مثل: `https://intravvel.vercel.app`)
2. افتح المتصفح واذهب إلى:
   ```
   https://your-domain.vercel.app/api/v1/admin-init
   ```
3. ستظهر رسالة JSON:
   ```json
   {
     "message": "Admin user created successfully",
     "email": "admin@intravvel.com",
     "password": "admin123"
   }
   ```

---

## ✅ الخطوة 6: تسجيل الدخول

1. اذهب إلى: `https://your-domain.vercel.app`
2. سجل دخول بـ:
   - **Email**: `admin@intravvel.com`
   - **Password**: `admin123`

⚠️ **مهم جداً:** غيّر كلمة المرور فوراً!

---

## ✅ الخطوة 7: تغيير كلمة المرور (للأمان)

1. اذهب إلى: https://app.supabase.com/project/lwbtihgsuumfzrgxatge/auth/users
2. ابحث عن `admin@intravvel.com`
3. اضغط على المستخدم → **"Reset Password"**
4. أدخل كلمة مرور جديدة قوية

---

## ✅ الخطوة 8: إعادة تعيين Service Role Key (للأمان)

⚠️ **مهم للأمان!**

1. اذهب إلى: https://app.supabase.com/project/lwbtihgsuumfzrgxatge/settings/api
2. ابحث عن **"Service Role Key"**
3. اضغط **"Reset"** أو **"Generate New"**
4. انسخ المفتاح الجديد
5. ارجع لـ Vercel → Settings → Environment Variables
6. ابحث عن `SUPABASE_SERVICE_ROLE_KEY`
7. اضغط الثلاث نقاط (...) → **"Edit"**
8. الصق المفتاح الجديد
9. احفظ
10. في Vercel، اضغط **"Redeploy"**

---

## 🎉 تم! موقعك جاهز

الآن موقعك يعمل بالكامل مع:
✅ Supabase Database
✅ Authentication System
✅ Admin Dashboard
✅ AI Generator
✅ Email Notifications

---

## 📞 إذا واجهت مشكلة:

### المشكلة: SQL لم يعمل
- تأكد أنك نسخت **كل** الكود من ملف `supabase-schema.sql`
- تأكد أنك ضغطت زر "Run"
- تحقق من وجود رسالة خطأ وأخبرني بها

### المشكلة: git push فشل
- تأكد أنك في المجلد الصحيح: `cd "d:\backend - Copy"`
- جرب: `git status` للتحقق
- إذا طلب منك تسجيل دخول GitHub، سجل دخولك

### المشكلة: Vercel لم ينشر
- تحقق من أن Environment Variables مضافة بشكل صحيح
- تأكد من اختيار "Production, Preview, Development" للمتغيرات
- جرب "Redeploy" يدوياً من Vercel Dashboard

---

**ملف مساعد:** راجع `SUPABASE-SETUP.md` للتفاصيل الكاملة
