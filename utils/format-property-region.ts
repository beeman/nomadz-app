export const formatPropertyRegion = (
    values?: (string | undefined | null)[] | null,
    defaultText: string = 'location not set'
): string => {
    if (!Array.isArray(values)) {
        return defaultText;
    }

    const filtered = values.filter(Boolean); // removes undefined, null, and empty strings

    return filtered.length > 0 ? filtered.join(', ') : defaultText;
}; 