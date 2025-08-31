@echo off
REM ==== إعداد اسم المستخدم والبريد الإلكتروني ====
git config user.name "SaidEL1"
git config user.email "expressodoz@gmail.com"

REM ==== إنشاء ملف .gitignore الاحترافي ====
echo # Ignore OS files > .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore

echo # Node and Next.js >> .gitignore
echo node_modules/ >> .gitignore
echo .next/ >> .gitignore
echo out/ >> .gitignore
echo build/ >> .gitignore
echo dist/ >> .gitignore

echo # Env files >> .gitignore
echo .env >> .gitignore
echo .env.* >> .gitignore
echo !.env.example >> .gitignore

echo # Logs >> .gitignore
echo logs >> .gitignore
echo *.log >> .gitignore

echo # IDE/editor >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore
echo *.suo >> .gitignore
echo *.tmp >> .gitignore

REM ==== تهيئة Git (إذا لم تكن مهيأة) ====
git init

REM ==== إعادة تسمية الفرع إلى main ====
git branch -M main

REM ==== ربط المستودع البعيد (استبدل بالرابط الخاص بك) ====
git remote add origin https://github.com/SaidEL1/Booking_TKT.git

REM ==== إضافة جميع الملفات ====
git add .

REM ==== إنشاء أول commit ====
git commit -m "رفع أولي تلقائي من السكريبت"

REM ==== رفع المشروع إلى GitHub ====
git push -u origin main --force

echo ============================
echo ✅ تم رفع المشروع بنجاح إلى GitHub
echo افتح: https://github.com/SaidEL1/Booking_TKT
echo ============================

pause

@echo off
git add .
git commit -m "تحديث"
git push
pause

