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

## Controllers
compile-mood tar in datan från services/compile-mood, validerar med Date och om allt stämmer ges respons 200 och det "compilade" moodet. 
on-mood-reported tar emot datan från mood(som användaren har registrerat) och bygger ihop dessa till ett mood(payload). 

## Domain
mood lägger till user, mood, tags och reported(tidpunkten/Date) med hjälp av ett schema för att spara i databasen.  

## Middlewares
protected används för att verifiera webtoken så att det är rätt/samma användare och att tokenet inte har ändrats eller inte stämmer. 

## Services
Används för att sammanställa ett mood tillsammans med tidpunkten. Här finns även metoderna för uträkning av olika sorters statistik som till exempel hitta bästa veckodagen och 
mest vanliga taggen. 
Test-tjänsten används för automatiserade tester. Med hårdkodade användare, moods, tags och datum testas statistikmetoderna och resultaten kontrolleras mot de förväntade värdena. 
