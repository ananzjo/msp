/* === MSP Sales - Visits Logic [Neutral V4.5] === */
document.addEventListener('DOMContentLoaded', async () => {
    const dateField = document.getElementById('f17_visit_date');
    if (dateField) dateField.valueAsDate = new Date();
    await loadGovernorates();
    const govSelect = document.getElementById('f01_governorate');
    if (govSelect) govSelect.addEventListener('change', (e) => loadAreas(e.target.value));
    const visitForm = document.getElementById('visitForm');
    if (visitForm) visitForm.addEventListener('submit', handleSaveVisit);
});

async function loadGovernorates() {
    const govSelect = document.getElementById('f01_governorate');
    if (!govSelect) return;
    try {
        const { data, error } = await supabaseClient.from('t02_lists').select('*').eq('f01_category', 'governorate');
        if (error) throw error;
        govSelect.innerHTML = '<option value="">اختر المحافظة...</option>' + 
            data.map(g => `<option value="${g.f00_record_no}">${g.f02_label_ar}</option>`).join('');
    } catch (err) { console.error(err); }
}

async function loadAreas(parentNo) {
    const areaSelect = document.getElementById('f02_area');
    if (!areaSelect || !parentNo) return;
    try {
        const { data, error } = await supabaseClient.from('t02_lists').select('*').eq('f05_parent_no', parentNo);
        if (error) throw error;
        areaSelect.innerHTML = '<option value="">اختر المنطقة...</option>' + 
            data.map(a => `<option value="${a.f02_label_ar}">${a.f02_label_ar}</option>`).join('');
    } catch (err) { console.error(err); }
}

async function handleSaveVisit(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('msp_user'));
    const visitData = {
        f01_governorate: document.getElementById('f01_governorate').options[document.getElementById('f01_governorate').selectedIndex].text,
        f02_area: document.getElementById('f02_area').value,
        f03_facility_name: document.getElementById('f03_facility_name').value,
        f04_facility_type: document.getElementById('f04_facility_type').value,
        f05_industrial_sector: document.getElementById('f05_industrial_sector').value,
        f06_address: document.getElementById('f06_address').value,
        f07_contact_person: document.getElementById('f07_contact_person').value,
        f08_job_title: document.getElementById('f08_job_title').value,
        f09_phone: document.getElementById('f09_phone').value,
        f10_email: document.getElementById('f10_email').value,
        f11_uses_carton: document.getElementById('f11_uses_carton').value,
        f12_monthly_qty: parseFloat(document.getElementById('f12_monthly_qty').value) || 0,
        f13_interest_level: document.getElementById('f13_interest_level').value,
        f14_sales_opportunity: document.getElementById('f14_sales_opportunity').value,
        f15_notes: document.getElementById('f15_notes').value,
        f16_sales_rep: user ? user.f_full_name : 'Unknown',
        f17_visit_date: document.getElementById('f17_visit_date').value,
        f18_follow_up: document.getElementById('f18_follow_up').value,
        f19_rating: parseInt(document.getElementById('f19_rating').value) || 5,
        f20_user_id: user ? user.id : null
    };

    const { error } = await supabaseClient.from('t01_visits').insert([visitData]);
    if (!error) {
        showNotification("تم الحفظ بنجاح", "تم توثيق الزيارة الميدانية وإضافتها لسجلات شركة MSP بنجاح ✅", "success");
        e.target.reset();
    } else {
        showNotification("فشل في الحفظ", "حدث خطأ أثناء الاتصال بالسحابة: " + error.message, "error");
    }
}
