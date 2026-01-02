import { supabase } from '../config/supabase';

/**
 * Admin Authentication Service
 * Handles admin login, logout, and session management
 */

export const adminService = {
  /**
   * Login admin with email and password
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async login(email, password) {
    try {
      // First, get the admin by email
      const { data: admin, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError || !admin) {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Verify password using bcrypt (we'll handle this on backend)
      // For now, we'll use a backend endpoint to verify password
      const response = await fetch('http://localhost:5000/api/admin/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          password_hash: admin.password_hash,
        }),
      });

      if (!response.ok) {
        console.error('Backend response error:', response.status, response.statusText);
        return { success: false, error: 'Erreur de connexion au serveur' };
      }

      const result = await response.json();
      console.log('Password verification result:', result);

      if (!result.success) {
        return { success: false, error: result.error || 'Email ou mot de passe incorrect' };
      }

      // Store admin session in sessionStorage
      const adminData = {
        id: admin.id,
        email: admin.email,
        name: admin.name || '',
        phone: admin.phone || '',
        address: admin.address || '',
        created_at: admin.created_at,
      };

      sessionStorage.setItem('admin', JSON.stringify(adminData));
      sessionStorage.setItem('admin_token', admin.id); // Simple token for now

      return { success: true, data: adminData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur de connexion. Veuillez réessayer.' };
    }
  },

  /**
   * Get current admin session
   * @returns {object|null}
   */
  getCurrentAdmin() {
    try {
      const adminData = sessionStorage.getItem('admin');
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      console.error('Error getting admin session:', error);
      return null;
    }
  },

  /**
   * Check if admin is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!sessionStorage.getItem('admin_token');
  },

  /**
   * Logout admin
   */
  logout() {
    sessionStorage.removeItem('admin');
    sessionStorage.removeItem('admin_token');
  },

  /**
   * Get admin profile
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getProfile() {
    try {
      const admin = this.getCurrentAdmin();
      if (!admin) {
        return { success: false, error: 'Non authentifié' };
      }

      const { data, error } = await supabase
        .from('admins')
        .select('id, email, name, phone, address, created_at')
        .eq('id', admin.id)
        .single();

      if (error) {
        return { success: false, error: 'Erreur lors de la récupération du profil' };
      }

      // Update sessionStorage
      sessionStorage.setItem('admin', JSON.stringify(data));

      return { success: true, data };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Erreur lors de la récupération du profil' };
    }
  },

  /**
   * Update admin profile
   * @param {object} profileData - Profile data (name, email, phone, address)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async updateProfile(profileData) {
    try {
      const admin = this.getCurrentAdmin();
      if (!admin) {
        return { success: false, error: 'Non authentifié' };
      }

      // Update via backend to handle password hashing if password is being updated
      const response = await fetch(`http://localhost:5000/api/admin/profile/${admin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Erreur lors de la mise à jour du profil' };
      }

      // Update sessionStorage
      sessionStorage.setItem('admin', JSON.stringify(result.data));

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    }
  },
};

