import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';

export default defineConfig({
    test: {
        browser: {
            enabled: true,
            provider: playwright({
                launchOptions: {
                    channel: 'chrome'
                }
            }),
            instances: [
                {
                    browser: 'chromium',
                    headless: true
                }
            ]
        }
    }
});
