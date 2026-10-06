const sampleStudents = [
  {
    student_id: 'STU-1001',
    name: 'Alice Johnson',
    email: 'alice.johnson@school.edu',
    phone: '+1 (415) 555-0143',
    department: 'Computer Science',
    program: 'BSc in Computer Science',
    year: '3',
    gpa: '3.8',
    status: 'Active'
  },
  {
    student_id: 'STU-1002',
    name: 'Daniel Smith',
    email: 'daniel.smith@school.edu',
    phone: '+1 (212) 555-0167',
    department: 'Business Administration',
    program: 'BBA in Marketing',
    year: '2',
    gpa: '3.6',
    status: 'Active'
  },
  {
    student_id: 'STU-1003',
    name: 'Priya Patel',
    email: 'priya.patel@school.edu',
    phone: '+1 (646) 555-0198',
    department: 'Engineering',
    program: 'BEng in Civil Engineering',
    year: '4',
    gpa: '3.9',
    status: 'Graduated'
  },
  {
    student_id: 'STU-1004',
    name: 'Marcus Lee',
    email: 'marcus.lee@school.edu',
    phone: '+1 (310) 555-0137',
    department: 'Health Sciences',
    program: 'BS in Nursing',
    year: '1',
    gpa: '3.5',
    status: 'Active'
  },
  {
    student_id: 'STU-1005',
    name: 'Sofia Martinez',
    email: 'sofia.martinez@school.edu',
    phone: '+1 (512) 555-0112',
    department: 'Computer Science',
    program: 'BSc in Data Science',
    year: '2',
    gpa: '3.7',
    status: 'Active'
  },
  {
    student_id: 'STU-1006',
    name: 'Noah Wilson',
    email: 'noah.wilson@school.edu',
    phone: '+1 (678) 555-0186',
    department: 'Arts & Humanities',
    program: 'BA in English Literature',
    year: '3',
    gpa: '3.4',
    status: 'Inactive'
  },
  {
    student_id: 'STU-1007',
    name: 'Aisha Khan',
    email: 'aisha.khan@school.edu',
    phone: '+1 (206) 555-0191',
    department: 'Engineering',
    program: 'BSc in Mechanical Engineering',
    year: '4',
    gpa: '3.8',
    status: 'Active'
  },
  {
    student_id: 'STU-1008',
    name: 'Liam Garcia',
    email: 'liam.garcia@school.edu',
    phone: '+1 (720) 555-0104',
    department: 'Business Administration',
    program: 'MBA in Finance',
    year: '1',
    gpa: '3.9',
    status: 'Active'
  }
];

const state = {
  students: [...sampleStudents],
  currentFilters: {
    search: '',
    department: 'all',
    year: 'all',
    status: 'all'
  }
};

const searchInput = document.getElementById('searchInput');
const departmentFilter = document.getElementById('departmentFilter');
const yearFilter = document.getElementById('yearFilter');
const statusFilter = document.getElementById('statusFilter');
const studentTableBody = document.getElementById('studentTableBody');
const emptyState = document.getElementById('emptyState');
const resultSummary = document.getElementById('resultSummary');
const totalStudents = document.getElementById('totalStudents');
const visibleStudents = document.getElementById('visibleStudents');
const departmentCount = document.getElementById('departmentCount');
const excelFileInput = document.getElementById('excelFileInput');

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function getStatusClass(status) {
  const normalized = normalizeText(status);

  if (normalized === 'graduated') return 'status-graduated';
  if (normalized === 'inactive') return 'status-inactive';
  return 'status-active';
}

function mapStudentRow(raw) {
  const student = {
    student_id: raw.student_id || raw.studentId || raw.id || raw['Student ID'] || raw['student id'] || '',
    name: raw.name || raw.full_name || raw['Full Name'] || raw['Student Name'] || raw['name'] || '',
    email: raw.email || raw['Email Address'] || raw['Email'] || raw['email'] || '',
    phone: raw.phone || raw['Phone Number'] || raw['Phone'] || raw['phone'] || '',
    department: raw.department || raw['Department'] || raw['department'] || '',
    program: raw.program || raw['Program'] || raw['Course'] || raw['program'] || '',
    year: raw.year || raw['Year'] || raw['Academic Year'] || raw['year'] || '',
    gpa: raw.gpa || raw['GPA'] || raw['gpa'] || '',
    status: raw.status || raw['Status'] || raw['student_status'] || 'Active'
  };

  return {
    ...student,
    student_id: String(student.student_id || '').trim(),
    name: String(student.name || '').trim(),
    email: String(student.email || '').trim(),
    phone: String(student.phone || '').trim(),
    department: String(student.department || '').trim(),
    program: String(student.program || '').trim(),
    year: String(student.year || '').trim(),
    gpa: String(student.gpa || '').trim(),
    status: String(student.status || 'Active').trim()
  };
}

function toTitleCase(value) {
  return String(value || '')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function renderTable(rows) {
  studentTableBody.innerHTML = rows
    .map(
      student => `
        <tr>
          <td>${student.student_id || '—'}</td>
          <td>${student.name || '—'}</td>
          <td>${student.program || '—'}</td>
          <td>${student.department || '—'}</td>
          <td>${student.year || '—'}</td>
          <td>${student.email || '—'}</td>
          <td>${student.phone || '—'}</td>
          <td>
            <span class="status-pill ${getStatusClass(student.status)}">
              ${toTitleCase(student.status || 'Active')}
            </span>
          </td>
        </tr>
      `
    )
    .join('');
}

function updateStats(rows) {
  const departments = new Set(rows.map(student => student.department).filter(Boolean));

  totalStudents.textContent = state.students.length;
  visibleStudents.textContent = rows.length;
  departmentCount.textContent = departments.size;
  resultSummary.textContent = `${rows.length} result${rows.length === 1 ? '' : 's'}`;
}

function applyFilters() {
  const searchText = normalizeText(searchInput.value);
  const departmentValue = normalizeText(departmentFilter.value);
  const yearValue = normalizeText(yearFilter.value);
  const statusValue = normalizeText(statusFilter.value);

  const filteredStudents = state.students.filter(student => {
    const haystack = [
      student.student_id,
      student.name,
      student.email,
      student.phone,
      student.department,
      student.program,
      student.year,
      student.gpa,
      student.status
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = !searchText || haystack.includes(searchText);
    const matchesDepartment = departmentValue === 'all' || normalizeText(student.department) === departmentValue;
    const matchesYear = yearValue === 'all' || normalizeText(student.year) === yearValue;
    const matchesStatus = statusValue === 'all' || normalizeText(student.status) === statusValue;

    return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
  });

  renderTable(filteredStudents);
  updateStats(filteredStudents);
  emptyState.classList.toggle('hidden', filteredStudents.length > 0);
}

function populateFilters() {
  const departments = [...new Set(state.students.map(student => student.department).filter(Boolean))].sort();
  const years = [...new Set(state.students.map(student => String(student.year).trim()).filter(Boolean))].sort((a, b) => Number(a) - Number(b));
  const statuses = [...new Set(state.students.map(student => student.status).filter(Boolean))].sort();

  departmentFilter.innerHTML = '<option value="all">All departments</option>' +
    departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');

  yearFilter.innerHTML = '<option value="all">All years</option>' +
    years.map(year => `<option value="${year}">${year}</option>`).join('');

  statusFilter.innerHTML = '<option value="all">All statuses</option>' +
    statuses.map(status => `<option value="${status}">${toTitleCase(status)}</option>`).join('');
}

function loadExcelData(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows.length) {
      alert('The uploaded file does not contain any rows.');
      return;
    }

    const mapped = rows.map(mapStudentRow).filter(student => student.name || student.student_id);

    if (!mapped.length) {
      alert('No recognizable student records were found in the file.');
      return;
    }

    state.students = mapped;
    populateFilters();
    applyFilters();
  };

  reader.readAsArrayBuffer(file);
}

searchInput.addEventListener('input', applyFilters);
departmentFilter.addEventListener('change', applyFilters);
yearFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);

excelFileInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    loadExcelData(file);
  } else {
    alert('Please upload a CSV or Excel file (.csv, .xlsx, .xls).');
  }
});

populateFilters();
applyFilters();
