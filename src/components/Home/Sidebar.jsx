import '../../css/sidebar.css'
import SongList from './songList';
import LoadingSpinner from './LoadingSpinner';
import { useState, useEffect } from 'react';

function Sidebar({ toggleLoadSong, showSidebar, toggleSidebar }) {
    const [info, setInfo] = useState({});
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAllSongs = async () => {
        setRefresh(true);
        const response = await fetch('api/getAllSongs');

        console.log(response);
        if (!response.ok) {
            alert(`Could not update songs. Please try again later.`);
            const localSongs = JSON.parse(localStorage.getItem("songs"))
            setInfo(localSongs.info);
            setSongs(localSongs.songs);
        } else {
            const result = await response.json();
            setInfo(result.info);
            setSongs(result.songs);

            localStorage.setItem("songs", JSON.stringify(result));
            localStorage.setItem("lastUpdated", new Date().toISOString());
        }

        setLoading(false);
        setRefresh(false);
    }

    useEffect(() => {
        const localSongs = JSON.parse(localStorage.getItem("songs"))
        if (localSongs && !localSongs["info"]) {
            localStorage.removeItem("songs");
        }

        const now = new Date();
        if (localSongs && localStorage.getItem("lastUpdated")) {
            const lastUpdated = new Date(localStorage.getItem("lastUpdated"));
            const diffInHours = (now - lastUpdated) / (1000 * 60 * 60 * 24);
            if (diffInHours <= 3) {
                setInfo(localSongs.info);
                setSongs(localSongs.songs);
                setLoading(false);
            } else {
                fetchAllSongs();
            }
        } else {
            fetchAllSongs();
        }
    }, [])

    if (loading) return <LoadingSpinner />;

    const songLists = [
        { title: `SWC — ${info.swc_date}`, songArray: songs.filter(song => song.swc && song.swc != 0).sort((a, b) => a.swc - b.swc), date: info.swc_date },
        { title: `TNL — ${info.tnl_date}`, songArray: songs.filter(song => song.tnl && song.tnl != 0).sort((a, b) => a.tnl - b.tnl), date: info.tnl_date },
        { title: `${info.title} — ${info.event_date}`, songArray: songs.filter(song => song.event && song.event != 0).sort((a, b) => a.event - b.event), date: info.event_date },
    ].filter(list => list.date && list.date.trim() !== '');

    const today = new Date();

    songLists.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Prioritize today's date at the top
        if (dateA.toDateString() === today.toDateString()) return -1;
        if (dateB.toDateString() === today.toDateString()) return 1;

        const diffA = dateA - today;
        const diffB = dateB - today;

        // Both dates are in the future: sort by closest first
        if (diffA >= 0 && diffB >= 0) return diffA - diffB;

        // Both dates are in the past: sort by closest first (most recent past)
        if (diffA < 0 && diffB < 0) return diffA - diffB;

        // One future, one past: put future before past
        if (diffA >= 0) return -1;
        return 1;
    });

    return (
        <>
            <div className={"sidebar" + (showSidebar ? " show" : "")} id="sidebar">
                <h2 className="welcome-text">RN Band Song Repository</h2>
                <img
                    className={`refresh-icon ${refresh ? 'rotate' : ''}`}
                    src='refresh.svg'
                    onClick={fetchAllSongs}
                />
                <input type="text" className="search-bar" id="searchBar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {songLists.map(list => (
                    <SongList
                        key={list.title}
                        type="active"
                        title={list.title}
                        songArray={list.songArray}
                        toggleLoadSong={toggleLoadSong}
                        searchTerm={searchTerm}
                    />
                ))}
                <SongList
                    title="ACTIVE ROTATION"
                    songArray={songs.filter(song => song.active).sort((a, b) => a.title.localeCompare(b.title))}
                    toggleLoadSong={toggleLoadSong}
                    searchTerm={searchTerm}
                />
                <SongList
                    title="SONG LIBRARY"
                    songArray={songs.filter(song => !song.active).sort((a, b) => a.title.localeCompare(b.title))}
                    toggleLoadSong={toggleLoadSong}
                    searchTerm={searchTerm}
                />
            </div>
            <button className="openbtn" id="openbtn" onClick={toggleSidebar} >☰</button>
        </>
    )
}

export default Sidebar