    export function generateCustomId(includePrefix=true, includeSuffix=true) {
        // Fixed prefix and suffix
        const prefix = "GOO";
        const suffix = "-25";

        // Generate a random sequence of 6 digits
        const randomDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');

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