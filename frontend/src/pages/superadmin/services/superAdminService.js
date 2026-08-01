import api from '../../../services/api';
import { mockDocuments, dashboardStats, chartData, categoryData, mockActivities, mockNotifications } from '../data/mockData';

export const superAdminService = {
  getDashboardStats: () => new Promise(resolve => setTimeout(() => resolve(dashboardStats), 500)),
  getChartData: () => new Promise(resolve => setTimeout(() => resolve(chartData), 500)),
  getCategoryData: () => new Promise(resolve => setTimeout(() => resolve(categoryData), 500)),
  getRecentActivities: () => new Promise(resolve => setTimeout(() => resolve(mockActivities), 500)),
  getNotifications: () => new Promise(resolve => setTimeout(() => resolve(mockNotifications), 500)),
  
  getDocuments: async (filters = {}) => {
    // Fetch only FORWARDED_TO_SUPERADMIN documents
    const response = await api.get('/documents/status/FORWARDED_TO_SUPERADMIN');
    let filtered = response.data.map(doc => ({
      id: doc.id,
      userName: "User " + doc.userId,
      type: doc.documentType,
      issuer: "N/A", // Not provided by current DTO
      priority: "Medium", // Not provided by current DTO
      status: doc.verificationStatus === 'FORWARDED_TO_SUPERADMIN' ? 'Escalated' : doc.verificationStatus,
      uploadDate: doc.uploadedAt,
      remarks: doc.remarks,
      ocrText: doc.ocrText
    }));

    if (filters.search) {
      const lower = filters.search.toLowerCase();
      filtered = filtered.filter(d => String(d.id).toLowerCase().includes(lower) || d.userName.toLowerCase().includes(lower));
    }
    return filtered;
  },

  getDocumentById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    const doc = response.data;
    return {
      id: doc.id,
      userName: "User " + doc.userId,
      userId: doc.userId,
      type: doc.documentType,
      issuer: "N/A",
      priority: "Medium",
      status: doc.verificationStatus === 'FORWARDED_TO_SUPERADMIN' ? 'Escalated' : doc.verificationStatus,
      uploadDate: doc.uploadedAt,
      remarks: doc.remarks,
      ocrText: doc.ocrText,
      confidenceScore: 90 // Mocked confidence for now
    };
  },

  updateDocumentStatus: async (id, status, remarks) => {
    const response = await api.put(`/documents/verify/${id}?status=${status}&rejectionReason=${encodeURIComponent(remarks)}`);
    return response.data;
  },
  
  // Expose download method for the viewer
  downloadDocument: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' })
};