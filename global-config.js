/* === MSP System Engine - Neutral Slate Theme === */
const SB_URL = "https://iowfsncjhzysomybiipk.supabase.co";
const SB_KEY = "sb_publishable_7LHRjeb5IV8XRQJcX-8Ung_lE_iIwsS";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    injectSharedUI();
    initDigitalClock();
});

function checkAuth() {
    const user = localStorage.getItem('msp_user');
    if (!user && !window.location.pathname.includes('login.html')) {
        window.location.replace('login.html');
    }
}

function injectSharedUI() {
    const user = JSON.parse(localStorage.getItem('msp_user')) || { f_full_name: "مستخدم" };
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');
        :root { 
            --msp-green: #2fb45a; --msp-bronze: #b08d57; 
            --bg-neutral: #2c343c; /* رمادي وسطي احترافي */
            --card-deep: #1e252b; 
            --text-grey: #cfd8dc;
        }
        body { 
            margin: 0; background: var(--bg-neutral); color: var(--text-grey);
            font-family: 'Segoe UI', sans-serif; direction: rtl;
        }
        .msp-header {
            position: fixed; top: 0; left: 0; right: 0; height: 70px;
            background: #1a2026; border-bottom: 2px solid var(--msp-green);
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 25px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        #digitalClock {
            font-family: 'Orbitron', sans-serif; color: var(--msp-green);
            font-size: 1.3rem; font-weight: bold; background: #000;
            padding: 5px 15px; border-radius: 6px; border: 1px solid #444;
        }
        .main-content { padding: 100px 25px 25px; }
        .msp-card { 
            background: var(--card-deep); border-radius: 12px; padding: 20px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15); border: 1px solid #3d4751; margin-bottom: 20px;
        }
        input, select, textarea {
            background: #252d35 !important; color: white !important;
            border: 1px solid #45525e !important; padding: 10px; border-radius: 6px;
        }
    `;
    document.head.appendChild(style);

    const headerHTML = `
        <header class="msp-header">
            <div style="display:flex; align-items:center; gap:15px;">
                <img src="MSP_Logo.jpeg" style="height:45px; border-radius:4px;">
                <span style="color:var(--msp-bronze); font-weight:bold;">نظام إدارة مبيعات MSP</span>
            </div>
            <div style="display:flex; align-items:center; gap:20px;">
                <div id="digitalClock">00:00:00</div>
                <div style="border-right: 1px solid #444; padding-right:15px">
                    <strong style="color:var(--msp-green);">${user.f_full_name}</strong>
                </div>
            </div>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

function initDigitalClock() {
    setInterval(() => {
        const el = document.getElementById('digitalClock');
        if(el) el.textContent = new Date().toLocaleTimeString('ar-EG', {hour12:false});
    }, 1000);
}

function showNotification(title, msg, type = 'success') {
    alert(title + ": " + msg);
}
