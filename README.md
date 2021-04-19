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
