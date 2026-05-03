import { CATEGORY_STYLES, getCategoryStyle } from '../constants/categories';

describe('categories constants', () => {
    describe('CATEGORY_STYLES', () => {
        test('contains all required categories', () => {
            const expectedCategories = ['transport', 'food', 'sightseeing', 'entertainment', 'shopping', 'others'];
            expectedCategories.forEach(cat => {
                expect(CATEGORY_STYLES).toHaveProperty(cat);
            });
        });

        test('each category has required fields', () => {
            Object.entries(CATEGORY_STYLES).forEach(([key, style]) => {
                expect(style).toHaveProperty('label');
                expect(style).toHaveProperty('bg');
                expect(style).toHaveProperty('main');
                expect(style).toHaveProperty('dark');
                expect(style).toHaveProperty('icon');
            });
        });

        test('transport category has correct label', () => {
            expect(CATEGORY_STYLES.transport.label).toBe('transport');
        });

        test('food category has correct label', () => {
            expect(CATEGORY_STYLES.food.label).toBe('food & drinks');
        });

        test('others category has correct icon', () => {
            expect(CATEGORY_STYLES.others.icon).toBe('✨');
        });
    });

    describe('getCategoryStyle', () => {
        test('returns correct style for known category', () => {
            const style = getCategoryStyle('transport');
            expect(style).toEqual(CATEGORY_STYLES.transport);
        });

        test('returns others style for unknown category', () => {
            const style = getCategoryStyle('nonexistent');
            expect(style).toEqual(CATEGORY_STYLES.others);
        });

        test('returns others style for undefined', () => {
            const style = getCategoryStyle(undefined);
            expect(style).toEqual(CATEGORY_STYLES.others);
        });

        test('returns others style for null', () => {
            const style = getCategoryStyle(null);
            expect(style).toEqual(CATEGORY_STYLES.others);
        });

        test('returns correct style for food', () => {
            const style = getCategoryStyle('food');
            expect(style.label).toBe('food & drinks');
        });

        test('returns correct style for sightseeing', () => {
            const style = getCategoryStyle('sightseeing');
            expect(style.label).toBe('sightseeing');
        });

        test('returns correct style for entertainment', () => {
            const style = getCategoryStyle('entertainment');
            expect(style.label).toBe('entertainment');
        });

        test('returns correct style for shopping', () => {
            const style = getCategoryStyle('shopping');
            expect(style.label).toBe('shopping');
        });
    });
});
