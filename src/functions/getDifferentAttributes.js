import { checkSongsEqual } from "./checkSongsEqual";

export function getDifferentAttributes(origSong, newSong) {
    const newKeys = Object.keys(newSong);

    var obj = newSong._id ? {_id: newSong._id} : {};

    for (var key of newKeys) {
        if (typeof (origSong[key]) === "object" && checkSongsEqual(origSong[key], newSong[key])) continue;
        if (['swc', 'tnl', 'event'].includes(key) && !(key in origSong) && newSong[key] === 0) continue;
        if (['swc_singer', 'tnl_singer', 'event_singer'].includes(key) && !(key in origSong) && newSong[key] === "") continue;
        if (origSong[key] === newSong[key]) continue;

        obj[key] = newSong[key];
    }

    return Object.keys(obj).length === 1 ? null : obj;
}