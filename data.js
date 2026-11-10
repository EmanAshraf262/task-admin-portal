// ============================================================
// Mock data for the Analytical Administration Portal
// In a real app this would come from a backend API.
// ============================================================

const MOCK_DATA = {
  revenueByMonth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    values: [42000, 48500, 45200, 51000, 58300, 61200, 59800, 64500],
  },

  regionSales: {
    labels: ['North America', 'Europe', 'APAC', 'Middle East', 'LATAM'],
    values: [128000, 96500, 87200, 41300, 33800],
  },

  departmentDistribution: {
    labels: ['Engineering', 'Sales', 'Marketing', 'Support', 'Operations'],
    values: [42, 28, 15, 22, 11],
  },

  employees: [
    { id: 1, name: 'Ayesha Khan', department: 'Engineering', role: 'Frontend Developer', region: 'APAC', status: 'Active', revenue: 0, joined: '2023-02-14' },
    { id: 2, name: 'Bilal Ahmed', department: 'Sales', role: 'Account Executive', region: 'Middle East', status: 'Active', revenue: 18400, joined: '2022-11-01' },
    { id: 3, name: 'Sara Malik', department: 'Marketing', role: 'Content Strategist', region: 'Europe', status: 'Active', revenue: 0, joined: '2024-01-09' },
    { id: 4, name: 'Hassan Raza', department: 'Engineering', role: 'Backend Developer', region: 'APAC', status: 'On Leave', revenue: 0, joined: '2021-07-22' },
    { id: 5, name: 'Fatima Noor', department: 'Support', role: 'Support Lead', region: 'North America', status: 'Active', revenue: 0, joined: '2020-05-18' },
    { id: 6, name: 'Usman Tariq', department: 'Sales', role: 'Sales Manager', region: 'North America', status: 'Active', revenue: 42200, joined: '2019-09-30' },
    { id: 7, name: 'Zara Sheikh', department: 'Operations', role: 'Operations Analyst', region: 'Europe', status: 'Active', revenue: 0, joined: '2023-06-12' },
    { id: 8, name: 'Ali Haider', department: 'Engineering', role: 'DevOps Engineer', region: 'LATAM', status: 'Active', revenue: 0, joined: '2022-03-04' },
    { id: 9, name: 'Mahnoor Iqbal', department: 'Marketing', role: 'Growth Marketer', region: 'North America', status: 'Terminated', revenue: 0, joined: '2021-01-15' },
    { id: 10, name: 'Omar Farooq', department: 'Sales', role: 'Account Executive', region: 'Europe', status: 'Active', revenue: 27600, joined: '2023-10-02' },
    { id: 11, name: 'Hira Yousaf', department: 'Support', role: 'Support Specialist', region: 'APAC', status: 'Active', revenue: 0, joined: '2024-04-20' },
    { id: 12, name: 'Danish Aslam', department: 'Engineering', role: 'Engineering Manager', region: 'North America', status: 'Active', revenue: 0, joined: '2018-12-01' },
    { id: 13, name: 'Rabia Chaudhry', department: 'Operations', role: 'Operations Manager', region: 'Middle East', status: 'Active', revenue: 0, joined: '2020-08-09' },
    { id: 14, name: 'Kamran Sheikh', department: 'Sales', role: 'Account Executive', region: 'LATAM', status: 'On Leave', revenue: 15900, joined: '2022-05-27' },
    { id: 15, name: 'Nida Aziz', department: 'Marketing', role: 'Marketing Manager', region: 'Europe', status: 'Active', revenue: 0, joined: '2021-11-19' },
  ],
};
