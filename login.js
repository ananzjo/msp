/* === MSP System - Login Logic [V3.0] === */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const eyeIcon = document.getElementById('eyeIcon');
    const passInput = document.getElementById('password');

    // 1. تبديل رؤية كلمة المرور
    if (eyeIcon && passInput) {
        eyeIcon.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            eyeIcon.textContent = isPass ? '🔒' : '👁️';
        });
    }

    // 2. معالجة نموذج تسجيل الدخول
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userVal = document.getElementById('username').value.trim();
            const passVal = document.getElementById('password').value.trim();
            const btn = document.getElementById('submitBtn');

            // تغيير حالة الزر أثناء التحقق
            btn.disabled = true;
            btn.innerHTML = 'جاري التحقق... <span class="spinner">⏳</span>';

            try {
                // الاستعلام من جدول المستخدمين الموحد t99_users
                const { data, error } = await supabaseClient
                    .from('t99_users')
                    .select('*')
                    .eq('f_username', userVal)
                    .eq('f_password', passVal)
                    .single();

                if (error || !data) {
                    throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
                }

                // حفظ بيانات المستخدم في LocalStorage (يقرأها المحرك العالمي)
                localStorage.setItem('msp_user', JSON.stringify(data));

                // إظهار رسالة نجاح باستخدام المودال الموحد
                showMspModal("مرحباً بك مجدداً", `أهلاً بك يا ${data.f_full_name}، جاري تحضير لوحة التحكم...`, "success");

                // الانتقال للداشبورد بعد ثانيتين
                setTimeout(() => {
                    window.location.replace('dashboard.html');
                }, 2000);

            } catch (err) {
                showMspModal("فشل الدخول", err.message, "error");
                btn.disabled = false;
                btn.innerHTML = 'دخول للنظام 🚀';
            }
        });
    }
});

/**
 * وظائف المودال (الرسائل المنبثقة)
 */
function showMspModal(title, message, type = 'success') {
    const modal = document.getElementById('mspModal');
    const icon = document.getElementById('modalIcon');
    const titleEl = document.getElementById('modalTitle');
    const textEl = document.getElementById('modalText');

    if (!modal) return;

    titleEl.textContent = title;
    textEl.textContent = message;
    
    if (type === 'success') {
        icon.textContent = '✅';
        icon.style.color = '#2fb45a';
    } else {
        icon.textContent = '⚠️';
        icon.style.color = '#e74c3c';
    }

    modal.style.display = 'flex';
}

function closeMspModal() {
    const modal = document.getElementById('mspModal');
    if (modal) modal.style.display = 'none';
}
