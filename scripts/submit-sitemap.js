#!/usr/bin/env node
/**
 * Sitemap Submitter - Submit sitemap to Google and Bing search engines
 * Usage: node scripts/submit-sitemap.js
 */

const SITEMAP_URL = 'https://indietools.ai/sitemap.xml';

const platforms = [
  {
    name: 'Google Search Console',
    url: `https://search.google.com/search-console/performance/crawl-errors?resource=${SITEMAP_URL}`,
    submitUrl: `https://www.google.com/ping?sitemap=${SITEMAP_URL}`,
    description: 'Via Google Search Console API or manual submission',
  },
  {
    name: 'Bing Webmaster',
    url: 'https://www.bing.com/webmasters',
    submitUrl: `https://www.bing.com/ping?sitemap=${SITEMAP_URL}`,
    description: 'Bing supports GET-based sitemap submission',
  },
];

async function submitToBing() {
  try {
    const response = await fetch(`https://www.bing.com/ping?sitemap=${SITEMAP_URL}`);
    if (response.ok || response.status === 200) {
      console.log('✅ Bing sitemap submission: OK');
      return true;
    }
    console.log(`⚠️ Bing responded with ${response.status}`);
    return false;
  } catch (err) {
    console.error('❌ Bing submission failed:', err.message);
    return false;
  }
}

async function submitToGoogle() {
  // Google's sitemap submission endpoint requires authentication
  // The recommended approach is to use Google Search Console API
  // For now, we'll just log the instructions
  console.log('📋 Google Search Console:');
  console.log('   1. Go to https://search.google.com/search-console');
  console.log('   2. Add your property (indietools.ai)');
  console.log('   3. Go to Sitemaps section');
  console.log('   4. Submit your sitemap URL:', SITEMAP_URL);
  console.log('   Or use the API directly with OAuth credentials.');
  return false;
}

async function main() {
  console.log('🔍 Sitemap Submission Tool');
  console.log('========================\n');
  console.log(`Sitemap: ${SITEMAP_URL}\n`);

  console.log('📤 Submitting to search engines...\n');
  
  const bingResult = await submitToBing();
  const googleResult = await submitToGoogle();

  console.log('\n📊 Summary:');
  console.log(`  Bing: ${bingResult ? '✅ Submitted' : '⚠️ Check manually'}`);
  console.log(`  Google: 📋 Manual submission required`);

  console.log('\n💡 Tip: After first submission, search engines will automatically');
  console.log('   re-crawl your sitemap based on the change frequency settings.');
}

main().catch(console.error);
