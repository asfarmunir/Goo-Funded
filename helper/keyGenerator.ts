export function generateCustomId(includePrefix=true, includeSuffix=true) {
    // Fixed prefix and suffix
    const prefix = "VP";
    const suffix = "-22";

    // Generate a random sequence of 7 digits
    const randomDigits = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');

    // Combine the prefix, random digits, and suffix
    if(includePrefix && includeSuffix) {
        return `${prefix}${randomDigits}${suffix}`;
    }
    if(includePrefix) {
        return `${prefix}${randomDigits}`;
    }
    if(includeSuffix) {
        return `${randomDigits}${suffix}`;
    }
    return randomDigits;
}