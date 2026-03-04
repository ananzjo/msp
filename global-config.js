/* === MSP System Engine V7.0 - Neutral Slate Theme === */
const SB_URL = "https://iowfsncjhzysomybiipk.supabase.co";
const SB_KEY = "sb_publishable_7LHRjeb5IV8XRQJcX-8Ung_lE_iIwsS";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    injectSharedUI();
    initDigitalClock();
});

function injectSharedUI() {
    const user = JSON.parse(localStorage.getItem('msp_user')) || { f_full_name: "مستخدم" };
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
        :root { 
            --msp-green: #2fb45a; --msp-bronze: #b08d57;
            --bg-neutral: #2c343c; /* لون رمادي متوسط احترافي */
            --sidebar-bg: #1e252b; --card-bg: #353f48;
            --border: rgba(255, 255, 255, 0.08);
        }
        body { 
            background: var(--bg-neutral); color: #e1e8ed; margin: 0; 
            font-family: 'Segoe UI', sans-serif; display: flex; direction: rtl;
        }
        .sidebar { 
            width: 260px; background: var(--sidebar-bg); height: 100vh; position: fixed; 
            right: 0; border-left: 1px solid var(--border); padding: 30px 20px; box-sizing: border-box;
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
        
        /* خط الساعة الرقمي */
        #digitalClock { 
            font-family: 'Orbitron', sans-serif; color: var(--msp-green); 
            font-size: 1.8rem; letter-spacing: 2px; background: #1a1a1a;
            padding: 5px 15px; border-radius: 8px; border: 1px solid #444;
            display: inline-block; box-shadow: inset 0 0 10px rgba(47, 180, 90, 0.2);
        }
        
        label { color: var(--msp-bronze); font-weight: bold; font-size: 0.85rem; margin-bottom: 8px; display: block; }
        input, select, textarea { 
            width: 100%; background: #252d35; color: white; border: 1px solid #45525e; 
            padding: 12px; border-radius: 8px; box-sizing: border-box; outline: none;
        }
        .btn-luxury {
            background: var(--msp-green); color: white; border: none; padding: 12px 35px;
            border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;
        }
    `;
    document.head.appendChild(style);

    const sidebarHTML = `
        <div class="sidebar">
            <img src="MSP_Logo.jpeg" style="width:130px; border-radius:10px; margin: 0 auto 40px; display:block;">
            <a href="dashboard.html" class="nav-link ${window.location.pathname.includes('dashboard')?'active':''}">📊 لوحة التحكم | Dashboard</a>
            <a href="visits.html" class="nav-link ${window.location.pathname.includes('visits')?'active':''}">📝 توثيق زيارة | New Visit</a>
            <a href="#" onclick="logout()" class="nav-link" style="margin-top:50px; color:#ff7675;">🚪 خروج | Logout</a>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

function initDigitalClock() {
    setInterval(() => {
        const el = document.getElementById('digitalClock');
        if(el) el.textContent = new Date().toLocaleTimeString('ar-EG', {hour12:false});
    }, 1000);
}
// بقية الدوال (checkAuth, logout, showNotification) تبقى كما هي...
