/* === MSP System Engine V6.0 - Luxury Dark Glass === */
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
        :root { 
            --msp-green: #2fb45a; --msp-bronze: #b08d57;
            --glass: rgba(255, 255, 255, 0.03); --border: rgba(255, 255, 255, 0.1);
        }
        body { 
            background: radial-gradient(circle at center, #1e272e 0%, #050505 100%);
            color: white; margin: 0; font-family: 'Segoe UI', sans-serif; display: flex; direction: rtl;
        }
        .sidebar { 
            width: 260px; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px);
            height: 100vh; position: fixed; right: 0; border-left: 1px solid var(--border);
            padding: 30px 20px; box-sizing: border-box;
        }
        .nav-link { 
            display: flex; align-items: center; padding: 12px 15px; color: #aaa;
            text-decoration: none; border-radius: 10px; margin-bottom: 10px; transition: 0.3s;
        }
        .nav-link:hover, .nav-link.active { background: var(--msp-green); color: white; transform: translateX(-5px); }
        .main-wrapper { margin-right: 260px; width: 100%; padding: 40px; box-sizing: border-box; }
        .msp-card { 
            background: var(--glass); backdrop-filter: blur(15px); border: 1px solid var(--border);
            border-radius: 20px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        #digitalClock { font-family: 'Orbitron', sans-serif; color: var(--msp-green); font-size: 1.6rem; text-shadow: 0 0 10px var(--msp-green); }
        .btn-luxury {
            background: linear-gradient(45deg, var(--msp-green), #26a653);
            color: white; border: none; padding: 12px 30px; border-radius: 10px;
            cursor: pointer; font-weight: bold; transition: 0.3s;
        }
        .btn-luxury:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(47, 180, 90, 0.4); }
    `;
    document.head.appendChild(style);

    const uiHTML = `
        <div class="sidebar">
            <img src="MSP_Logo.jpeg" style="width:120px; margin-bottom:40px; display:block; margin-right:auto; margin-left:auto;">
            <a href="dashboard.html" class="nav-link ${window.location.pathname.includes('dashboard')?'active':''}">📊 لوحة التحكم | Dashboard</a>
            <a href="visits.html" class="nav-link ${window.location.pathname.includes('visits')?'active':''}">📝 توثيق زيارة | New Visit</a>
            <a href="#" onclick="logout()" class="nav-link" style="margin-top:50px; color:#ff4757;">🚪 خروج | Logout</a>
        </div>
        <div class="main-wrapper">
            <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <div>
                    <h2 style="margin:0; color:var(--msp-bronze);">نظام إدارة مبيعات MSP</h2>
                    <small style="color:#888;">Modern Style Pack Sales System</small>
                </div>
                <div id="digitalClock">00:00:00</div>
            </header>
            <div id="pageContent"></div>
        </div>
        <div id="mspModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center;">
            <div class="msp-card" style="width:400px; text-align:center;">
                <div id="modalIcon" style="font-size:3rem; margin-bottom:15px;"></div>
                <h3 id="modalTitle"></h3>
                <p id="modalText" style="color:#ccc;"></p>
                <button class="btn-luxury" onclick="closeMspModal()">إغلاق | Close</button>
            </div>
        </div>
    `;
    document.body.innerHTML = uiHTML;
}

function showNotification(title, msg, type = 'success') {
    const modal = document.getElementById('mspModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = msg;
    document.getElementById('modalIcon').textContent = type === 'success' ? '✅' : '⚠️';
    modal.style.display = 'flex';
}

function closeMspModal() { document.getElementById('mspModal').style.display = 'none'; }

function initDigitalClock() {
    setInterval(() => {
        document.getElementById('digitalClock').textContent = new Date().toLocaleTimeString('ar-EG', {hour12:false});
    }, 1000);
}

function logout() { localStorage.removeItem('msp_user'); window.location.replace('login.html'); }
