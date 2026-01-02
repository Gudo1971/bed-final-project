StayBnB Backend API
Backend API ontwikkeld voor de Winc Academy Backend Assignment.
De API ondersteunt gebruikers, hosts, properties, bookings en reviews.
Alle functionaliteit is getest met Postman (positive en negative test suites).

Inhoudsopgave
Overzicht

Technologieën

Installatie

Environment variables

Database setup

Server starten

Login endpoint

Postman testinstructies

API referentie

Database schema

Projectstructuur

Notities voor de mentor

1. Overzicht
Deze backend is gebouwd met Express en Prisma.
De database is een lokale SQLite database (winc.db).
Alle CRUD‑operaties zijn geïmplementeerd en volledig getest.
De API bevat een werkende login die een JWT token retourneert.

2. Technologieën
Node.js

Express

Prisma ORM

SQLite

JSON Web Tokens (JWT)

Postman (Newman CLI voor testautomatisering)

3. Installatie
Clone de repository en installeer dependencies:

Code
git clone <repository-url>
cd backend
npm install
4. Environment variables
Maak een .env bestand aan in de backend map met de volgende inhoud:

Code
DATABASE_URL="file:./prisma/winc.db"
JWT_SECRET="dev-secret"
Toelichting:

DATABASE_URL verwijst naar de lokale SQLite database die Prisma gebruikt

JWT_SECRET wordt gebruikt om tokens te signen tijdens login

5. Database setup
Prisma genereren
Code
npx prisma generate
Database migreren
Code
npx prisma migrate dev --name init
Database seeden
Code
npm run seed
De seed maakt alle testdata aan die nodig is voor de Postman tests.

6. Server starten
Start de server in development mode:

Code
npm run dev
De server draait op:

Code
http://localhost:3000
7. Login endpoint
Endpoint
Code
POST /login
Body (vereist door Winc tests)
Code
{
  "email": "testuser@example.com",
  "password": "123456"
}
Response
Code
{
  "token": "<jwt-token>"
}
De token wordt gebruikt voor alle beveiligde endpoints.

8. Postman testinstructies
De backend bevat twee Postman collecties:

Bookings API.json  (positive tests)

Bookings API Negative.json  (negative tests)

Local.postman_environment.json (environment)

Alle tests draaien via NPM
Code
npm run test
Dit voert automatisch uit:

Code
npm run test-positive
npm run test-negative
Alle tests slagen volledig.

9. API referentie
Users
Methode	Endpoint	Beschrijving
GET	/users	Haal alle users op
GET	/users/:id	Haal user op ID op
POST	/users	Maak een nieuwe user
PUT	/users/:id	Update user op ID
DELETE	/users/:id	Verwijder user op ID
Hosts
Methode	Endpoint	Beschrijving
GET	/hosts	Haal alle hosts op
GET	/hosts/:id	Haal host op ID op
POST	/hosts	Maak een nieuwe host
PUT	/hosts/:id	Update host op ID
DELETE	/hosts/:id	Verwijder host op ID
Properties
Methode	Endpoint	Beschrijving
GET	/properties	Haal alle properties op
GET	/properties/:id	Haal property op ID op
POST	/properties	Maak een nieuwe property
PUT	/properties/:id	Update property op ID
DELETE	/properties/:id	Verwijder property op ID
Bookings
Methode	Endpoint	Beschrijving
GET	/bookings	Haal alle bookings op
GET	/bookings/:id	Haal booking op ID op
POST	/bookings	Maak een nieuwe booking
PUT	/bookings/:id	Update booking op ID
DELETE	/bookings/:id	Verwijder booking op ID
Reviews
Methode	Endpoint	Beschrijving
GET	/reviews	Haal alle reviews op
GET	/reviews/:id	Haal review op ID op
POST	/reviews	Maak een nieuwe review
PUT	/reviews/:id	Update review op ID
DELETE	/reviews/:id	Verwijder review op ID

10. Database schema
Het Prisma schema definieert de volgende modellen:

User

Host

Property

Booking

Review

Relaties:

Een User kan meerdere Bookings en Reviews hebben

Een Host kan meerdere Properties hebben

Een Property kan meerdere Bookings en Reviews hebben

Een Booking hoort bij één User en één Property

Een Review hoort bij één User en één Property

Het volledige schema staat in:

Code
prisma/schema.prisma
11. Projectstructuur
Code
backend/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── lib/
│   └── server.js
│
├── postman/
│   ├── collections/
│   └── environments/
│
└── package.json
12. Notities voor de mentor
Alle endpoints zijn volledig getest met Postman

Zowel positive als negative test suites slagen

Database is consistent en volledig seedbaar

Login werkt met plaintext wachtwoorden zoals vereist door de seed

Project volgt een duidelijke en Express + Prisma structuur

