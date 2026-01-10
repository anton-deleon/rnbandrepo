/**
 * Generates a unique song ID based on the song's title and artist.
 * The ID format is: artist-title_hash, where:
 * - artist and title are lowercased and sanitized
 * - spaces in title are replaced with underscores
 * - hash is an 8-character hexadecimal string derived from the combined string
 * @param {string} title - The song title
 * @param {string} artist - The song artist
 * @returns {string} The unique song ID
 */
function generateSongId(title, artist) {
    // Normalize artist: lowercase, remove non-alphanumeric
    const normalizedArtist = artist.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Normalize title: lowercase, replace spaces with dashes, remove other non-alphanumeric except dash
    const normalizedTitle = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Combined string for hashing
    const combined = `${normalizedArtist}-${normalizedTitle}`;

    // Simple djb2 hash
    let hash = 5381;
    for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) + hash) + combined.charCodeAt(i);
    }

    // Convert to unsigned 32-bit, then to hex, pad to 8 chars, take last 8
    const hashStr = (hash >>> 0).toString(16).padStart(8, '0').slice(-8);

    return `${normalizedTitle}_${hashStr}`;
}

export default generateSongId;