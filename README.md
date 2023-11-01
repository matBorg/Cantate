# Come usare il programma

Crea una cartella chiamata "Canzoni", che contiene tutti i canti che verranno scaricati dal programma trovaCanzoni.js
Crea un file chiamato infoCantata.json che deve essere strutturato così:

{
    "luogo": "",
    "data": "",
    "orario": "",
    "canzoni": {
        "Titolo": "autore prima canzone",
        "Titolo seconda canzone": "autore seconda canzone",
        ...
        "Titolo ultima canzone": "autore ultima canzone"
    }
}

(ps ricorda di mettere le canzoni nell'ordine in cui vorresti vederle dentro al pdf)

Avvia il programma creaPDF.js
Ora si possono verificare due casi:

1. Tutte le canzoni che hai indicato nel tuo file sono presenti dentro la cartella "Canzoni", quindi il tuo pdf è pronto
2. Mancano alcune canzoni


Nel caso mancassero alcune canzoni verrà automaticamente creato un file "canzoniDaScaricare.json" dove troverai le canzoni che devono ancora essere scaricate. Quindi avvia il programma "trovaCanzoni.js" ed a questo punto possono verificarsi due casi:
1. Non ci sono errori. Quindi le canzoni sono state correttamente scaricate e ti basta avviare di nuovo il programma "creaPDF.js" per avere il tuo pdf
2. Il programma non funziona, questo è dovuto quasi sicuramente ad un errore nel come hai scritto qualche titolo o qualche nome di band o autore. 
