/**
 * File: global-config.js | ملف: المحرك المركزي للنظام
 * Version: v2.1.8 | الإصدار: 2.1.8
 * Update: Finalized Sidebar Links (Visits, Dashboard, Login/Logout)
 * Policy: 75% Container, Full-width Header, Smart Toggle, RTL Icons
 */

// 1. إعدادات سوبابيز المعتمدة | Supabase Credentials
const SUPABASE_URL = "https://iowfsncjhzysomybiipk.supabase.co";
const SUPABASE_KEY = "sb_publishable_7LHRjeb5IV8XRQJcX-8Ung_lE_iIwsS";

// تهيئة الاتصال | Initialize Supabase
// @ts-ignore
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * تشغيل المحرك المركزي عند تحميل الصفحة
 */
function initGlobalEngine() {
    console.log("MSP System: Core Engine v2.1.8 Started...");
    injectGlobalStyles(); 
    injectHeader();
    injectSidebar();
    startDigitalClock();
}

/**
 * حقن التنسيقات العالمية (المحاذاة، الاستجابة، والساعة الرقمية)
 */
function injectGlobalStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.cdnfonts.com/css/digital-7-mono');
        
        /* الهيدر الكامل | Full Width Header */
        .system-header {
            position: fixed; top: 0; left: 0; right: 0;
            height: 70px; background: #111; color: white;
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 5%; border-bottom: 3px solid #27ae60;
            z-index: 1000; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .seven-segment-clock {
            font-family: 'Digital-7 Mono', sans-serif;
            font-size: clamp(1.5rem, 5vw, 2.4rem); color: #00ff00;
            text-shadow: 0 0 10px #00ff00; letter-spacing: 2px;
        }

        /* السايدبار - يبدأ تحت الهيدر | Sidebar below Header */
        .sliding-sidebar {
            position: fixed; top: 73px; right: -320px; width: 320px;
            height: calc(100vh - 73px); background: #1a1a1a;
            transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1100;
            border-left: 3px solid #27ae60; direction: rtl; text-align: right;
        }
        
        .sliding-sidebar.active { right: 0; }

        /* زر القائمة - يختفي عند الفتح | Smart Toggle Button */
        .btn-sidebar-toggle {
            position: fixed; top: 85px; right: 20px;
            z-index: 1050; background: #27ae60; color: white;
            border: none; width: 45px; height: 45px; border-radius: 8px;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: 0.3s; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .btn-sidebar-toggle.hidden { opacity: 0; pointer-events: none; transform: scale(0.8); }

        /* حاوية الصفحة - 75% موسطة | Responsive Container */
        .page-container {
            width: 90%; max-width: 1400px;
            margin: 140px auto 40px; transition: 0.3s;
        }

        /* تحسين الاستجابة والتباعد | Responsiveness & Spacing */
        @media (min-width: 992px) {
            .page-container { width: 75% !important; }
            .form-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 30px !important; }
        }

        @media (max-width: 991px) {
            .form-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
            .system-header { padding: 0 15px; }
            .system-header span { font-size: 0.9rem; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * حقن الهيدر بالمسمى الرسمي
 */
function injectHeader() {
    const headerHTML = `
        <header class="system-header">
            <div class="header-left">
                <span style="font-weight: 800; color: #27ae60;">نظام توثيق الزيارات الذكي (MSP)</span>
            </div>
            <div class="header-right">
                <div id="digital-clock" class="seven-segment-clock">00:00:00</div>
            </div>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

/**
 * حقن السايدبار بالروابط المعتمدة فقط
 */
function injectSidebar() {
    const sidebarHTML = `
        <nav id="sidebar" class="sliding-sidebar">
            <div style="padding: 25px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #27ae60; font-weight: bold; font-size: 1.1rem;">القائمة | MENU</span>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#fff; font-size:1.8rem; cursor:pointer; line-height:1;">&times;</button>
            </div>
            
            <ul style="list-style: none; padding: 20px 0; margin: 0;">
                ${[
                    { nameAr: 'الزيارات', nameEn: 'Visits', icon: 'fa-route', link: 'visits.html' },
                    { nameAr: 'لوحة البيانات', nameEn: 'Dashboard', icon: 'fa-chart-pie', link: 'dashboard.html' },
                    { nameAr: 'تسجيل دخول/خروج', nameEn: 'Login/Logout', icon: 'fa-sign-in-alt', link: 'login.html' }
                ].map(item => `
                    <li style="margin-bottom: 5px;">
                        <a href="${item.link}" style="color: #fff; text-decoration: none; display: flex; align-items: center; padding: 15px 25px; transition: 0.3s; gap: 15px; border-right: 4px solid transparent;" 
                           onmouseover="this.style.background='#222'; this.style.borderRightColor='#27ae60'" 
                           onmouseout="this.style.background='transparent'; this.style.borderRightColor='transparent'">
                            
                            <i class="fas ${item.icon}" style="width: 25px; color: #27ae60; font-size: 1.2rem; text-align: center;"></i>
                            <span style="font-size: 1rem; display: flex; gap: 8px; align-items: center;">
                                <span>${item.nameAr}</span>
                                <span style="color: #666; font-size: 0.85rem;">| ${item.nameEn}</span>
                            </span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </nav>
        <button id="main-menu-btn" class="btn-sidebar-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
}

/**
 * وظيفة فتح وإغلاق السايدبار وتبديل زر القائمة
 */
function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const btn = document.getElementById('main-menu-btn');
    if(sb && btn) {
        sb.classList.toggle('active');
        btn.classList.toggle('hidden');
    }
}

/**
 * تشغيل الساعة الرقمية بنظام 24 ساعة
 */
function startDigitalClock() {
    const clockElement = document.getElementById('digital-clock');
    if (!clockElement) return;
    setInterval(() => {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
    }, 1000);
}

// تشغيل المحرك تلقائياً
window.onload = initGlobalEngine;