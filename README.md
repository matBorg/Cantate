# Come usare il programma

Prima di tutto installa node.js e tutte le dependencies.

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



### Non tutti i testi delle canzoni vengono trovati automaticamente

Se ciò dovesse succedere, crea manualmente un file txt che ha come nome il titolo della canzone che vuoi ("nomeCanzone.txt"), per far riconoscere il ritornello al programma aggiungi la scritta [Ritornello] prima del ritornello, con un a capo. Fai la stessa cosa con le strofe, aggiungendo [Strofa].
Inoltre se una canzone non ha autore perchè è un canto popolare o perchè non sai chi l'abbia scritta metti come prima riga il titolo, uno spazio ed il carattere |. Così nel pdf vedrai soltanto il titolo della canzone senza autore.
Ecco un esempio di come scrivere il testo di una canzone manualmente:


Se està quedando la unión |

[Strofa]
Se está quedando la Unión
Como un corral sin gallinas
Se está quedando la Unión
Como un corral sin gallinas
Con tanto minero enfermo
En el fondo de la mina
Con tanto minero enfermo
En el fondo de la mina
[Ritornello]
Canta que mi candil luce poco
No tengo mas aceite
El que más tiene es el otro
Canta que mi candil luce poco
Y no tengo mas aceite
El que más tiene es el otro
[Strofa]
Manda pregonar el rey
Por Granada y por Sevilla
Manda pregonar el rey
Por Granada y por Sevilla
Que todo hombre enamorado

etc etc...