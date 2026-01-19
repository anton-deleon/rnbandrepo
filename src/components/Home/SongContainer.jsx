import '../../css/songcontainer.css';
import DOMPurify from 'dompurify';
import LoadingSpinner from './LoadingSpinner';
import { useEffect } from 'react';

function SongContainer({ metadata, parsedLyrics, hideChords, loading, error, containerRef }) {
  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  const copyLyricsToClipboard = (e) => {
    if (e) e.preventDefault();

    if (!containerRef?.current) return;

    const paragraphs = containerRef.current.querySelectorAll('.paragraph');

    var text = "";
    paragraphs.forEach(para => {
      var paragraphText = "";

      para.childNodes.forEach(row => {
        row.firstChild.childNodes.forEach(tr => {
          var rowText = "";
          tr.childNodes.forEach(td => {
            if (td.classList && td.classList.contains('lyrics') && td.innerText.trim() !== "") {
              rowText += td.innerText;
            }
          })

          if (rowText !== "") {
            paragraphText += rowText.trimStart() + "\n";
          }
        });
      });

      if (paragraphText !== "") {
        text += paragraphText + "\n";
      }
    })

    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        copyLyricsToClipboard(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="lyrics-outer-container">
      <div
        className="lyrics-container"
        id="lyricsContainer"
        ref={containerRef}
      >
        <h1 id="title">{metadata?.title}</h1>
        <h2 id="artist">{metadata?.artist}</h2>
        <div
          className={hideChords ? 'hide-chords' : ''}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(parsedLyrics),
          }}
        />
      </div>
    </div>
  );
}

export default SongContainer;
