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

/* تحديث كود الدخول في login.html */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userVal = document.getElementById('f01_username').value.trim();
    const passVal = document.getElementById('f02_password').value.trim();

    try {
        // نستخدم .select() مع فلتر مباشر لتجنب تعقيدات الـ API
        const { data, error, status } = await supabaseClient
            .from('t99_users')
            .select('*')
            .eq('f01_username', userVal)
            .eq('f02_password', passVal);

        if (error) {
            console.error("Supabase Error:", error);
            showNotification("خطأ في الخادم", `رمز الخطأ: ${status} - ${error.message}`, "error");
            return;
        }

        if (data && data.length > 0) {
            localStorage.setItem('msp_user', JSON.stringify(data[0]));
            window.location.replace('dashboard.html');
        } else {
            showNotification("دخول غير مصرح", "تأكد من اسم المستخدم وكلمة المرور.", "error");
        }
    } catch (err) {
        showNotification("عطل فني", "فشل الاتصال بقاعدة البيانات.", "error");
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
