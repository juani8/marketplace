// src/services/tenantService.js
import api from '@apis/api_config';

export const checkBackendStatus = async () => {
  try {
    const response = await api.get('/status');
    return response.data;
  } catch (error) {
    console.error('Error checking backend status:', error);
    throw error;
  }
};