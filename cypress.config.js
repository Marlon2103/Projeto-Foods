process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'zwtw52',
  video: true,
  videoCompression: false,
  screenshotOnRunFailure: true,
  chromeWebSecurity: false,
  pageLoadTimeout: 120000,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  responseTimeout: 15000,
  trashAssetsBeforeRuns: true,
  e2e: {
    baseUrl: 'https://velox2.velox-by-invent.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          // Remove a flag navigator.webdriver (detecção de automação)
          launchOptions.args.push('--disable-blink-features=AutomationControlled');
          launchOptions.args.push(
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
          );
          launchOptions.args.push('--ignore-certificate-errors');
          launchOptions.args.push('--allow-insecure-localhost');
          launchOptions.args.push('--allow-running-insecure-content');
          launchOptions.args.push('--ignore-urlfetcher-cert-requests');
          launchOptions.args = launchOptions.args.filter(
            (a) => a !== '--enable-automation'
          );
        }

        if (browser.family === 'firefox') {
          launchOptions.preferences = launchOptions.preferences || {};
          launchOptions.preferences['security.enterprise_roots.enabled'] = true;
          launchOptions.preferences['security.ssl.errorReporting.automatic'] = false;
          launchOptions.preferences['security.certerrors.permanentOverride'] = true;
        }

        return launchOptions;
      });
    },
  },
});
