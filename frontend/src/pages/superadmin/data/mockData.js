export const documentTypes = ['Aadhaar', 'PAN', 'Passport', 'Driving Licence', 'Birth Certificate', 'Income Certificate', 'Property Document', 'Degree Certificate', 'Bank Statement', 'Other'];
export const issuers = ['UIDAI', 'Income Tax Department', 'MEA', 'RTO', 'Municipal Corporation', 'University', 'Government Office', 'Bank'];
export const statuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Returned', 'Escalated'];

const generateMockDocuments = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `DOC-${1000 + i}`,
      userId: `USR-${2000 + i}`,
      userName: `User ${i + 1}`,
      type: documentTypes[Math.floor(Math.random() * documentTypes.length)],
      issuer: issuers[Math.floor(Math.random() * issuers.length)],
      priority: Math.random() > 0.8 ? 'High' : (Math.random() > 0.5 ? 'Medium' : 'Low'),
      uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      status: status,
      assignedAdmin: status !== 'Pending' ? `Admin ${Math.floor(Math.random() * 5) + 1}` : null,
      confidenceScore: Math.floor(Math.random() * 30) + 70, // 70-99
      remarks: status === 'Rejected' ? 'Document blur' : (status === 'Approved' ? 'Verified successfully' : '')
    };
  });
};

export const mockDocuments = generateMockDocuments(120);

export const mockActivities = [
  { id: 1, action: 'Approved Document', user: 'Admin 1', target: 'DOC-1023', time: '10 mins ago' },
  { id: 2, action: 'Rejected Document', user: 'Admin 2', target: 'DOC-1045', time: '30 mins ago' },
  { id: 3, action: 'Assigned Document', user: 'System', target: 'DOC-1088', time: '1 hour ago' },
];

export const mockNotifications = [
  { id: 1, type: 'New Document', message: 'New Aadhaar uploaded by USR-2041', time: '5 mins ago', read: false },
  { id: 2, type: 'Approval Completed', message: 'Admin 1 approved DOC-1023', time: '10 mins ago', read: false },
  { id: 3, type: 'AI Detection Alert', message: 'Low confidence score on DOC-1099', time: '1 hour ago', read: true },
];

export const dashboardStats = {
  pendingDocuments: 45,
  approvedToday: 128,
  rejectedToday: 12,
  pendingReviews: 32,
  totalUsers: 15420,
  approvalRate: 92,
  avgReviewTime: '45m'
};

export const chartData = [
  { name: 'Mon', approved: 400, rejected: 24 },
  { name: 'Tue', approved: 300, rejected: 13 },
  { name: 'Wed', approved: 200, rejected: 98 },
  { name: 'Thu', approved: 278, rejected: 39 },
  { name: 'Fri', approved: 189, rejected: 48 },
  { name: 'Sat', approved: 239, rejected: 38 },
  { name: 'Sun', approved: 349, rejected: 43 },
];

export const categoryData = [
  { name: 'Aadhaar', value: 400 },
  { name: 'PAN', value: 300 },
  { name: 'Passport', value: 300 },
  { name: 'Degree', value: 200 },
];