import { config } from '../config/env';

/**
 * Normalizes image URLs to ensure they work correctly in both development and production
 * - If URL is already absolute (starts with http:// or https://), returns as-is
 * - If URL is relative (starts with /), prepends the API base URL
 * - Handles cases where the URL might be from the backend response
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // If already absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If relative URL (starts with /), prepend API base URL
  if (url.startsWith('/')) {
    // Remove /api from base URL if present, since /uploads is served directly
    const baseUrl = config.apiBaseUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }

  // If it's just a filename, construct the full path
  const baseUrl = config.apiBaseUrl.replace('/api', '');
  return `${baseUrl}/uploads/${url}`;
}


