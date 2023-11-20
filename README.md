# Prosjektoppgave-H23

I denne prosjektoppgaven skal vi lage en Q&A plattform. Prosjektoppgaven er en del vår bachelor i Informasjonsbehandling ved NTNU, i faget INFT2002 Webutvikling.  
I prosjektet skal vi utvikle en webapplikasjon hvor besøkende kan stille spørsmål, dele kunnskap og finne svar.

<p>
<img src="client/public/images/github2.jpeg" alt="QnA" width=500px />
</p>

- “YouKnow” (Bruker vi egt navnet??)  

- NTNU, Webutvikling  

- Q&A  

---


## Krav og betingelser for prosjektet: 

- Det skal være mulig å hente ut, opprette, endre og slette spørsmål.
- Det skal være mulig å søke etter spørsmål.
- Et spørsmål må ha en eller flere tagger.
- Systemet skal vise en liste over de mest populære spørsmålene (flest svar/visninger).
- Systemet skal vise en liste med alle ubesvarte spørsmål.
- Det skal være mulig å hente ut, legge til, endre og slette svar.
- Et svar skal kunne stemmes opp eller ned.
- Det skal være mulig å markere et svar som akseptert/best.
- Et svar skal kunne lagres som en favoritt og vises i en egen favoritt-liste.
- Det skal være mulig å sortere svar etter høyeste score eller sist endret.
- Det skal være mulig å gi kommentarer på både spørsmål og svar.
- Kommentarer skal kunne hentes ut, legges til, endres og slettes.
- Systemet skal vise en liste over alle unike tagger, inkludert antall spørsmål for hver tag.
- Listen med tagger må kunne filtreres på navn og sorteres etter popularitet.
--- 

## Installasjon
Før vi kan kjøre prosjektet, må vi installere noen avhengigheter. Dette gjøres ved at du kjører følgende kommandoer i terminalen:  
```
cd server  
npm install  

cd ../client  
npm install  
```
---

## Oppstart
I dette prosjektet kan man kjøre selve programmet for å sjekke ut nettsiden, eller så kan man kjøre noen tester. På samme måte som installasjonen, må du skrive kommandoene under i din terminal:  

### Kjøre programmet:  
```
cd server  
npm start  

cd ../client  
npm start  
```
### Kjøre tester:  
```
cd server  
npm test (får dobbelsjekke dette når koden er helt på plass)  
```
### Sette opp config.ts  

Følgende miljøvariabler må være satt for å konfigurere tilkoblingen:

```
process.env.MYSQL_HOST:'mysql.host.no' //Verten for MySQL-serveren.
process.env.MYSQL_USER:'' //Brukernavnet for databasetilkoblingen.
process.env.MYSQL_PASSWORD: //Passordet for databasetilkoblingen.
process.env.MYSQL_DATABASE: //Databasenavnet du vil koble til.
```
---
## Teknologier og verktøy  
### Klientsiden  
-React  
-React Router  
-Axios for nettverksforespørsler  
-Enzyme for testing  

### Serversiden  
-Express  
-MySQL for databasen  
-Axios for nettverksforespørsler  
-Babel for å transpilere TypeScript-kode  

---
## Medvirkende
<a href="https://github.com/ValentinRStoyanov">
  <img src="https://github.com/ValentinRStoyanov.png" alt="ValentinRStoyanov's GitHub Profile" height="200">
</a>

<a href="https://github.com/Kineaw">
  <img src="https://github.com/Kineaw.png" alt="Kineaw's GitHub Profile" height="200">
</a>

<a href="https://github.com/Frantheman1">
  <img src="https://github.com/Frantheman1.png" alt="Frantheman1's GitHub Profile" height="200">
</a>

<a href="https://github.com/Alimontan">
  <img src="https://github.com/Alimontan.png" alt="Alimontan's GitHub Profile" height="200">
</a>

## Lisens

Dette prosjektet har for øyeblikket ingen lisens. Alle rettigheter er forbeholdt.  

Dette betyr at du for øyeblikket ikke har tillatelse til å bruke, kopiere, modifisere eller distribuere koden.
Hvis du er interessert i å bidra til prosjektet eller bruke koden på noen måte, vennligst kontakt prosjekteierne for å diskutere lisensiering.  

Vi vurderer muligheten for å legge til en lisens i fremtiden. Takk for din forståelse.
