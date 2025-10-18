class CookieConsentManager {
    constructor() {
        this.consentKey = 'analytics_consent';
        this.consentBanner = document.getElementById('cookie-consent');
        this.acceptButton = document.getElementById('accept-cookies');
        this.declineButton = document.getElementById('decline-cookies');
        this.settingsButton = document.getElementById('cookie-settings');
        
        // Region-specific configuration
        this.userRegion = null;
        this.gdprCountries = [
            'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
            'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
            'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'UK', 'IS',
            'LI', 'NO', 'CH' // EU countries plus UK, Iceland, Liechtenstein, Norway, Switzerland
        ];
        this.ccpaRegions = ['US-CA']; // California
        
        this.initWithRegion();
    }
    
    async initWithRegion() {
        // Check if we've already determined region compliance
        const storedRegionCompliance = localStorage.getItem('region_requires_consent');

        if (storedRegionCompliance !== null) {
            this.handleConsentBasedOnRegion(storedRegionCompliance === 'true');
        } else {
            try {
                const requiresConsent = await this.checkIfRegionRequiresConsent();
                localStorage.setItem('region_requires_consent', requiresConsent.toString());
                this.handleConsentBasedOnRegion(requiresConsent);
            } catch (error) {
                console.error('Error determining region compliance:', error);
                // Fallback to requiring consent on error for safety
                this.handleConsentBasedOnRegion(true);
            }
        }
    }
    
    async checkIfRegionRequiresConsent() {
        try {
            // Use browser's timezone to approximate location instead of external API
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // Map timezone to likely region
            this.userRegion = this.getRegionFromTimezone(timezone);
            
            // Log for debugging
            console.log(`Detected timezone: ${timezone}, mapped to region: ${this.userRegion}`);
            
            // Check if user is likely in a GDPR country or CCPA region
            const requiresConsent = this.gdprCountries.includes(this.userRegion) || 
                                   this.userRegion === 'US-CA';
                
            return requiresConsent;
        } catch (error) {
            console.error('Error determining region from timezone:', error);
            // In case of error, require consent to be safe
            return true;
        }
    }
    
    getRegionFromTimezone(timezone) {
        // Map common timezones to country codes
        const timezoneMap = {
            // European timezones (GDPR regions)
            'Europe/London': 'GB',
            'Europe/Paris': 'FR',
            'Europe/Berlin': 'DE',
            'Europe/Madrid': 'ES',
            'Europe/Rome': 'IT',
            'Europe/Amsterdam': 'NL',
            'Europe/Brussels': 'BE',
            'Europe/Vienna': 'AT',
            'Europe/Stockholm': 'SE',
            'Europe/Copenhagen': 'DK',
            'Europe/Oslo': 'NO',
            'Europe/Helsinki': 'FI',
            'Europe/Dublin': 'IE',
            'Europe/Lisbon': 'PT',
            'Europe/Athens': 'GR',
            'Europe/Bucharest': 'RO',
            'Europe/Prague': 'CZ',
            'Europe/Warsaw': 'PL',
            'Europe/Budapest': 'HU',
            'Europe/Sofia': 'BG',
            'Europe/Zurich': 'CH',
            
            // US timezones
            'America/Los_Angeles': 'US-CA', // California (CCPA)
            'America/New_York': 'US',
            'America/Chicago': 'US',
            'America/Denver': 'US',
            'America/Phoenix': 'US',
            
            // ASEAN timezones (non-GDPR)
            'Asia/Singapore': 'SG',
            'Asia/Jakarta': 'ID',
            'Asia/Bangkok': 'TH',
            'Asia/Manila': 'PH',
            'Asia/Kuala_Lumpur': 'MY',
            'Asia/Ho_Chi_Minh': 'VN',
            
            // Other common timezones
            'Asia/Tokyo': 'JP',
            'Asia/Seoul': 'KR',
            'Asia/Shanghai': 'CN',
            'Australia/Sydney': 'AU',
            'Pacific/Auckland': 'NZ',
            'America/Toronto': 'CA',
            'America/Sao_Paulo': 'BR',
            'Asia/Dubai': 'AE',
            'Asia/Kolkata': 'IN'
        };
        
        // Extract region from timezone
        if (timezone in timezoneMap) {
            return timezoneMap[timezone];
        }
        
        // For unknown or unmapped timezones, extract continent
        const continent = timezone.split('/')[0];
        
        // Default mapping based on continent when specific timezone isn't mapped
        switch (continent) {
            case 'Europe':
                return 'EU'; // Consider all European timezones as GDPR regions
            case 'America':
                return timezone.includes('Los_Angeles') ? 'US-CA' : 'US';
            case 'Asia':
                return 'ASIA';
            case 'Africa':
                return 'AF';
            case 'Australia':
                return 'AU';
            default:
                return 'UNKNOWN';
        }
    }
    
    handleConsentBasedOnRegion(requiresConsent) {
        if (!requiresConsent) {
            // For non-regulated regions (like ASEAN), auto-accept cookies
            if (!this.hasUserConsented()) {
                this.saveConsent(true);
            }
            this.initializeAnalytics();
        } else {
            // For regulated regions, check for explicit consent
            this.init();
        }
    }
    
    init() {
        if (!this.hasUserConsented()) {
            this.showConsentBanner();
        } else {
            this.initializeAnalytics();
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.acceptButton) {
            this.acceptButton.addEventListener('click', () => this.acceptCookies());
        }
        
        if (this.declineButton) {
            this.declineButton.addEventListener('click', () => this.declineCookies());
        }
        
        if (this.settingsButton) {
            this.settingsButton.addEventListener('click', () => this.showConsentBanner());
        }
    }
    
    showConsentBanner() {
        if (this.consentBanner) {
            setTimeout(() => {
                this.consentBanner.classList.add('show');
            }, 800);
        }
    }
    
    hideConsentBanner() {
        if (this.consentBanner) {
            this.consentBanner.classList.remove('show');
        }
    }
    
    saveConsent(isAccepted) {
        localStorage.setItem(this.consentKey, isAccepted ? 'true' : 'false');
    }
    
    hasUserConsented() {
        return localStorage.getItem(this.consentKey) === 'true';
    }
    
    acceptCookies() {
        this.saveConsent(true);
        this.hideConsentBanner();
        this.initializeAnalytics();
    }
    
    declineCookies() {
        this.saveConsent(false);
        this.hideConsentBanner();
        this.disableAnalytics();
    }
    
    initializeAnalytics() {
        // Update consent to 'granted' for analytics
        // gtag is already loaded and configured in index.html
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });

            // Dispatch custom event to notify analytics.js that consent is granted
            window.dispatchEvent(new Event('consentGranted'));
        }
    }
    
    disableAnalytics() {
        // Update consent to 'denied' - keep analytics disabled
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }

        // Also set the disable flag as additional safety
        window['ga-disable-G-KV6961LE0F'] = true;
    }
}

// Initialize cookie consent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsentManager();
});
