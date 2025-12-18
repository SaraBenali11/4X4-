import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const existingAdmin = adminService.getCurrentAdmin();
    if (existingAdmin && adminService.isAuthenticated()) {
      setAdmin(existingAdmin);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await adminService.login(email, password);
    if (result.success) {
      setAdmin(result.data);
      return { success: true };
    }
    return result;
  };

  const logout = () => {
    adminService.logout();
    setAdmin(null);
  };

  const updateProfile = async (profileData) => {
    const result = await adminService.updateProfile(profileData);
    if (result.success) {
      setAdmin(result.data);
      return { success: true };
    }
    return result;
  };

  const refreshProfile = async () => {
    const result = await adminService.getProfile();
    if (result.success) {
      setAdmin(result.data);
      return { success: true };
    }
    return result;
  };

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    login,
    logout,
    updateProfile,
    refreshProfile,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
