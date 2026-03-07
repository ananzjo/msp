/**
 * File: visits.js
 * Version: v2.1.9
 * Function: Full CRUD, Excel Filtering, Yellow Arrow Sort, Global Search, Dynamic Lists
 * Components: Supabase Integration, Custom Toasts & Modals
 */

let currentData = [];
let deleteTargetId = null;
let sortConfig = { key: null, direction: 'asc' };

document.addEventListener('DOMContentLoaded', async () => {
    console.log("MSP System: Initializing Visits Logic...");
    
    // 1. تحميل القوائم من القاعدة (المحافظات والمناطق)
    await loadDynamicLists();
    
    // 2. جلب بيانات الزيارات للجدول
    fetchVisits();

    // 3. ربط أحداث النموذج
    const visitForm = document.getElementById('visitForm');
    if (visitForm) {
        visitForm.addEventListener('submit', handleFormSubmit);
        visitForm.addEventListener('reset', () => {
            showToast("تم تصفير كافة الحقول", "info");
            document.getElementById('edit_id').value = '';
            document.getElementById('submitBtn').innerHTML = "حفظ الزيارة | Save 💾";
        });
    }

    // 4. ربط أحداث المودال
    document.getElementById('confirm-no').onclick = () => document.getElementById('custom-confirm-modal').style.display = 'none';
    document.getElementById('confirm-yes').onclick = executeDelete;

    // 5. ضبط تاريخ اليوم تلقائياً
    const dateInput = document.getElementById('f17_visit_date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
});

// --- نظام الإشعارات (Toasts) ---
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const colors = { success: '#27ae60', error: '#e74c3c', info: '#3498db' };
    toast.style.cssText = `background:${colors[type]}; color:white; padding:12px 25px; border-radius:10px; margin-bottom:10px; box-shadow:0 5px 15px rgba(0,0,0,0.2); font-weight:bold; transition:0.4s; z-index:11000;`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3000);
}

// --- تحميل القوائم الديناميكية من t02_lists ---
async function loadDynamicLists() {
    try {
        const { data, error } = await window.supabase
            .from('t02_lists')
            .select('f01_type, f02_value')
            .order('f02_value', { ascending: true });

        if (error) throw error;

        const govSel = document.getElementById('f01_governorate');
        const areaSel = document.getElementById('f02_area');

        govSel.innerHTML = '<option value="">اختر محافظة..</option>';
        areaSel.innerHTML = '<option value="">اختر منطقة..</option>';

        if (data && data.length > 0) {
            data.forEach(item => {
                const opt = `<option value="${item.f02_value}">${item.f02_value}</option>`;
                if (item.f01_type === 'محافظة') govSel.innerHTML += opt;
                else if (item.f01_type === 'منطقة') areaSel.innerHTML += opt;
            });
            console.log("✅ Lists mapped from database.");
        }
    } catch (err) {
        console.error("❌ List Loading Error:", err.message);
        showToast("خطأ في تحميل القوائم من السيرفر", "error");
    }
}

// --- جلب البيانات ---
async function fetchVisits() {
    const { data, error } = await window.supabase
        .from('t01_visits')
        .select('*')
        .order('f17_visit_date', { ascending: false });

    if (!error) {
        currentData = data;
        applyFilters();
    } else {
        showToast("فشل في جلب سجلات الزيارات", "error");
    }
}

// --- رسم الجدول ---
function renderTable(data) {
    const tableBody = document.getElementById('visitsTableBody');
    const rowCount = document.getElementById('rowCount');
    if (rowCount) rowCount.innerText = data.length;

    tableBody.innerHTML = data.map(v => `
        <tr>
            <td>${v.f17_visit_date}</td>
            <td>${v.f03_facility_name}</td>
            <td>${v.f01_governorate}</td>
            <td style="font-weight:bold; color:${v.f14_sales_opportunity === 'فورية' ? '#e74c3c' : '#27ae60'}">
                ${v.f14_sales_opportunity}
            </td>
            <td>${v.f16_sales_rep || '---'}</td>
            <td>
                <button onclick="editVisit(${v.id})" class="action-btn btn-edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteConfirm(${v.id})" class="action-btn btn-delete"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
    `).join('');
}

// --- الفلترة المزدوجة (Global + Excel Columns) ---
function applyFilters() {
    const globalQuery = document.getElementById('globalSearch').value.toLowerCase();
    const colInputs = document.querySelectorAll('.filter-input');
    
    const filtered = currentData.filter(row => {
        const rowStr = Object.values(row).join(' ').toLowerCase();
        const matchesGlobal = !globalQuery || rowStr.includes(globalQuery);

        const matchesDate = !colInputs[0]?.value || (row.f17_visit_date || '').toLowerCase().includes(colInputs[0].value.toLowerCase());
        const matchesName = !colInputs[1]?.value || (row.f03_facility_name || '').toLowerCase().includes(colInputs[1].value.toLowerCase());
        const matchesGov  = !colInputs[2]?.value || (row.f01_governorate || '').toLowerCase().includes(colInputs[2].value.toLowerCase());
        const matchesOpp  = !colInputs[3]?.value || (row.f14_sales_opportunity || '').toLowerCase().includes(colInputs[3].value.toLowerCase());
        const matchesRep  = !colInputs[4]?.value || (row.f16_sales_rep || '').toLowerCase().includes(colInputs[4].value.toLowerCase());

        return matchesGlobal && matchesDate && matchesName && matchesGov && matchesOpp && matchesRep;
    });

    renderTable(filtered);
}

// --- الترتيب (Sorting) ---
function sortBy(key, el) {
    sortConfig.direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    sortConfig.key = key;

    document.querySelectorAll('.sort-arrow').forEach(a => a.innerHTML = '↕');
    el.querySelector('.sort-arrow').innerHTML = sortConfig.direction === 'asc' ? '▲' : '▼';

    currentData.sort((a, b) => {
        let vA = a[key] || '', vB = b[key] || '';
        return sortConfig.direction === 'asc' 
            ? vA.toString().localeCompare(vB.toString()) 
            : vB.toString().localeCompare(vA.toString());
    });
    applyFilters();
}

// --- عمليات الحفظ والتعديل ---
async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('edit_id').value;
    const formData = {};
    const fieldIds = [
        'f01_governorate', 'f02_area', 'f03_facility_name', 'f04_facility_type', 
        'f05_industrial_sector', 'f06_address', 'f07_contact_person', 'f08_job_title', 
        'f09_phone', 'f10_email', 'f11_uses_carton', 'f12_monthly_qty', 
        'f13_interest_level', 'f14_sales_opportunity', 'f15_notes', 
        'f17_visit_date', 'f18_follow_up', 'f19_rating'
    ];

    fieldIds.forEach(fid => {
        const el = document.getElementById(fid);
        if (el) formData[fid] = el.value;
    });

    const action = id 
        ? window.supabase.from('t01_visits').update(formData).eq('id', id)
        : window.supabase.from('t01_visits').insert([formData]);

    const { error } = await action;

    if (error) {
        showToast("فشلت العملية: " + error.message, "error");
    } else {
        showToast(id ? "تم تحديث البيانات بنجاح 🔄" : "تم حفظ الزيارة بنجاح 💾");
        document.getElementById('visitForm').reset();
        fetchVisits();
    }
}

// --- الحذف ---
function deleteConfirm(id) {
    deleteTargetId = id;
    document.getElementById('custom-confirm-modal').style.display = 'flex';
}

async function executeDelete() {
    const { error } = await window.supabase.from('t01_visits').delete().eq('id', deleteTargetId);
    if (!error) {
        showToast("تم حذف السجل بنجاح", "success");
        fetchVisits();
    } else {
        showToast("خطأ أثناء الحذف", "error");
    }
    document.getElementById('custom-confirm-modal').style.display = 'none';
}

// --- التعديل ---
async function editVisit(id) {
    const { data } = await window.supabase.from('t01_visits').select('*').eq('id', id).single();
    if (data) {
        document.getElementById('edit_id').value = data.id;
        Object.keys(data).forEach(key => {
            const el = document.getElementById(key);
            if (el) el.value = data[key];
        });
        document.getElementById('submitBtn').innerHTML = "تحديث البيانات | Update 🔄";
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast("تم تحميل بيانات " + data.f03_facility_name, "info");
    }
}