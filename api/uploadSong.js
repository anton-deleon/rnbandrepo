import { put } from '@vercel/blob';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { filename, text } = req.body || {};
        if (!filename || typeof text !== 'string') {
            return res.status(400).json({ message: 'filename and text are required' });
        }

        // sanitize filename
        const safeName = filename.toString().replace(/[^a-zA-Z0-9-_.]/g, '_');
        const pathname = `txt/${safeName}.txt`;

        // If BLOB_READ_WRITE_TOKEN is configured, upload to Vercel Blob
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const result = await put(pathname, text, {
                    contentType: 'text/plain',
                    access: 'public',
                    allowOverwrite: true
                });
                return res.status(200).json({ message: 'uploaded', result });
            } catch (err) {
                console.error('Vercel blob upload failed:', err);
                // fall through to local write fallback
            }
        } else {
            throw new Error('Missing token');
        }

        return res.status(500).json({ message: 'Upload failed' });
    } catch (error) {
        console.error('Error processing upload:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}