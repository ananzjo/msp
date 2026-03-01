let dropdownData = {};
let currentVisits = [];

document.addEventListener('DOMContentLoaded', () => {
    loadLists();
    setupForm();
});

async function loadLists() {
    try {
        const res = await fetch(`${CONFIG.API_URL}?action=getLists`);
        const data = await res.json();
        dropdownData = data.governorates;
        populate('f_governorate', Object.keys(dropdownData));
        populate('f_facility_type', data.facilityTypes);
        populate('f_industrial_sector', data.sectors);
        populate('f_uses_carton', data.cartonOptions);
        populate('f_interest_level', data.interestLevels);
        populate('f_sales_opportunity', data.opportunities);
        populate('f_sales_rep', data.reps);
        populate('f_follow_up', data.visitTypes);
        loadTable();
    } catch (e) { showNotification("خطأ في التحميل", "error"); }
}

document.getElementById('f_governorate').onchange = function() {
    populate('f_area', dropdownData[this.value] || []);
};

function populate(id, list) {
    const el = document.getElementById(id);
    el.innerHTML = '<option value="">اختر...</option>';
    list.forEach(i => el.innerHTML += `<option value="${i}">${i}</option>`);
}

async function loadTable() {
    const res = await fetch(`${CONFIG.API_URL}?action=getVisits`);
    currentVisits = await res.json();
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = currentVisits.map((v, i) => {
        const r = parseInt(v["التقييم (1-10)"]);
        const rClass = r >= 8 ? 'badge-rating-high' : (r >= 5 ? 'badge-rating-mid' : 'badge-rating-low');
        return `<tr>
            <td>${v["تاريخ الزيارة"]}</td><td>${v["اسم المنشأة"]}</td><td>${v["المحافظة"]}</td><td>${v["اسم مندوب المبيعات"]}</td>
            <td><span class="badge badge-opportunity">${v["فرصة بيع"]}</span></td>
            <td><span class="badge ${rClass}">${r}/10</span></td>
            <td>
                <button class="edit-btn" onclick="prepareEdit(${i})">تعديل</button>
                <button class="delete-btn" onclick="deleteRow(${i + 2})">حذف</button>
            </td>
        </tr>`;
    }).join('');
}

function prepareEdit(idx) {
    const v = currentVisits[idx];
    document.getElementById('f_governorate').value = v["المحافظة"];
    document.getElementById('f_governorate').dispatchEvent(new Event('change'));
    setTimeout(() => {
        document.getElementById('f_area').value = v["المنطقة"];
        document.getElementById('f_facility_name').value = v["اسم المنشأة"];
        document.getElementById('f_facility_type').value = v["نوع المنشأة"];
        document.getElementById('f_visit_date').value = v["تاريخ الزيارة"];
        document.getElementById('f_rating').value = v["التقييم (1-10)"];
        document.getElementById('visitForm').dataset.editingRow = idx + 2;
        document.getElementById('saveBtn').textContent = "تحديث البيانات";
    }, 200);
    window.scrollTo(0,0);
}

async function deleteRow(row) {
    if(!confirm("حذف؟")) return;
    await fetch(`${CONFIG.API_URL}?action=deleteVisit&row=${row}`);
    loadTable();
}

function setupForm() {
    document.getElementById('visitForm').onsubmit = async (e) => {
        e.preventDefault();
        const editingRow = e.target.dataset.editingRow;
        const payload = {
            action: editingRow ? 'updateVisit' : 'addVisit',
            row: editingRow,
            data: {
                "المحافظة": document.getElementById('f_governorate').value,
                "المنطقة": document.getElementById('f_area').value,
                "اسم المنشأة": document.getElementById('f_facility_name').value,
                "نوع المنشأة": document.getElementById('f_facility_type').value,
                "القطاع الصناعي": document.getElementById('f_industrial_sector').value,
                "العنوان": document.getElementById('f_address').value,
                "اسم الشخص المسؤول": document.getElementById('f_contact_person').value,
                "المسمى الوظيفي": document.getElementById('f_job_title').value,
                "رقم الهاتف": document.getElementById('f_phone').value,
                "البريد الإلكتروني": document.getElementById('f_email').value,
                "هل يستخدم كرتون معرّج؟": document.getElementById('f_uses_carton').value,
                "الكمية الشهرية التقريبية": document.getElementById('f_monthly_qty').value,
                "درجة الاهتمام": document.getElementById('f_interest_level').value,
                "فرصة بيع": document.getElementById('f_sales_opportunity').value,
                "ملاحظات المندوب": document.getElementById('f_notes').value,
                "اسم مندوب المبيعات": document.getElementById('f_sales_rep').value,
                "تاريخ الزيارة": document.getElementById('f_visit_date').value,
                "زيارة متابعة؟": document.getElementById('f_follow_up').value,
                "التقييم (1-10)": document.getElementById('f_rating').value
            }
        };
        await fetch(CONFIG.API_URL, { method: 'POST', body: JSON.stringify(payload) });
        e.target.reset();
        delete e.target.dataset.editingRow;
        document.getElementById('saveBtn').textContent = "حفظ الزيارة";
        loadTable();
    };
}