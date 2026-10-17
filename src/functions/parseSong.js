import ChordSheetJS, { Chord } from 'chordsheetjs';


export function parseSong(metadata, lyrics, key, keyDiff, numeralMode = false) {
    const origKey = metadata.defaults.Orig;

    const parser = new ChordSheetJS.UltimateGuitarParser();
    var unserializedSong = parser.parse(`${lyrics}`);

    const currentKey = Chord.parse(key).transpose(keyDiff).toString();
    for (let i = 0; i < unserializedSong.lines.length; i++) {
        const line = unserializedSong.lines[i];

        if (!line.items) continue;

        for (let j = 0; j < line.items.length; j++) {
            const item = line.items[j];

            if (!item.chords || item.chords.trim() == "") continue;

            var chord = Chord.parse(item.chords);

            if (chord.suffix != null && chord.suffix.includes("l")) {
                item.lyrics = item.chords + ' ';
                item.chords = "";
                continue;
            }

            if (["C#", "Db", "D#", "Eb", "F#", "Gb", "G#", "Ab", "A#", "Bb"].includes(currentKey)) {
                item.chords = chord.useModifier('b').normalize().toString();
            } else {
                item.chords = chord.useModifier('#').normalize().toString();
            }

            if (numeralMode) {
                item.chords = chord
                    .toNumeralString(currentKey)
                    .replace(/([ivx]+)m/g, '$1')
                    .replace('#vi', 'vi')
                    .replace('bvii', 'vi')
                    .replace('#iii', 'iii')
                    .replace('#VI', 'bVII')
            }
        }
    }

    unserializedSong = unserializedSong.setKey(origKey).changeKey(key).transpose(keyDiff > 0 ? keyDiff - 12 : keyDiff);
    const formatter = new ChordSheetJS.HtmlTableFormatter();
    var disp = formatter.format(unserializedSong);

    disp = disp.replace(/<td class="comment">(.*?)<\/td>/g, '<h3 class="label">$1</h3>')
        .replaceAll('ma7', 'maj7');

    return disp;
}