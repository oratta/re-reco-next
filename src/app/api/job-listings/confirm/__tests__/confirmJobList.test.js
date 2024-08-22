import { parseUrl } from '@/app/api/job-listings/confirm/confirmJobList';
import { format } from 'date-fns';

describe('parseUrl', () => {
    it('should correctly parse a URL with a single area code', () => {
        const url = 'https://www.cityheaven.net/tokyo/A1304/A130401/girl-list/date20240501/';
        const result = parseUrl(url);
        expect(result).toEqual({
            areaCodes: ['tokyo/A1304/A130401'],
            targetDate: '20240501',
            isNow: false,
            condition: url,
        });
    });

    it('should correctly parse a URL with multiple area codes', () => {
        const url = 'https://www.cityheaven.net/tokyo/A1304/A130401-A130402/girl-list/date20240501/';
        const result = parseUrl(url);
        expect(result).toEqual({
            areaCodes: ['tokyo/A1304/A130401', 'tokyo/A1304/A130402'],
            targetDate: '20240501',
            isNow: false,
            condition: url,
        });
    });

    it('should rise error for a URL with an additional area code (invalid format)', () => {
        const url = 'https://www.cityheaven.net/tokyo/A1304/A130401/A123456/girl-list/date20240501/';
        expect(() => parseUrl(url)).toThrow('invalid area code format');
    });

    it('should correctly parse a URL with "play" instead of "date"', () => {
        const url = 'https://www.cityheaven.net/tokyo/A1304/A130401/girl-list/play1/';
        const result = parseUrl(url);
        expect(result).toEqual({
            areaCodes: ['tokyo/A1304/A130401'],
            targetDate: format(new Date(), 'yyyyMMdd'),
            isNow: true,
            condition: url,
        });
    });

    it('should throw an error for URLs without date or play', () => {
        const url = 'https://www.cityheaven.net/tokyo/A1304/A130401/girl-list/';
        expect(() => parseUrl(url)).toThrow('you have to set play date or setting Now');
    });

    it('should handle URLs with additional parameters', () => {
        const url = 'https://www.cityheaven.net/tokyo/A1304/A130401/girl-list/date20240501/?param=value';
        const result = parseUrl(url);
        expect(result).toEqual({
            areaCodes: ['tokyo/A1304/A130401'],
            targetDate: '20240501',
            isNow: false,
            condition: url,
        });
    });

    it('should throw an error for malformed URLs without date or play', () => {
        const url = 'https://www.cityheaven.net/invalid/url';
        expect(() => parseUrl(url)).toThrow('you have to set play date or setting Now');
    });
});