import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SongTable from "../components/Editor/SongTable";
import SongEditor from "../components/Editor/SongEditor";
import LoadingSpinner from "../components/Home/LoadingSpinner";
import { checkSongsEqual } from "../functions/checkSongsEqual";
import { getDifferentAttributes } from "../functions/getDifferentAttributes";
import { fetchAllSongs } from "../functions/fetchAllSongs";
import "../css/editor.css";

function Editor() {
    const navigate = useNavigate();
    const [showEditor, setShowEditor] = useState(false);
    const [activeSong, setActiveSong] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const stored = JSON.parse(localStorage.getItem("songs"));
    const [event_title, setEventTitle] = useState(stored.info.title);

    const [songs, setSongs] = useState(
        stored.songs
            .map(s => JSON.parse(sessionStorage.getItem("temp"))?.find(ts => ts.id === s.id) ?? s)
            .sort((a, b) => a.title.localeCompare(b.title))
    );

    const swc_songs = songs.filter(s => s.swc).sort((a, b) => a.swc - b.swc);
    const tnl_songs = songs.filter(s => s.tnl).sort((a, b) => a.tnl - b.tnl);
    const event_songs = songs.filter(s => s.event).sort((a, b) => a.event - b.event);
    const active_songs = songs.filter(s => s.active).sort((a, b) => a.title.localeCompare(b.title));

    const addSongToLineup = (song, lineup) => {
        const songToAdd = songs.find(s => s.id === song.id);
        if (!songToAdd) return;

        songToAdd[lineup] = songs.filter(s => s[lineup]).length + 1;

        handleEditSong(songToAdd);
    };

    const handleSave = async () => {
        const temp = JSON.parse(sessionStorage.getItem("temp")) || [];

        const toSave = temp.map(s => {
            const origSong = stored.songs.find(os => os.id === s.id) || {};
            const diff = getDifferentAttributes(origSong, s);
            if (diff) return diff;
        }).filter(s => s !== undefined)

        setLoading(true);
        try {
            setStatus("Saving changes to database...");
            const response = await fetch('/api/sendToDB', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ songs: toSave, event_title: event_title })
            });

            if (!response.ok) {
                console.error("Failed to save data");
            } else {
                setStatus("Songs updated! Returning to home...");
                sessionStorage.removeItem("temp");
                await fetchAllSongs();
                navigate('/');
            }
        } catch (e) {
            console.error("Error during save:", e);
        } finally {
            setLoading(false);
        }
    }

    const handleActiveSong = (song) => {
        setShowEditor(song !== null)
        setActiveSong(song);
    }

    const handleEditSong = (editedSong) => {
        try {
            const tempRaw = sessionStorage.getItem("temp");
            var arr = tempRaw ? JSON.parse(tempRaw) : [];

            const {lyrics, ...song} = editedSong;

            const existing = arr.find(s => s.id === song.id)
            if (existing) {
                const storedSong = stored.songs.find(s => s.id === song.id)
                if (checkSongsEqual(storedSong, song)) {
                    arr.splice(arr.findIndex(s => s.id === song.id), 1)
                } else
                    arr = arr.map(s => s.id === song.id ? song : s)
            } else arr.push(song);
            sessionStorage.setItem("temp", JSON.stringify(arr));
        } catch (e) {
            console.error("Failed to write temp to sessionStorage:", e);
        }

        setSongs(
            stored.songs
                .map(s => JSON.parse(sessionStorage.getItem("temp"))?.find(ts => ts.id === s.id) ?? s)
                .sort((a, b) => a.title.localeCompare(b.title))
        );
    }

    useEffect(() => {
        if (!localStorage.getItem("singers") && JSON.parse(localStorage.getItem("singers"))?.length !== 7) {
            const fetchAllSingers = async () => {
                const response = await fetch('/api/getAllSingers');

                if (!response.ok) console.error(response.error);
                else {
                    const result = await response.json();

                    const names = result.names.map(s => s.name);
                    localStorage.setItem("singers", JSON.stringify(names));
                }
            }

            fetchAllSingers();
        }
    }, []);

    return showEditor
        ?
        <SongEditor
            song={activeSong}
            handleActiveSong={handleActiveSong}
            handleEditSong={handleEditSong}
        />
        :
        loading
            ?
            <LoadingSpinner status={status} />
            :
            (
                <div className="editor-container">
                    <div className="buttons-container">
                        <div className="editor-button back" onClick={() => navigate('/')}>
                            Back
                        </div>
                        <div className="editor-button add" onClick={() => handleActiveSong({})}>
                            Add Song
                        </div>
                        <div className="editor-button save" onClick={() => handleSave()}>
                            Save
                        </div>
                    </div>

                    <SongTable
                        songs={swc_songs}
                        title="Sunday Worship Celebration"
                        handleActiveSong={handleActiveSong}
                        handleEditSong={handleEditSong}
                        lineup="swc"
                    />

                    <SongTable
                        songs={tnl_songs}
                        title="Thursday Night Live"
                        handleActiveSong={handleActiveSong}
                        handleEditSong={handleEditSong}
                        lineup="tnl"
                    />

                    <SongTable
                        songs={event_songs}
                        title={event_title}
                        handleActiveSong={handleActiveSong}
                        handleEditSong={handleEditSong}
                        lineup="event"
                        titleEditable={true}
                        setEventTitle={setEventTitle}
                    />
                    <SongTable
                        songs={active_songs}
                        title="Active Songs"
                        handleActiveSong={handleActiveSong}
                        handleEditSong={handleEditSong}
                        lineup={false}
                        addSongToLineup={addSongToLineup}
                    />
                    <SongTable
                        songs={songs.filter(s => !s.swc && !s.tnl && !s.event && !s.active)}
                        title="All Songs"
                        handleActiveSong={handleActiveSong}
                        handleEditSong={handleEditSong}
                        lineup={false}
                        addSongToLineup={addSongToLineup}
                    />
                </div>
            );
}

export default Editor;
