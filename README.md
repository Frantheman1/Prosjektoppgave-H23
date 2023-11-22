<!-- 
title: README.md
author: Kine Weiseth
date: 22.11.2023
 -->

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

## Bilder og videoer fra webapplikasjonen

## Installasjon
Før vi kan kjøre prosjektet, må vi installere noen avhengigheter. Dette gjøres ved at du kjører følgende kommandoer i terminalen:  
```sh
cd server  
npm install  

cd ../client  
npm install  
```
---

## Oppstart
I dette prosjektet kan man kjøre selve programmet for å sjekke ut nettsiden, eller så kan man kjøre noen tester. På samme måte som installasjonen, må du skrive kommandoene under i din terminal:  

### Start programmet:  
```sh
cd server  
npm start  

cd ../client  
npm start  
```
### Kjøre tester:  
Du kan her kjøre tester på server
```sh
cd server  
npm test
```
Og du kan kjøre tester på klient
```sh
cd client  
npm test
```
### Sette opp config.ts  

Du må få satt opp to konfigurasjonsfiler for å opprette en database forbindelse. Her er et eksempel på hvordan de kan se ut:  

`server/config.ts`:
```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'username_todo_dev';
```  

`server/test/config.ts`:
```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'username_todo_test';
```  

Det er viktig at disse ikke blir lastet opp på git, så disse filene burde legges inn i en gitignore fil.  


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
-Jest for testing  

---

## API-calls

### Answers

| Method  | Endpoint | Description |
| --- | --- | --- |
| GET | /api/v1/answers/:answerId | Get a specific answer |
| GET | api/v1/answers/question/:questionId | Get all answers for a specific question |
| POST | /api/v1/answers | Add a new answer |
| PUT | /api/v1/answers/:answerId | Update an existing answer |
| DELETE | /api/v1/answers/:answerId | Delete an existing answer |
| PUT | /api/v1/answers/:answerId/accept | Toggle the accepted state of a specific answer |
| GET | /api/v1/answerCounts | Get the count of answers per question |

### Comments

| Method  | Endpoint | Description |
| --- | --- | --- |
| GET | /api/v1/comments | Get all comments |
| GET | /api/v1/comments/:answerId | Get a specific comment |
| POST | /api/v1/comments | Add a new comment |
| PUT | /api/v1/comments/:commentId | Update an existing comment |
| DELETE | /api/v1/comments/:answerId | Delete an existing comment |

### Favorites

| Method  | Endpoint | Description |
| --- | --- | --- |
| GET | /api/v1/favorites/:userId | Get all favorites for a specific user |
| POST | /api/v1/favorites | Add a new favorite answer for a specific user |
| DELETE | /api/v1/favorites | Remove a favorite answer for a specific user |

### Questions

| Method  | Endpoint | Description |
| --- | --- | --- |
| GET | /api/v1/questions | Get all questions |
| GET | /api/v1/questions/:id | Get a specific question |
| POST | /api/v1/questions | Add a new question |
| PUT | /api/v1/questions/:id | Update an existing question |
| PUT | /api/v1/updateViewCount | Update ViewCount on question view |
| DELETE | /api/v1/questions/:id | Delete a specific question |

### Tags

| Method  | Endpoint | Description |
| --- | --- | --- |
| GET | /api/v1/tags/question/:questionId | Get tags for a specific question |
| POST | /api/v1/tags/question | Add tags to a question |
| GET | /api/v1/tags/count | Get all tags with question count |

### Votes

| Method  | Endpoint | Description |
| --- | --- | --- |
| POST | /api/v1/votes/:answerId | Add vote to a specific answer |


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

Dette prosjektet er lisensiert under MIT license - se [LICENSE](https://github.com/Frantheman1/Prosjektoppgave-H23/blob/dev/LICENSE) for detaljer på dette. // TO-DO: Endre sti om vi pusher til main

## Kontakt oss

### Valentin
- Email: @stud.ntnu.no

### Kine Weiseth
- Email: kineawe@stud.ntnu.no

### Fraan
- Email: francvi@stud.ntnu.no

### Ali
- Email: alimm@stud.ntnu.no
