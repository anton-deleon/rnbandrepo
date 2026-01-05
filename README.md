# RN Band Song Repository

This is the official song repository of Rock of the Nations Gospel Fellowship's Band.

[See live](https://rnbandrepo.vercel.app/)

## Features
- Saved weekly lineups
- Transposing of chords
- Saved keys per singer per song
- Automatic transposing based on singer
- Auto-scrolling

Songs are parsed using [ChordSheetJS](https://github.com/martijnversluis/ChordSheetJS).

### Planned Features:
- Dynamic updating of songs and lineups
- User authentication
- Offline availability


## Design

The site is developed using ReactJS + Vite hosted on [Vercel](https://rnbandrepo.vercel.app/). Song data is stored in [restdb.io](https://restdb.io/) and song TXT files are stored in [Vercel Blob Storage](https://vercel.com/docs/vercel-blob).

## About the Project & Developer

I am an aspiring full stack developer who recently finished my studies in Information Technology. I also am part of the band mentioned above, playing bass from time to time, which makes this project the sweet middle ground for meeting what I learned and what I'm passionate about.

This project started after my friends approached me with these issues:
- Chord sheets found from different sources, which made rehearsals confusing
- Lengthy preparation time for gathering chord sheets before rehearsals
- Transpose features being locked behind a paywall by most online chord sheets
- Singers forgetting what key they sing for certain songs

Instantly, the idea for this project popped into my mind. Not only could I hone my skills as a developer, but also help my bandmates have an easier time during rehearsals.

The band requested a very simple UI, which prompted me to not use any CSS frameworks as it gave me more control over the smaller details (and allowed me to explore more CSS features I wasn't familiar with!)

The band also wanted an easy-to-navigate design, so the entire project was designed with spontaneity in mind, knowing that the band will use this while playing. *Basically, the fewer clicks the better.*

The biggest issue I faced was finding where to store the files for the lyrics and chords, since the band wanted to customize the lyrics and chords for certain songs. This led me to use Vercel Blob Storage where I can store each song as its own .txt file, making it easy to edit and parse with [ChordSheetJS](https://github.com/martijnversluis/ChordSheetJS).

The project is constantly being developed based on feedback from the band and optimizations I can find. If you stumbled into my project somehow, I'd love it if you can leave me some feedback as well!

And if you're also a part of your church band, feel free to clone this project to use for your own. Let me know if you do!

You can contact me through the email: anton_dleon@yahoo.com