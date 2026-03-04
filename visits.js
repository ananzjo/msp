/* === MSP Sales - Visits Logic [Neutral V4.5] === */

document.addEventListener('DOMContentLoaded', async () => {
    const dateInput = document.getElementById('f17_visit_date');
    if (dateInput) dateInput.valueAsDate = new Date();

    await loadGovernorates();

    const govSelect = document.getElementById('f01_governorate');
    if (govSelect) {
        govSelect.addEventListener('change', (e) => loadAreas(e.target.value));
    }

    const visitForm = document.getElementById('visitForm');
    if (visitForm) {
        visitForm.addEventListener('submit', handleSaveVisit);
    }

    fetchRecentVisits();
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
    if (!areaSelect) return;
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
        f07_contact_person: document.getElementById('f07_contact_person').value,
        f09_phone: document.getElementById('f09_phone').value,
        f11_uses_carton: document.getElementById('f11_uses_carton').value,
        f12_monthly_qty: parseFloat(document.getElementById('f12_monthly_qty').value) || 0,
        f16_sales_rep: user ? user.f_full_name : 'Unknown',
        f17_visit_date: document.getElementById('f17_visit_date').value,
        f19_rating: parseInt(document.getElementById('f19_rating').value) || 5,
        f20_user_id: user ? user.id : null
    };

    const { error } = await supabaseClient.from('t01_visits').insert([visitData]);
    if (!error) {
        showNotification("تم الحفظ", "تم توثيق الزيارة بنجاح ✅");
        e.target.reset();
        fetchRecentVisits();
    } else {
        showNotification("خطأ", error.message, "error");
    }
}

async function fetchRecentVisits() {
    const tableBody = document.getElementById('visitsTableBody');
    if (!tableBody) return;
    const { data } = await supabaseClient.from('t01_visits').select('*').order('f00_created_at', { ascending: false }).limit(10);
    if (data) {
        tableBody.innerHTML = data.map(v => `
            <tr>
                <td>${v.f17_visit_date}</td>
                <td><b>${v.f03_facility_name}</b></td>
                <td>${v.f01_governorate}</td>
                <td>${v.f16_sales_rep}</td>
                <td>${v.f19_rating}/10</td>
            </tr>
        `).join('');
    }
}
