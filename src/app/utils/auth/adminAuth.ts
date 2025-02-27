import Cookies from 'js-cookie';
import { authenticateAdmin as apiAuthenticateAdmin, logoutAdmin as apiLogoutAdmin } from '../fetch/fetchTournament';

// Constants
const ADMIN_COOKIE_NAME = 'optic_tournament_admin';
const ADMIN_TOKEN_VALUE = 'optic-admin-token'; // In a real app, this would be a secure JWT

/**
 * Check if the user is authenticated as an admin
 * @returns boolean indicating if the user is authenticated
 */
export function isAdminAuthenticated(): boolean {
  // Check for the admin cookie
  const adminToken = Cookies.get(ADMIN_COOKIE_NAME);
  
  // In a real app, you would validate the token with your backend
  return adminToken === ADMIN_TOKEN_VALUE;
}

/**
 * Authenticate the user as an admin
 * @param password The admin password
 * @returns Promise<boolean> indicating if authentication was successful
 */
export async function authenticateAdmin(password: string): Promise<boolean> {
  try {
    // Call the API to authenticate
    const result = await apiAuthenticateAdmin(password);
    
    if (result.success) {
      // Set the admin cookie with a 24-hour expiration
      Cookies.set(ADMIN_COOKIE_NAME, ADMIN_TOKEN_VALUE, { expires: 1 });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
}

/**
 * Log out the admin user
 */
export async function logoutAdmin(): Promise<void> {
  try {
    // Call the API to logout
    await apiLogoutAdmin();
    // Remove the local cookie
    Cookies.remove(ADMIN_COOKIE_NAME);
  } catch (error) {
    console.error("Logout error:", error);
    // Still remove the cookie even if API call fails
    Cookies.remove(ADMIN_COOKIE_NAME);
  }
} 