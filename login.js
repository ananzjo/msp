document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('f01_username').value;
    const p = document.getElementById('f02_password').value;

    const { data, error } = await supabaseClient.from('t99_users')
        .select('*').eq('f01_username', u).eq('f02_password', p).maybeSingle();

    if (data) {
        localStorage.setItem('msp_user', JSON.stringify(data));
        showNotification("نجاح", `أهلاً بك سيد ${data.f03_full_name}`, "success");
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
    } else {
        showNotification("فشل", "بيانات الدخول خاطئة", "error");
    }
});