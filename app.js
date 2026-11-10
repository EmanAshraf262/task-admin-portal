// ============================================================
// Analytical Administration Portal — Task 4
// Hash-based router across 3 views, Chart.js visualizations,
// a searchable/sortable/filterable records table, and a
// persisted dark-mode toggle.
// ============================================================

const viewRoot = document.getElementById('viewRoot');
const viewTitle = document.getElementById('viewTitle');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const themeToggle = document.getElementById('themeToggle');
const themeToggleLabel = document.getElementById('themeToggleLabel');

let activeCharts = []; // track Chart.js instances so we can destroy them on route change

// Table state (persists while navigating away and back, resets on reload)
const tableState = {
  query: '',
  department: 'all',
  sortKey: 'name',
  sortDir: 'asc',
};

// ------------------------------------------------------------
// Theme handling
// ------------------------------------------------------------
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  themeToggleLabel.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  localStorage.setItem('adminPortal.theme', theme);
  // Redraw charts so Chart.js picks up new grid/text colors
  if (window.location.hash.includes('dashboard') || window.location.hash === '') {
    renderDashboard();
  }
}

function initTheme() {
  const saved = localStorage.getItem('adminPortal.theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
}

themeToggle.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ------------------------------------------------------------
// Router
// ------------------------------------------------------------
const ROUTES = {
  dashboard: { title: 'Dashboard', render: renderDashboard },
  records: { title: 'Employee Records', render: renderRecords },
  settings: { title: 'Settings', render: renderSettings },
};

function currentRoute() {
  const hash = window.location.hash.replace('#/', '').split('?')[0];
  return ROUTES[hash] ? hash : 'dashboard';
}

function destroyCharts() {
  activeCharts.forEach((c) => c.destroy());
  activeCharts = [];
}

function router() {
  const route = currentRoute();
  destroyCharts();

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.route === route);
  });

  viewTitle.textContent = ROUTES[route].title;
  ROUTES[route].render();
}

window.addEventListener('hashchange', router);

// ------------------------------------------------------------
// Chart color helper (reads current CSS variables so charts
// stay legible in both light and dark mode)
// ------------------------------------------------------------
function cssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function chartDefaultsColors() {
  return {
    ink: cssVar('--ink'),
    inkSoft: cssVar('--ink-soft'),
    line: cssVar('--line'),
    accent: cssVar('--accent'),
  };
}

// ------------------------------------------------------------
// Dashboard view
// ------------------------------------------------------------
function renderDashboard() {
  const totalRevenue = MOCK_DATA.revenueByMonth.values.reduce((a, b) => a + b, 0);
  const totalEmployees = MOCK_DATA.employees.length;
  const activeEmployees = MOCK_DATA.employees.filter((e) => e.status === 'Active').length;
  const totalSalesRevenue = MOCK_DATA.employees.reduce((sum, e) => sum + (e.revenue || 0), 0);

  viewRoot.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Total revenue (YTD)</div>
        <div class="stat-value">$${totalRevenue.toLocaleString()}</div>
        <div class="stat-delta up">▲ 8.2% vs last period</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Employees</div>
        <div class="stat-value">${totalEmployees}</div>
        <div class="stat-delta up">${activeEmployees} active</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Sales revenue</div>
        <div class="stat-value">$${totalSalesRevenue.toLocaleString()}</div>
        <div class="stat-delta up">▲ 4.6% vs last period</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Top region</div>
        <div class="stat-value">North America</div>
        <div class="stat-delta down">▼ 1.1% share</div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-card">
        <h2>Revenue by month</h2>
        <canvas id="revenueChart"></canvas>
      </div>
      <div class="chart-card">
        <h2>Team by department</h2>
        <canvas id="deptChart"></canvas>
      </div>
      <div class="chart-card span-full">
        <h2>Sales by region</h2>
        <canvas id="regionChart"></canvas>
      </div>
    </div>
  `;

  const colors = chartDefaultsColors();
  Chart.defaults.color = colors.inkSoft;
  Chart.defaults.borderColor = colors.line;
  Chart.defaults.font.family = "'Inter', sans-serif";

  const revenueChart = new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
      labels: MOCK_DATA.revenueByMonth.labels,
      datasets: [{
        label: 'Revenue ($)',
        data: MOCK_DATA.revenueByMonth.values,
        borderColor: colors.accent,
        backgroundColor: colors.accent + '33',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: false, ticks: { callback: (v) => '$' + v / 1000 + 'k' } },
      },
    },
  });

  const deptChart = new Chart(document.getElementById('deptChart'), {
    type: 'doughnut',
    data: {
      labels: MOCK_DATA.departmentDistribution.labels,
      datasets: [{
        data: MOCK_DATA.departmentDistribution.values,
        backgroundColor: ['#3D5AFE', '#7C93FF', '#A7B6FF', '#1E9E6B', '#C77B15'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12 } } },
    },
  });

  const regionChart = new Chart(document.getElementById('regionChart'), {
    type: 'bar',
    data: {
      labels: MOCK_DATA.regionSales.labels,
      datasets: [{
        label: 'Sales ($)',
        data: MOCK_DATA.regionSales.values,
        backgroundColor: colors.accent,
        borderRadius: 6,
        maxBarThickness: 48,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: (v) => '$' + v / 1000 + 'k' } },
      },
    },
  });

  activeCharts = [revenueChart, deptChart, regionChart];
}

// ------------------------------------------------------------
// Records view — search, department filter, multi-column sort
// ------------------------------------------------------------
function getFilteredSortedEmployees() {
  const q = tableState.query.trim().toLowerCase();

  let rows = MOCK_DATA.employees.filter((emp) => {
    const matchesQuery =
      !q ||
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.region.toLowerCase().includes(q);
    const matchesDept = tableState.department === 'all' || emp.department === tableState.department;
    return matchesQuery && matchesDept;
  });

  rows.sort((a, b) => {
    const key = tableState.sortKey;
    let av = a[key];
    let bv = b[key];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return tableState.sortDir === 'asc' ? -1 : 1;
    if (av > bv) return tableState.sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return rows;
}

function statusBadgeClass(status) {
  if (status === 'Active') return 'status-active';
  if (status === 'On Leave') return 'status-on-leave';
  return 'status-terminated';
}

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role' },
  { key: 'region', label: 'Region' },
  { key: 'status', label: 'Status' },
  { key: 'joined', label: 'Joined' },
];

function renderRecords() {
  const departments = ['all', ...new Set(MOCK_DATA.employees.map((e) => e.department))];

  viewRoot.innerHTML = `
    <div class="records-toolbar">
      <input type="search" id="searchInput" placeholder="Search name, role, or region…" value="${tableState.query}" />
      <select id="deptFilter">
        ${departments
          .map((d) => `<option value="${d}" ${d === tableState.department ? 'selected' : ''}>${d === 'all' ? 'All departments' : d}</option>`)
          .join('')}
      </select>
    </div>
    <div id="resultCount" class="result-count"></div>
    <div class="table-wrap">
      <table class="records-table">
        <thead>
          <tr>
            ${COLUMNS.map(
              (col) => `
              <th data-key="${col.key}" class="${tableState.sortKey === col.key ? 'sorted' : ''}">
                ${col.label}
                <span class="sort-arrow">${
                  tableState.sortKey === col.key ? (tableState.sortDir === 'asc' ? '▲' : '▼') : '⇅'
                }</span>
              </th>`
            ).join('')}
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>
  `;

  document.getElementById('searchInput').addEventListener('input', (e) => {
    tableState.query = e.target.value;
    renderTableBody();
  });

  document.getElementById('deptFilter').addEventListener('change', (e) => {
    tableState.department = e.target.value;
    renderTableBody();
  });

  document.querySelectorAll('.records-table th').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (tableState.sortKey === key) {
        tableState.sortDir = tableState.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        tableState.sortKey = key;
        tableState.sortDir = 'asc';
      }
      renderRecords(); // re-render header arrows + body
    });
  });

  renderTableBody();
}

function renderTableBody() {
  const rows = getFilteredSortedEmployees();
  const tbody = document.getElementById('tableBody');
  const resultCount = document.getElementById('resultCount');
  if (!tbody) return;

  resultCount.textContent = `${rows.length} of ${MOCK_DATA.employees.length} employees`;

  if (rows.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${COLUMNS.length}">No employees match your search.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map(
      (emp) => `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.department}</td>
        <td>${emp.role}</td>
        <td>${emp.region}</td>
        <td><span class="badge ${statusBadgeClass(emp.status)}">${emp.status}</span></td>
        <td>${new Date(emp.joined).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
      </tr>`
    )
    .join('');
}

// ------------------------------------------------------------
// Settings view
// ------------------------------------------------------------
function renderSettings() {
  const isDark = document.body.getAttribute('data-theme') === 'dark';

  viewRoot.innerHTML = `
    <div class="settings-card">
      <div class="settings-row">
        <div>
          <div class="settings-label">Dark mode</div>
          <div class="settings-desc">Switch the whole portal to a low-light theme.</div>
        </div>
        <label class="switch">
          <input type="checkbox" id="darkModeSwitch" ${isDark ? 'checked' : ''} />
          <span class="switch-track"></span>
        </label>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Data source</div>
          <div class="settings-desc">Mock JSON (bundled locally)</div>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Employees tracked</div>
          <div class="settings-desc">${MOCK_DATA.employees.length} records</div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('darkModeSwitch').addEventListener('change', (e) => {
    applyTheme(e.target.checked ? 'dark' : 'light');
  });
}

// ------------------------------------------------------------
// Init
// ------------------------------------------------------------
initTheme();
if (!window.location.hash) window.location.hash = '#/dashboard';
router();
