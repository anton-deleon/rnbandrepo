import { useEffect, useRef, useState } from 'react'
import SongContainer from '../components/Home/SongContainer'
import Options from '../components/Home/Options'
import Sidebar from '../components/Home/Sidebar'
import { useSongFiles } from '../hooks/useSongFiles';
import { parseSong } from '../functions/parseSong';
import { Analytics } from '@vercel/analytics/react';
import Autoscroll from '../components/Home/Autoscroll';

function Home({ setEditing }) {
  const [activeSong, setActiveSong] = useState({});
  const [activeKey, setActiveKey] = useState({ key: "C", singer: "" });
  const [keyDiff, setKeyDiff] = useState(0);
  const [parsedLyrics, setParsedLyrics] = useState("");

  const [numeralMode, setNumeralMode] = useState(false);
  const [hideChords, setHideChords] = useState(false);

  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const { lyrics, loading, error } = useSongFiles(activeSong);
  const [metadata, setMetadata] = useState(null);

  const containerRef = useRef(null);

  const toggleLoadSong = (song, singer) => {
    if (activeSong?.id === song.id) return;
    setActiveSong(song);
    setActiveKey({ ...activeKey, singer: singer })
    const songs = JSON.parse(localStorage.getItem("songs")).songs
    setMetadata(songs.find((item) => { return item.id == song.id }));

    if (singer && singer.trim() !== "") setKeyDiff(0);
  };

  useEffect(() => {
    if (!activeSong.title) return;
    if (showSidebar) toggleSidebar();
  }, [activeSong]);

  useEffect(() => {
    if (!loading && metadata && lyrics) {
      let key = activeKey.key;

      if (activeKey.singer && activeKey.singer.trim() !== "") {
        key = metadata.defaults[activeKey.singer] || activeKey.key;
      }

      setActiveKey({ ...activeKey, key: key });
      setParsedLyrics(parseSong(metadata, lyrics, key, keyDiff, numeralMode, hideChords));
    }
  }, [loading, metadata, lyrics, activeKey.singer, keyDiff, numeralMode, hideChords]);

  return (
    <>
      <div id='container' style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          toggleLoadSong={toggleLoadSong}
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
          setEditing={setEditing}
        />
        <Autoscroll
          containerRef={containerRef}
        />
        <Options
          metadata={metadata}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          keyDiff={keyDiff}
          setKeyDiff={setKeyDiff}
          numeralMode={numeralMode}
          setNumeralMode={setNumeralMode}
          hideChords={hideChords}
          setHideChords={setHideChords}
        />
        <SongContainer
          metadata={metadata}
          parsedLyrics={parsedLyrics}
          hideChords={hideChords}
          loading={loading}
          error={error}
          containerRef={containerRef}
        />
      </div>
      <Analytics />
    </>
  )
}

export default Home
