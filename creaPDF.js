const fs = require('fs');
const path = require('path'); // Rinomina la variabile path
const puppeteer = require('puppeteer');


const filePath = './infoCantata.json';
const rawData = fs.readFileSync(filePath, 'utf-8');
const info = JSON.parse(rawData);

const luogo = info.luogo;
const data = info.data;
const orario = info.orario;
const canzoni = info.canzoni;

// Parsifica il contenuto JSON

const styles = `
  <style>
    .title { font-size: 18px; font-weight: bold; margin: 10px 0; }
    .author { font-size: 14px; margin: 10px 0; }
    .chorus { font-size: 16px; font-style: italic; margin: 10px 0; }
    .verse { font-size: 16px; margin: 10px 0; }
    pre { white-space: pre-wrap; font-size: 16px; margin: 10px 0; }

    .info-serata {
        text-align: center;
        font-size: 24px;
        margin-top: 100px;
      }
    
    .title-author {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        margin-top: 20px;
      }
      .title { 
        font-size: 18px; 
        font-weight: bold; 
        margin: 0;
      }
      .author { 
        font-size: 14px; 
        margin: 0;
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
         | 
        <span class="author">${author}</span>
      </div>
    </div>
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
        ${styles}
    </head>
    <body>
        <div class="song-info">
            <p>Luogo: ${luogo}</p>
            <p>Data: ${data}</p>
            <p>Ora: ${orario}</p>
        </div>
        <div class="page-break"></div>
        ${textFiles.map((filePath, index) => generateHTMLForFile(filePath, index === totalSongs - 1)).join('')}
    </body>
    </html>
`;

// Il resto del codice rimane invariato

fs.writeFileSync('output.html', htmlContent, 'utf8')

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

// Utilizza la funzione per generare il PDF

generatePDFFromHTML(htmlContent, 'output.pdf')
    .then(() => {
        console.log('PDF generato con successo.');
    })
    .catch((error) => {
        console.error('Si è verificato un errore durante la generazione del PDF:', error);
    });
