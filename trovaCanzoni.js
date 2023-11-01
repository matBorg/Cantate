const fs = require('fs');
const request = require('request');


function formattaTestoCanzone(apiResponse) {
    const { title, artist, lyrics } = apiResponse;
    const testoFormattato = `${title} | ${artist}\n\n${lyrics}\n`;
    return testoFormattato
        .split(/\n\s*\n/g)  // Separa strofe vuote
        .map(strofa => strofa.trim())  // Rimuove spazi bianchi inutili
        .join('\n\n');  // Riunisce le strofe con spazi vuoti tra di loro
}


function scaricaTestoCanzone(nomeCanzone, nomeArtista) {
    // Costruisci l'URL per la richiesta GET all'API
    const apiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(nomeCanzone)}/${encodeURIComponent(nomeArtista)}`;

    request(apiUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const testoCanzone = body;


            const parsedInput = JSON.parse(body);
            const lyrics = parsedInput.lyrics;

            // Rimuovi la stringa [Testo di ...]
            const cleanedLyrics = lyrics.replace(/\[Testo di .*?\]/, '').replace(/\[Intro: .*?\]/, '').replace(/\[Strofa: .*?\]/, '');

            const lines = cleanedLyrics.split('\n');
            const formattedLines = [];

            let isInLyrics = false;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (line.startsWith('[') && line.endsWith(']')) {
                    isInLyrics = true;
                    formattedLines.push(line);
                } else if (isInLyrics && line) {
                    formattedLines.push(line);
                }
            }
            // ... (Codice precedente) ...

            // Rimuovi [qualunque cosa tra parentesi quadre] o {qualunque cosa tra parentesi graffe} e aggiungi due a capo

           

            const formattedText = formattedLines.join('\n');//.replace(/\[[^\]]*\]|\{[^\}]*\}/g, '');
            ;



            // Scrivi il testo su un file txt
            const fileContent = `${nomeCanzone.toUpperCase()} | ${nomeArtista.toUpperCase()}\n\n${formattedText}`;
            fs.writeFileSync(`./Canzoni/${nomeCanzone}.txt`, fileContent, 'utf-8');

            console.log(`Testo della canzone '${nomeCanzone}' scaricato con successo.`);
        } else {
            console.log('Errore nel recupero del testo della canzone.');
        }
    });
}


function scaricaTestoCanzoniDaFileJson() {
    // Leggi il file JSON per ottenere l'elenco delle canzoni da scaricare
    const canzoniDaScaricareRaw = fs.readFileSync('canzoniDaScaricare.json', 'utf-8');
    const canzoniDaScaricare = JSON.parse(canzoniDaScaricareRaw);
  
    for (const titolo in canzoniDaScaricare) {
      const artista = canzoniDaScaricare[titolo];
      scaricaTestoCanzone(titolo, artista);
    }

}


scaricaTestoCanzoniDaFileJson();