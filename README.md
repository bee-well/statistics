# Statistik Tjänst
Denna tjänst är ansvarig för att sammanställa statistik angående humördata baserat på ett visst tidsintervall. 
## REST API
Det finns endast en viktig endpoint i denna tjänst, den är beskriven nedan.
### GET /statistics 
Tar emot två stycken datum som query-variablar och returnerar statistik angående humördatan som har rapporterats under detta tidsintervall. 
#### Query-variablar
* `from`, ett datum som visar vilket datum att börja ifrån.
* `to`, ett datum som visar vilket datum att sluta på.
`to` kan lämnas tom eller icke-definierad, i detta fall kommer dagens datum att användas istället. 
#### Validation
`from` måste vara inkluderat och åtminstone en dag innan `to`. 
#### Respons
Datan som returneras från denna endpoint är planerad till att se ut som följande: 
```
{
    "averageMood": Integer,
    "bestWeekDay": String,
    "bestHour": String,
    "happiness": Integer,
    "reportAmount": Integer,
    "mostCommonTags": []String,
    "dataPoints": [
        {
            "date": String,
            "mood": Integer
        }
    ]
}
```
#### Exempel
`GET {url}/statistics?from=2006-02-01&to=2006-04-23`
## MQ
Denna tjänst lyssnar efter event på `moods`-kön. Den typen av event som denna tjänst lyssnar efter är `created`. När ett sådant event sker så sparar denna tjänst datan kring det rapporterade humöret i sin databas för att kunna använda denna i kompilationen av statistik under ett senare skede.
