import { useCallback, useEffect, useState } from 'react';

export function useUploadSong(filename, text) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(null);
	const [response, setResponse] = useState(null);

	const upload = useCallback(
		async (fname = filename, txt = text) => {
			if (!fname || !txt) {
				const err = new Error('filename and text are required');
				setError(err);
				throw err;
			}

			setUploading(true);
			setError(null);
			setResponse(null);

				try {
				// send as JSON payload (server writes file to disk for debugging)
				const res = await fetch('/api/songTxt', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ filename: fname, text: txt }),
				});

				let data = null;
				try {
					data = await res.json();
				} catch (_) {
					data = null;
				}

				if (!res.ok) {
					const msg = (data && data.message) || res.statusText || 'Upload failed';
					const err = new Error(msg);
					setError(err);
					setUploading(false);
					throw err;
				}

				setResponse(data);
				setUploading(false);
				return data;
			} catch (err) {
				setError(err);
				setUploading(false);
				throw err;
			}
		},
		[filename, text]
	);

	// Auto-upload when both filename and text are provided
	useEffect(() => {
		if (filename && text) {
			// fire-and-forget; callers can also use the returned `upload` directly
			upload().catch(() => {});
		}
	}, [filename, text, upload]);

	return { upload, uploading, error, response };
}