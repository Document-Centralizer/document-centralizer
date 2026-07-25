import { mockDocuments, dashboardStats, chartData, categoryData, mockActivities, mockNotifications } from '../data/mockData';

export const superAdminService = {
  getDashboardStats: () => new Promise(resolve => setTimeout(() => resolve(dashboardStats), 500)),
  getChartData: () => new Promise(resolve => setTimeout(() => resolve(chartData), 500)),
  getCategoryData: () => new Promise(resolve => setTimeout(() => resolve(categoryData), 500)),
  getRecentActivities: () => new Promise(resolve => setTimeout(() => resolve(mockActivities), 500)),
  getNotifications: () => new Promise(resolve => setTimeout(() => resolve(mockNotifications), 500)),
  
  getDocuments: (filters = {}) => new Promise(resolve => {
    setTimeout(() => {
      let filtered = [...mockDocuments];
      if (filters.status) filtered = filtered.filter(d => d.status === filters.status);
      if (filters.search) {
         const lower = filters.search.toLowerCase();
         filtered = filtered.filter(d => d.id.toLowerCase().includes(lower) || d.userName.toLowerCase().includes(lower));
      }
      resolve(filtered);
    }, 800);
  }),

  getDocumentById: (id) => new Promise((resolve, reject) => {
    setTimeout(() => {
      const doc = mockDocuments.find(d => d.id === id);
      if (doc) resolve(doc);
      else reject(new Error('Document not found'));
    }, 500);
  }),

  updateDocumentStatus: (id, status, remarks) => new Promise(resolve => {
    setTimeout(() => {
      const docIndex = mockDocuments.findIndex(d => d.id === id);
      if (docIndex > -1) {
        mockDocuments[docIndex] = { ...mockDocuments[docIndex], status, remarks };
      }
      resolve({ success: true, message: `Document status updated to ${status}` });
    }, 600);
  })
};