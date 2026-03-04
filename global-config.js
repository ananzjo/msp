/* MSP Dashboard Logic - SECURE & SYNCED VERSION */

// 1. حماية الصفحة: إذا لم تكن مسجلاً، اذهب للدخول فوراً
(function checkAuth() {
    if (!localStorage.getItem('msp_user')) {
        window.location.replace('login.html');
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // جلب البيانات من Supabase
        const { data: visits, error } = await supabaseClient.from('t01_visits').select('*');
        
        if (error) throw error;
        if (!visits || visits.length === 0) {
            console.warn("لا توجد بيانات لعرضها في لوحة التحكم");
            return;
        }

        updateCounters(visits);
        renderGeoChart(visits);
        renderRepChart(visits);
        renderQtyChart(visits);

    } catch (err) {
        console.error("Dashboard Loading Error:", err.message);
    }
});

// 2. تحديث الأرقام العلوية (تأكد أن الـ IDs تطابق الـ HTML)
function updateCounters(data) {
    const totalVisitsEl = document.getElementById('totalVisits');
    const hotLeadsEl = document.getElementById('hotLeads');
    const totalQtyEl = document.getElementById('totalQty');
    const avgRatingEl = document.getElementById('avgRating');

    if (totalVisitsEl) totalVisitsEl.textContent = data.length;
    
    if (hotLeadsEl) {
        const hotCount = data.filter(v => v.f14_sales_opportunity === 'فورية').length;
        hotLeadsEl.textContent = hotCount;
    }
    
    if (totalQtyEl) {
        const totalQty = data.reduce((sum, v) => sum + (parseFloat(v.f12_monthly_qty) || 0), 0);
        totalQtyEl.textContent = totalQty.toLocaleString();
    }

    if (avgRatingEl && data.length > 0) {
        const avg = data.reduce((sum, v) => sum + (parseFloat(v.f19_rating) || 0), 0) / data.length;
        avgRatingEl.textContent = avg.toFixed(1) + "/10";
    }
}

// 3. الرسوم البيانية (بقيت كما هي مع إضافة حماية التأكد من وجود الـ Canvas)
function renderGeoChart(data) {
    const ctx = document.getElementById('geoChart');
    if (!ctx) return;

    const counts = {};
    data.forEach(v => counts[v.f01_governorate] = (counts[v.f01_governorate] || 0) + 1);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#2fb45a', '#b08d57', '#3498db', '#e74c3c', '#f1c40f'],
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true,
            plugins: { legend: { position: 'bottom', labels: { color: '#fff', font: { family: 'Segoe UI' } } } } 
        }
    });
}

// 4. رسم بياني للمناديب
function renderRepChart(data) {
    const ctx = document.getElementById('repChart');
    if (!ctx) return;

    const counts = {};
    data.forEach(v => counts[v.f16_sales_rep] = (counts[v.f16_sales_rep] || 0) + 1);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                label: 'عدد الزيارات',
                data: Object.values(counts),
                backgroundColor: 'rgba(47, 180, 90, 0.6)',
                borderColor: '#2fb45a',
                borderWidth: 1
            }]
        },
        options: { 
            scales: { 
                y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: '#fff' }, grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// 5. تحليل الطلب المتوقع
function renderQtyChart(data) {
    const ctx = document.getElementById('qtyChart');
    if (!ctx) return;

    const sorted = [...data].sort((a, b) => new Date(a.f17_visit_date) - new Date(b.f17_visit_date));
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sorted.map(v => v.f17_visit_date),
            datasets: [{
                label: 'الكمية المتوقعة (طن)',
                data: sorted.map(v => v.f12_monthly_qty),
                borderColor: '#b08d57',
                backgroundColor: 'rgba(176, 141, 87, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
                y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: '#fff' }, grid: { display: false } }
            }
        }
    });
}

// دالة تسجيل الخروج
function logout() {
    localStorage.removeItem('msp_user');
    window.location.replace('login.html');
}
