<div align="center">
  
# Globetrotter A travel Quiz app 
  
 Have a look at the live demo of [Globetrotter](https://globetrotter-fe-psi.vercel.app/).
 
 
</div>

Note: Please don't abuse the API's request since I have deployed the backend on Render (free service), and it takes a lot of time to process the request. You might face a bit latency while consuming the requests, Supabase's api latency is very low and good in terms of Render 


## 📱 Game Flow

1. Enter username to start
2. Receive clues about a city
3. Choose from options and get immediate feedback about selection
4. Get immediate feedback and fun facts
5. Share your score and challenge friends
6. WhatsApp and share link support 


## Run Locally

Clone the project

```bash
  git clone https://github.com/mehulsatardekar/globetrotter_BE.git
```

Go to the project directory

```bash
  cd globetrotter_BE
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```



```bash
  npm run dev
```

Tech Specification and Tools
For BE: We have used Express and supabase for the database 
For FE: Nextjs, 

```bash
Add .env file to the root folder
PORT=3001
SUPABASE_URL= your Supabase url
SUPABASE_ANON_KEY= your Supabase anon key
```
[How to initialize & add keys to the app in supabase](https://supabase.com/docs/reference/javascript/initializing)


### FE Repo : [Frontend](https://github.com/mehulsatardekar/globetrotter_FE)
### BE Repo : [Backend](https://github.com/mehulsatardekar/globetrotter_BE)

## Tech Stack

- **Client:** Nextjs, React, axios, react-confetti, typescript
- **Backend-(DB):** Supabase  (postgres-sql), express
- **Cloud & Infra:** Vercel for Frontend render for backend deployment

## Database Schema
![globetrotter-db-schema](https://github.com/user-attachments/assets/09b42a14-97cf-4fe4-9bfb-5406e0d279df)





