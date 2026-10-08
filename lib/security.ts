// NexaCampus Security Defense Module
// Implements 20-Point Security Hardening (XSS, SSRF, CSRF, File Upload, Input Sanitization)

/**
 * Whitelisted file extensions for student & campus uploads
 */
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
export const MAX_UPLOAD_FILE_BYTES = 10 * 1024 * 1024; // 10 MB maximum payload

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file size and extension before any upload occurs
 */
export function validateUploadFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size > MAX_UPLOAD_FILE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  const name = file.name.toLowerCase();
  const hasAllowedExt = ALLOWED_FILE_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!hasAllowedExt) {
    return {
      valid: false,
      error: `Unsupported file type. Allowed formats: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validates external URLs to prevent Server-Side Request Forgery (SSRF)
 * Rejects localhost, private IP subnets, cloud metadata IPs, and non-HTTPS schemes.
 */
export function validateSafeHttpsUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;

  try {
    const parsed = new URL(urlString);

    // 1. Must use HTTPS protocol (never file://, gopher://, http://, or ftp://)
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const host = parsed.hostname.toLowerCase();

    // 2. Reject localhost & loopback
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.endsWith('.localhost') ||
      host.endsWith('.local')
    ) {
      return false;
    }

    // 3. Reject cloud metadata address (AWS / GCP / Azure: 169.254.169.254)
    if (host === '169.254.169.254' || host.startsWith('169.254.')) {
      return false;
    }

    // 4. Reject private IP ranges (RFC 1918)
    // 10.0.0.0/8
    if (host.startsWith('10.')) return false;
    // 192.168.0.0/16
    if (host.startsWith('192.168.')) return false;
    // 172.16.0.0/12 (172.16.x.x - 172.31.x.x)
    const match172 = host.match(/^172\.(\d+)\./);
    if (match172) {
      const octet = parseInt(match172[1], 10);
      if (octet >= 16 && octet <= 31) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Validates YYYY-MM-DD date format with strict calendar boundary checks
 */
export function validateDateFormatYYYYMMDD(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const [y, m, d] = dateStr.split('-').map((v) => parseInt(v, 10));
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1920 || y > 2100) return false;

  const dateObj = new Date(y, m - 1, d);
  return (
    dateObj.getFullYear() === y &&
    dateObj.getMonth() === m - 1 &&
    dateObj.getDate() === d
  );
}

/**
 * Sanitizes user-entered string by escaping HTML characters to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Standard debounce utility to prevent rapid-firing and rate-limit violations
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  waitMs = 350
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, waitMs);
  };
}

/**
 * Generates standard CSRF defense headers for JSON requests
 */
export function getCsrfHeaders(): Record<string, string> {
  return {
    'X-Requested-With': 'XMLHttpRequest',
  };
}
