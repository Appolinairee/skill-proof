/**
 * LinkedIn Screenshot Fetcher using Puppeteer
 * Takes screenshots of LinkedIn profiles for Gemini Vision analysis
 */

import puppeteer from 'puppeteer';

export interface LinkedInScreenshot {
  url: string;
  screenshots: Buffer[];
  success: boolean;
  error?: string;
}

export async function captureLinkedInProfile(profileUrl: string): Promise<LinkedInScreenshot> {
  console.log('━━━━━━━━━━ LINKEDIN SCREENSHOT ━━━━━━━━━━');
  console.log('URL:', profileUrl);

  const screenshots: Buffer[] = [];
  let browser;

  try {
    // Launch browser in headless mode
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser', // Try common Linux paths
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--single-process', // Important for serverless/docker
      ],
    });

    const page = await browser.newPage();

    // Set realistic viewport
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // Set user agent to look like a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log('🌐 Navigation vers le profil...');
    await page.goto(profileUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if we hit the login wall
    const isLoginPage = await page.evaluate(() => {
      return document.body.innerHTML.includes('authwall') || 
             document.body.innerHTML.includes('Sign in') ||
             document.querySelector('input[name="session_key"]') !== null;
    });

    if (isLoginPage) {
      console.warn('⚠️ LinkedIn demande une connexion (authwall détecté)');
      // Take screenshot anyway to show to user
      const screenshot = await page.screenshot({
        fullPage: true,
        type: 'png',
      });
      screenshots.push(screenshot as Buffer);
      
      await browser.close();
      return {
        url: profileUrl,
        screenshots,
        success: false,
        error: 'LinkedIn authwall - connexion requise',
      };
    }

    console.log('📸 Capture du profil...');

    // Take full page screenshot
    const fullScreenshot = await page.screenshot({
      fullPage: true,
      type: 'png',
    });
    screenshots.push(fullScreenshot as Buffer);

    console.log(`✅ ${screenshots.length} screenshot(s) capturé(s)`);

    await browser.close();

    return {
      url: profileUrl,
      screenshots,
      success: true,
    };

  } catch (error) {
    if (browser) {
      await browser.close();
    }

    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ Erreur lors du screenshot:', errorMessage);

    return {
      url: profileUrl,
      screenshots,
      success: false,
      error: errorMessage,
    };
  }
}
