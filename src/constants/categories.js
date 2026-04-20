export const CATEGORY_STYLES = {
    transport: {
        label: 'transport',
        bg: 'var(--cat-transport-bg)', 
        main: 'var(--cat-transport-main)',
        dark: 'var(--cat-transport-dark)',
        icon: '🚎' 
    },
    food: {
        label: 'food & drinks',
        bg: 'var(--cat-food-bg)',
        main: 'var(--cat-food-main)',
        dark: 'var(--cat-food-dark)',
        icon: '🍔'
    },
    sightseeing: {
        label: 'sightseeing',
        bg: 'var(--cat-sights-bg)',
        main: 'var(--cat-sights-main)',
        dark: 'var(--cat-sights-dark)',
        icon: '🏛️'
    },
    entertainment: {
        label: 'entertainment',
        bg: 'var(--cat-ent-bg)',
        main: 'var(--cat-ent-main)',
        dark: 'var(--cat-ent-dark)',
        icon: '🎭'
    },
    shopping: {
        label: 'shopping',
        bg: 'var(--cat-shopping-bg)',
        main: 'var(--cat-shopping-main)',
        dark: 'var(--cat-shopping-dark)',
        icon: '🛍️'
    },
    others: {
        label: 'others',
        bg: 'var(--cat-others-bg)',
        main: 'var(--cat-others-main)',
        dark: 'var(--cat-others-dark)',
        icon: '✨'
    }
};

export const getCategoryStyle = (categoryKey) => {
    return CATEGORY_STYLES[categoryKey] || CATEGORY_STYLES.others;
};