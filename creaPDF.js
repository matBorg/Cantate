const fs = require('fs');
const path = require('path'); // Rinomina la variabile path
const puppeteer = require('puppeteer');
const filePath = './infoCantata.json';
const rawData = fs.readFileSync(filePath, 'utf-8');
const info = JSON.parse(rawData);

const luogo = info.luogo;
const data = info.data;
const canzoni = info.canzoni;

const styles = `
  <style>
    .title {
        font-size: 27px;
        font-weight: bold;
        margin: 10px 0;
        font-family: Arial, sans-serif;
    }
    
    .author {
        font-size: 14px;
        margin: 50px 0 0 5px;
        font-family: Arial, sans-serif;
    }

    .chorus {
        font-size: 12px;
        font-style: italic;
        font-family: Arial, sans-serif;
        font-weight: normal;
        margin: 10px 0;
        line-height: 1.25;
    }

    .verse {
        font-size: 12px;
        font-family: Arial, sans-serif;
        font-weight: normal;
        margin: 10px 0;
        line-height: 1.25;

    }
    pre {
        white-space: pre-wrap;
        font-size: 16px;
        margin: 10px 0;
    }

    .info-serata {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        border-right: 1px solid black;
        padding-right: 10px;
        font-family: 'Kanit', sans-serif;
    }
    
    .event-place {
        font-size: 30px;
        font-weight: bold;
        font-family: 'Kanit', sans-serif;
    }
    
    .event-date {
        font-size: 25px;
        font-family: 'Kanit', sans-serif;
    }
    
    .title-author {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        margin-top: 20px;
    }

    hr { 
        display: block;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
        margin-left: auto;
        margin-right: auto;
        border-style: inset;
        border-width: 1px;
    }

    .page-break {
          margin-bottom: 20px; /* Aggiunge spazio tra le pagine */
          page-break-before: always;
    }
  </style>
`;

// Directory contenente i file di testo (.txt)
const directoryPath = './Canzoni';

// Controllo delle canzoni mancanti
const songsToDownload = {}; // Oggetto per le canzoni da scaricare

function generateHTMLForFile(filePath, isLastFile) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const titleAndAuthor = lines[0].split('|');
    const title = titleAndAuthor[0].trim();
    const author = titleAndAuthor[1].trim();

    let content = '';
    let currentStyle = '';  // Stile attuale (nessun div sezione aperto)

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('[Strofa') || line.startsWith('[Verse')) {
            // Inizia una sezione di strofa
            if (currentStyle !== 'verse') {
                content += '</div>';  // Chiudi il div della sezione corrente se non è una strofa
                currentStyle = 'verse';
                content += '<div class="verse">';
            }
        } else if (line.startsWith('[Ritornello') || line.startsWith('[Chorus')) {
            // Inizia una sezione di ritornello
            if (currentStyle !== 'chorus') {
                content += '</div>';  // Chiudi il div della sezione corrente se non è un ritornello
                currentStyle = 'chorus';
                content += '<div class="chorus">';
            }
        } else if (line.startsWith('[')) {
            // Inizia una sezione di ritornello
            if (currentStyle !== 'verse') {
                content += '</div>';  // Chiudi il div della sezione corrente se non è un ritornello
                currentStyle = 'verse';
                content += '<div class="verse">';
            }
        } else if (line === '') {
            // Riga vuota, chiudi la sezione corrente se presente
            if (currentStyle !== '') {
                content += '</div>';
                currentStyle = '';
            }
        } else {
            // Rimuovi tutte le parentesi quadrate che si aprono e si chiudono, applicando lo stile predefinito delle strofe
            const lineWithoutBrackets = line.replace(/\[([^\]]*)\]/g, '');
            content += lineWithoutBrackets + '<br>';
        }
    }

    // Chiudi l'eventuale sezione rimasta aperta
    if (currentStyle !== '') {
        content += '</div>';
    }

    let html = `
    <div class="title-author">
      <div>
        <span class="title">${title}</span>
        <span class="author">${author}</span>
      </div>
    </div>
    <hr>
    <pre>${content}</pre>
  `;

    if (!isLastFile) {
        html += '<div class="page-break"></div>';
    }

    return html;
}

function readTextFilesInDirectory(directoryPath, info) {
    const songOrder = Object.keys(info.canzoni);

    const textFiles = songOrder.map((song) => {
        const fileName = `${song}.txt`;
        return path.join(directoryPath, fileName);
    });

    return textFiles;
}


for (const song in canzoni) {
    const fileName = `${song}.txt`;
    if (!fs.existsSync(path.join(directoryPath, fileName))) {
        songsToDownload[song] = canzoni[song];
    }
}


if (Object.keys(songsToDownload).length > 0) {
    // Se ci sono canzoni da scaricare, crea il file JSON e interrompi il programma
    fs.writeFileSync('canzoniDaScaricare.json', JSON.stringify(songsToDownload, null, 2), 'utf8');
    console.log('Mancano delle canzoni nella cartella. Elenco delle canzoni mancanti è stato generato in "canzoniDaScaricare.json".');
    process.exit(1); // Interrompi l'esecuzione del programma
}


const textFiles = readTextFilesInDirectory(directoryPath, info);


const totalSongs = textFiles.length;
const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@100&display=swap" rel="stylesheet">
        ${styles}
    </head>
    <body>
        <div class="info-serata">
            <p class="event-place">${luogo}</p>
            <p class="event-date">${data}</p>
        </div>
        <div class="page-break"></div>
        ${textFiles.map((filePath, index) => generateHTMLForFile(filePath, index === totalSongs - 1)).join('')}
    </body>
    </html>
`;

// Il resto del codice rimane invariato
const outputFileName = data.replace(/\//g, '-')
fs.writeFileSync(outputFileName + '.html', htmlContent, 'utf8')

async function generatePDFFromHTML(htmlContent, outputPath) {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.setContent(htmlContent);



    await page.pdf({
        path: outputPath, // Nome del file PDF generato
        format: 'A4', // Formato della pagina
        printBackground: true, // Stampare lo sfondo (CSS)
        margin: {
            top: '40px',    // Margine superiore di 20mm
            bottom: '40px', // Margine inferiore di 20mm
            left: '40px',   // Margine sinistro di 10mm
            right: '40px'   // Margine destro di 10mm
        }
    });

    await browser.close();
}


generatePDFFromHTML(htmlContent, outputFileName + '.pdf')
    .then(() => {
        console.log('PDF generato con successo.');
    })
    .catch((error) => {
        console.error('Si è verificato un errore durante la generazione del PDF:', error);
    });
