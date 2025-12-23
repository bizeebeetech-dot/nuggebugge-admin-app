/**
 * Converts a string to a URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Creates a URL-friendly slug from activity title
 */
export function createActivitySlug(title: string): string {
  return createSlug(title);
}

/**
 * Creates a URL-friendly identifier from student app_code
 */
export function createStudentSlug(appCode: string): string {
  return appCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

