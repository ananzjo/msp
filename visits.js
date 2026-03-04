/* === Visits Logic === */

document.addEventListener('DOMContentLoaded', async () => {
    // تعيين تاريخ اليوم تلقائياً
    document.getElementById('f17_visit_date').valueAsDate = new Date();
    
    await loadLists();
    await fetchVisits();

    document.getElementById('visitForm').addEventListener('submit', saveVisit);
});

async function loadLists() {
    const { data } = await supabaseClient.from('t02_lists').select('*');
    const govSel = document.getElementById('f01_governorate');
    const areaSel = document.getElementById('f02_area');

    const govs = data.filter(i => i.f01_category === 'governorate');
    govSel.innerHTML = '<option value="">اختر..</option>' + govs.map(g => `<option value="${g.f02_label_ar}">${g.f02_label_ar}</option>`).join('');

    govSel.onchange = () => {
        const parent = govs.find(g => g.f02_label_ar === govSel.value);
        const areas = data.filter(i => i.f05_parent_no === parent?.f00_record_no);
        areaSel.innerHTML = areas.map(a => `<option value="${a.f02_label_ar}">${a.f02_label_ar}</option>`).join('');
    };
}

async function saveVisit(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('msp_user'));
    
    const formData = {};
    // جمع كل الحقول التي تبدأ بـ f تلقائياً
    document.querySelectorAll('.msp-input').forEach(input => {
        formData[input.id] = input.value;
    });
    
    formData.f16_sales_rep = user.f_full_name;

    const { error } = await supabaseClient.from('t01_visits').insert([formData]);

    if (error) {
        showNotification("خطأ في الحفظ: " + error.message, "error");
    } else {
        showNotification("تم توثيق الزيارة بنجاح", "success");
        e.target.reset();
        fetchVisits();
    }
}

async function fetchVisits() {
    const { data } = await supabaseClient.from('t01_visits').select('*').order('f00_created_at', {ascending: false}).limit(10);
    const tbody = document.getElementById('visitsTableBody');
    tbody.innerHTML = data.map(v => `
        <tr>
            <td>${v.f17_visit_date}</td>
            <td><b>${v.f03_facility_name}</b></td>
            <td>${v.f01_governorate}</td>
            <td>${v.f07_contact_person || '-'}</td>
            <td><span class="rating-badge">${v.f19_rating || 0}</span></td>
            <td><button class="btn-secondary" style="padding:4px 8px" onclick="alert('${v.f15_notes || 'لا ملاحظات'}')">👁️</button></td>
        </tr>
    `).join('');
}
