#!/usr/bin/env node

/**
 * Hostinger Developer API Automation Tool
 * 
 * Automatically configures Authoritative Nameservers and DNS records on Hostinger
 * for nexacampus.school and Vercel infrastructure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Attempt to read token from environment or .env.local
let token = process.env.HOSTINGER_API_TOKEN?.trim();

if (!token) {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    const match = raw.match(/HOSTINGER_API_TOKEN=([^\r\n]+)/);
    if (match && match[1]?.trim()) {
      token = match[1].trim();
    }
  }
}

// Parse CLI flags: --token=xyz, --domain=xyz
const args = process.argv.slice(2);
const command = args[0] || 'help';

for (const arg of args) {
  if (arg.startsWith('--token=')) {
    token = arg.slice(8).trim();
  }
}

const targetDomain = 'nexacampus.school';
const BASE_URL = 'https://developers.hostinger.com';

async function hostingerRequest(endpoint, method = 'GET', body = null) {
  if (!token) {
    throw new Error(
      'Missing Hostinger API token! Provide via HOSTINGER_API_TOKEN in .env.local or --token=<TOKEN>'
    );
  }

  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || text || `HTTP ${res.status}`;
    throw new Error(`Hostinger API error (${res.status}): ${msg}`);
  }

  return json;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         NexaCampus Hostinger Domain & DNS Manager            ');
  console.log('═══════════════════════════════════════════════════════════════');

  switch (command) {
    case 'set-nameservers': {
      console.log(`\n[Action] Updating Nameservers for ${targetDomain} to Vercel DNS...`);
      console.log('Target Nameservers:');
      console.log('  • ns1.vercel-dns.com');
      console.log('  • ns2.vercel-dns.com\n');

      const payload = {
        ns1: 'ns1.vercel-dns.com',
        ns2: 'ns2.vercel-dns.com',
      };

      const result = await hostingerRequest(
        `/api/domains/v1/portfolio/${targetDomain}/nameservers`,
        'PUT',
        payload
      );

      console.log('✅ Successfully updated nameservers on Hostinger!');
      console.log('Response:', JSON.stringify(result, null, 2));
      console.log('\n[Notice] DNS propagation typically completes within 10 to 60 minutes.');
      console.log('Once propagated, Vercel will automatically verify all wildcard and custom subdomains:');
      console.log(`  • https://*.${targetDomain}`);
      console.log(`  • https://*.admin.${targetDomain}`);
      console.log(`  • https://lcgvm.${targetDomain}`);
      console.log(`  • https://lcgvm.admin.${targetDomain}`);
      break;
    }

    case 'list-domains': {
      console.log('\n[Action] Fetching Domain Portfolio from Hostinger...');
      const list = await hostingerRequest('/api/domains/v1/portfolio');
      console.log('Portfolio:', JSON.stringify(list, null, 2));
      break;
    }

    case 'get-domain': {
      console.log(`\n[Action] Fetching details for ${targetDomain}...`);
      const details = await hostingerRequest(`/api/domains/v1/portfolio/${targetDomain}`);
      console.log('Domain Details:', JSON.stringify(details, null, 2));
      break;
    }

    case 'get-dns-zone': {
      console.log(`\n[Action] Fetching DNS Zone records for ${targetDomain}...`);
      const zone = await hostingerRequest(`/api/dns/v1/zones/${targetDomain}`);
      console.log('DNS Zone:', JSON.stringify(zone, null, 2));
      break;
    }

    default:
      console.log(`
Usage:
  node scripts/hostinger-cli.mjs <command> [--token=<HOSTINGER_API_TOKEN>]

Available Commands:
  set-nameservers    Set authoritative nameservers to Vercel (ns1.vercel-dns.com, ns2.vercel-dns.com)
  list-domains       List all domains in your Hostinger account
  get-domain         Get status and details for nexacampus.school
  get-dns-zone       Inspect existing DNS records in Hostinger zone
      `);
      break;
  }
}

main().catch((err) => {
  console.error('\n❌ Execution Error:', err.message);
  process.exit(1);
});
