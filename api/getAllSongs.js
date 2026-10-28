export default async function handler(req, res) {
    try {
        var songs_response = await fetch(`${process.env.DB_URL}/songs`, {
            method: "GET",
            cache: "no-cache",
            headers: { 'x-apikey': process.env.DB_API_KEY }
        });

        if (!songs_response.ok) throw new Error(`HTTP error! status: ${songs_response.status}`);
        
        const songs_data = await songs_response.json();

        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
        })
        var info_data = {
            "title": ""
        };

        if (songs_data.filter(song => song.swc).length > 0) {
            const swc_date = new Date(now);
            let daysToAdd = (0 - now.getDay() + 7) % 7;
            swc_date.setDate(now.getDate() + daysToAdd);
            info_data["swc_date"] = formatter.format(swc_date);
        }

        if (songs_data.filter(song => song.tnl).length > 0) {
            const tnl_date = new Date(now);
            let daysToAdd = (4 - now.getDay() + 7) % 7;
            tnl_date.setDate(now.getDate() + daysToAdd);
            info_data["tnl_date"] = formatter.format(tnl_date);
        }

        if (songs_data.filter(song => song.event).length > 0) {
            const info_response = await fetch(`${process.env.DB_URL}/event?max=1`, {
                method: "GET",
                cache: "no-cache",
                headers: { 'x-apikey': process.env.DB_API_KEY }
            });

            if (!info_response.ok && info_response.status !== 429) throw new Error(`HTTP error! status: ${info_response.status}`);

            if (info_response.status !== 429) {
                const info_data_json = [await info_response.json()][0];
                info_data["title"] = info_data_json[0]["title"];
                info_data["event_date"] = formatter.format(Date.parse(info_data_json[0]["event_date"]));
            }
        }

        return res.status(200).json({ info: info_data, songs: songs_data });
    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json({ "message": "An error has occurred" });
    }
}