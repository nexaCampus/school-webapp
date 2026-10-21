/**
 * Canonical tenant URL builder.
 *
 * Every tenant is addressed by its own subdomain of the deployed webapp:
 *   student -> https://<slug>.<APP_HOST>          (e.g. https://greenwood.school-webapp-self.vercel.app)
 *   admin   -> https://<slug>.admin.<APP_HOST>    (e.g. https://greenwood.admin.school-webapp-self.vercel.app)
 *
 * The legacy path form (https://<APP_HOST>/school/<slug>) is kept only as a
 * last-resort fallback for deployments without wildcard DNS.
 */

export const CANONICAL_APP_HOST = (
  process.env.NEXT_PUBLIC_CANONICAL_APP_HOST || 'school-webapp-self.vercel.app'
)
  .toLowerCase()
  .trim();

export const PRODUCTION_BASE_DOMAIN = 'nexacampus.tech';

/**
 * Parent domain for cookies that must be shared between the platform host and
 * the tenant subdomains (the signed session cookie and the tenant slug cookie).
 * A cookie set on `school-webapp-self.vercel.app` is also sent to
 * `greenwood.school-webapp-self.vercel.app`, which is what keeps a signed-in
 * visitor signed in after the canonical subdomain redirect.
 * Undefined on localhost, where the browser scopes cookies to the host.
 */
export const SHARED_COOKIE_DOMAIN: string | undefined = (() => {
  const host = CANONICAL_APP_HOST;
  if (!host || host === 'localhost' || host.endsWith('.localhost')) return undefined;
  if (!host.includes('.')) return undefined;
  return `.${host}`;
})();

export interface TenantPortalUrls {
  /** Canonical student portal — subdomain of the deployed webapp. */
  appDomain: string;
  /** Canonical admin portal — subdomain of the deployed webapp. */
  appAdminDomain: string;
  /** Production custom domain (DNS-bound). */
  customDomain: string;
  /** Production admin custom domain (DNS-bound). */
  customAdminDomain: string;
  /** Last-resort path fallback (no wildcard DNS required). */
  pathFallback: string;
  /** Last-resort admin path fallback. */
  pathFallbackAdmin: string;
}

export function tenantPortalUrls(slug: string): TenantPortalUrls {
  const clean = (slug || '').trim().toLowerCase();
  if (!clean) {
    return {
      appDomain: '/',
      appAdminDomain: '/admin',
      customDomain: '/',
      customAdminDomain: '/admin',
      pathFallback: '/',
      pathFallbackAdmin: '/admin',
    };
  }

  return {
    appDomain: `https://${clean}.${CANONICAL_APP_HOST}`,
    appAdminDomain: `https://${clean}.admin.${CANONICAL_APP_HOST}`,
    customDomain: `https://${clean}.${PRODUCTION_BASE_DOMAIN}`,
    customAdminDomain: `https://${clean}.admin.${PRODUCTION_BASE_DOMAIN}`,
    pathFallback: `https://${CANONICAL_APP_HOST}/school/${clean}`,
    pathFallbackAdmin: `https://${CANONICAL_APP_HOST}/school/${clean}/admin`,
  };
}
