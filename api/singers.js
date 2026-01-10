export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ "message": "Method not allowed" });

    try {
        var names_response = await fetch('https://rnbandrepo-e7c5.restdb.io/rest/singers', {
            method: "GET",
            cache: "no-cache",
            headers: { 'x-apikey': process.env.DB_API_KEY }
        });

        const names_data = await names_response.json();

        return res.status(200).json({ names: names_data });
    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json({ "message": "An error has occurred" });
    }
}