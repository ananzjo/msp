/* === MSP System Engine V7.5 - Neutral Slate Theme [FIXED] === */
const SB_URL = "https://iowfsncjhzysomybiipk.supabase.co";
const SB_KEY = "sb_publishable_7LHRjeb5IV8XRQJcX-8Ung_lE_iIwsS";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();       // تم التأكد من تعريفها بالأسفل
    injectSharedUI();  // تم التأكد من تعريفها بالأسفل
    initDigitalClock(); // تم التأكد من تعريفها بالأسفل
});

// 1. التحقق من صلاحية الدخول
function checkAuth() {
    const user = localStorage.getItem('msp_user');
    if (!user && !window.location.pathname.includes('login.html')) {
        window.location.replace('login.html');
    }
}

// 2. حقن الواجهة الموحدة (الثيم الوسطي + السايدبار)
function injectSharedUI() {
    const user = JSON.parse(localStorage.getItem('msp_user')) || { f_full_name: "مستخدم" };
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
        :root { 
            --msp-green: #2fb45a; --msp-bronze: #b08d57;
            --bg-neutral: #2c343c; /* الرمادي المتوسط المريح */
            --sidebar-bg: #1e252b; --card-bg: #353f48;
            --border: rgba(255, 255, 255, 0.08);
        }
        body { 
            background: var(--bg-neutral); color: #e1e8ed; margin: 0; 
            font-family: 'Segoe UI', sans-serif; display: flex; direction: rtl; min-height: 100vh;
        }
        .sidebar { 
            width: 260px; background: var(--sidebar-bg); height: 100vh; position: fixed; 
            right: 0; border-left: 1px solid var(--border); padding: 30px 20px; box-sizing: border-box; z-index: 1000;
        }
        .nav-link { 
            display: flex; align-items: center; padding: 12px 15px; color: #b0bec5;
            text-decoration: none; border-radius: 8px; margin-bottom: 8px; transition: 0.3s;
        }
        .nav-link:hover, .nav-link.active { background: var(--msp-green); color: white; }
        .main-wrapper { margin-right: 260px; width: calc(100% - 260px); padding: 40px; box-sizing: border-box; }
        .msp-card { 
            background: var(--card-bg); border: 1px solid var(--border);
            border-radius: 15px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        #digitalClock { 
            font-family: 'Orbitron', sans-serif; color: var(--msp-green); 
            font-size: 1.6rem; background: #1a1a1a; padding: 5px 15px; border-radius: 8px; 
            border: 1px solid #444; display: inline-block;
        }
        label { color: var(--msp-bronze); font-weight: bold; font-size: 0.85rem; margin-bottom: 8px; display: block; }
        input, select, textarea { 
            width: 100%; background: #252d35 !important; color: white !important; 
            border: 1px solid #45525e !important; padding: 10px; border-radius: 8px; box-sizing: border-box;
        }
        .btn-luxury {
            background: var(--msp-green); color: white; border: none; padding: 12px 35px;
            border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;
        }
    `;
    document.head.appendChild(style);

    const sidebarHTML = `
        <div class="sidebar">
            <img src="MSP_Logo.jpeg" style="width:130px; border-radius:10px; margin: 0 auto 30px; display:block;">
            <div style="text-align:center; margin-bottom:30px; border-bottom:1px solid var(--border); padding-bottom:15px;">
                <small style="color:var(--msp-bronze)">مرحباً بك</small>
                <div style="font-weight:bold; color:white;">${user.f_full_name}</div>
            </div>
            <a href="dashboard.html" class="nav-link ${window.location.pathname.includes('dashboard')?'active':''}">📊 لوحة التحكم | Dashboard</a>
            <a href="visits.html" class="nav-link ${window.location.pathname.includes('visits')?'active':''}">📝 توثيق زيارة | New Visit</a>
            <a href="#" onclick="logout()" class="nav-link" style="margin-top:50px; color:#ff7675;">🚪 خروج | Logout</a>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

// 3. تشغيل الساعة الرقمية
function initDigitalClock() {
    setInterval(() => {
        const el = document.getElementById('digitalClock');
        if(el) el.textContent = new Date().toLocaleTimeString('ar-EG', {hour12:false});
    }, 1000);
}

// 4. تسجيل الخروج
function logout() {
    localStorage.removeItem('msp_user');
    window.location.replace('login.html');
}

// 5. نظام الإشعارات (Modal)
function showNotification(title, msg, type = 'success') {
    const modalHTML = `
        <div id="mspModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(5px);">
            <div class="msp-card" style="width:400px; text-align:center;">
                <div style="font-size:3.5rem; margin-bottom:15px;">${type === 'success' ? '✅' : '⚠️'}</div>
                <h3 style="color:white;">${title}</h3>
                <p style="color:#bbb; margin-bottom:25px;">${msg}</p>
                <button class="btn-luxury" onclick="this.parentElement.parentElement.remove()">إغلاق | Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
