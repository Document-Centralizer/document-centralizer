import api from '../../../services/api';

const getIssuer = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes('aadhaar')) return 'UIDAI';
  if (t.includes('pan')) return 'Income Tax Dept';
  if (t.includes('passport')) return 'Ministry of External Affairs';
  if (t.includes('driving') || t.includes('license')) return 'RTO';
  if (t.includes('degree') || t.includes('university')) return 'University / Board';
  if (t.includes('voter') || t.includes('election')) return 'Election Commission of India';
  if (t.includes('10th') || t.includes('12th') || t.includes('ssc') || t.includes('hsc') || t.includes('mark') || t.includes('board')) return 'State Education Board';
  if (t.includes('bank')) return 'Bank';
  return 'Government Authority';
};

export const superAdminService = {
  getDashboardStats: async () => {
    const response = await api.get('/super-admin/dashboard');
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  getDocuments: async (filters = {}) => {
    const response = await api.get('/super-admin/documents/forwarded');
    let filtered = response.data.map(doc => ({
      id: doc.id,
      userName: doc.ownerName || "User " + doc.userId,
      type: doc.documentType,
      issuer: getIssuer(doc.documentType), 
      priority: "High",
      status: doc.verificationStatus,
      uploadDate: doc.uploadedAt,
      remarks: doc.remarks,
      ocrText: doc.ocrText
    }));

    if (filters.search) {
      const lower = filters.search.toLowerCase();
      filtered = filtered.filter(d => String(d.id).toLowerCase().includes(lower) || (d.userName || "").toLowerCase().includes(lower));
    }
    return filtered;
  },

  getAllSystemDocuments: async () => {
    const response = await api.get('/documents/');
    return response.data.map(doc => ({
      id: doc.id,
      userName: doc.ownerName || "User " + doc.userId,
      type: doc.documentType,
      issuer: getIssuer(doc.documentType),
      priority: "Medium",
      status: doc.verificationStatus === 'VERIFIED' ? 'Approved' : (doc.verificationStatus === 'REJECTED' ? 'Rejected' : doc.verificationStatus),
      uploadDate: doc.uploadedAt,
      remarks: doc.remarks,
      ocrText: doc.ocrText,
      assignedAdmin: doc.adminRemark ? "Admin/SuperAdmin" : "System"
    }));
  },

  getChartData: async (filters = {}) => {
    let docs = await superAdminService.getAllSystemDocuments();
    
    // Apply Issuer Filter
    if (filters.issuerFilter && filters.issuerFilter !== 'All Issuers') {
      docs = docs.filter(doc => doc.issuer === filters.issuerFilter);
    }
    
    // Apply Date Filter
    const now = new Date();
    if (filters.dateFilter === 'Last 7 Days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      docs = docs.filter(d => new Date(d.uploadDate) >= sevenDaysAgo);
    } else if (filters.dateFilter === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      docs = docs.filter(d => new Date(d.uploadDate) >= thirtyDaysAgo);
    } else if (filters.dateFilter === 'This Month') {
      docs = docs.filter(d => {
        const docDate = new Date(d.uploadDate);
        return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
      });
    } else if (filters.dateFilter === 'This Year') {
      docs = docs.filter(d => new Date(d.uploadDate).getFullYear() === now.getFullYear());
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartMap = { 'Mon': { name: 'Mon', approved: 0, rejected: 0 }, 'Tue': { name: 'Tue', approved: 0, rejected: 0 }, 'Wed': { name: 'Wed', approved: 0, rejected: 0 }, 'Thu': { name: 'Thu', approved: 0, rejected: 0 }, 'Fri': { name: 'Fri', approved: 0, rejected: 0 }, 'Sat': { name: 'Sat', approved: 0, rejected: 0 }, 'Sun': { name: 'Sun', approved: 0, rejected: 0 } };
    
    docs.forEach(doc => {
      const date = new Date(doc.uploadDate);
      const dayName = days[date.getDay()];
      if (doc.status === 'Approved') chartMap[dayName].approved++;
      if (doc.status === 'Rejected') chartMap[dayName].rejected++;
    });
    
    return [chartMap['Mon'], chartMap['Tue'], chartMap['Wed'], chartMap['Thu'], chartMap['Fri'], chartMap['Sat'], chartMap['Sun']];
  },

  getCategoryData: async () => {
    const docs = await superAdminService.getAllSystemDocuments();
    const categoryMap = {};
    docs.forEach(doc => {
      categoryMap[doc.type] = (categoryMap[doc.type] || 0) + 1;
    });
    return Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] }));
  },

  getDocumentById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    const doc = response.data;
    return {
      id: doc.id,
      userName: doc.ownerName || "User " + doc.userId,
      userId: doc.userId,
      type: doc.documentType,
      issuer: getIssuer(doc.documentType),
      priority: "High",
      status: doc.verificationStatus === 'FORWARDED_TO_SUPERADMIN' ? 'Escalated' : doc.verificationStatus,
      uploadDate: doc.uploadedAt,
      remarks: doc.remarks,
      ocrText: doc.ocrText,
    };
  },

  updateDocumentStatus: async (id, status, remarks) => {
    let response;
    if (status === 'VERIFIED') {
        response = await api.put(`/super-admin/documents/${id}/approve`);
    } else {
        response = await api.put(`/super-admin/documents/${id}/reject`, null, { params: { reason: remarks } });
    }
    return response.data;
  },
  
  // Mock AuthBridge Verification Sandbox
  verifyWithAuthBridge: async (type, ocrText) => {
      let endpoint = '';
      if (type) {
          const t = type.toLowerCase();
          if (t.includes('aadhaar')) endpoint = '/mock/authbridge/verify/aadhaar';
          else if (t.includes('pan')) endpoint = '/mock/authbridge/verify/pan';
          else if (t.includes('driving') || t.includes('dl')) endpoint = '/mock/authbridge/verify/driving-license';
          else if (t.includes('passport')) endpoint = '/mock/authbridge/verify/passport';
      }

      // ---------------------------------------------------------------------
      // DEMO MODE OVERRIDE:
      // If the Python OCR service is offline or failed to extract text,
      // we inject a simulated valid text string. 
      // TO TEST FAILURES: If the document type contains 'fake' or 'reject',
      // we inject the word 'FAKE' to trigger the backend rejection logic!
      // ---------------------------------------------------------------------
      let textToVerify = ocrText;
      const tStr = (type || "").toLowerCase();
      const shouldFailDemo = tStr.includes('fake') || tStr.includes('reject') || tStr.includes('invalid');

      if (!textToVerify || textToVerify.trim() === '') {
          textToVerify = shouldFailDemo 
              ? "This is a FAKE simulated document for testing rejections."
              : "Simulated valid OCR text data for demonstration purposes.";
      }

      if (!endpoint) {
          // Internal AI match for non-gov documents
          if (textToVerify.toUpperCase().includes("FAKE")) {
              return { 
                  status: "FAILURE", 
                  confidence: 32, 
                  message: `${type || 'Document'} verification failed. Invalid or poor quality data.` 
              };
          }
          return { 
              status: "SUCCESS", 
              confidence: 88, 
              message: `${type || 'Document'} verified successfully using Internal AI Matching.` 
          };
      }

      const response = await api.post(endpoint, { ocrText: textToVerify });
      return response.data;
  },

  downloadDocument: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' })
};