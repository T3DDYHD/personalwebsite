# README

## T3DDYUHD Personlig Hjemmeside V1  

### Beskrivelse
Dette projekt er en dynamisk webapplikation, der fungerer som en brugerprofil. Den inkluderer:
- En baggrundsvideo for visuelt engagement.
- En live viewer-tæller for realtidsstatistik.
- Integration af Discord-statusopdateringer.

### Forudsætninger
For at køre dette projekt skal følgende være installeret:

- **Node.js** (version 14 eller nyere)
- **npm** (Node Package Manager, som følger med Node.js)
- En internetforbindelse til at hente nødvendige ressourcer

**Bemærk:** Applikationen kører som standard over en IP-adresse. Hvis du ønsker at køre den via et domænenavn, kan du læse og selv finde ud af det [her](https://dextrop.medium.com/deploy-your-node-js-application-on-a-domain-c68900b7535f).

### Installation

Følg disse trin for at installere og starte projektet:

1. **Klon repositoryet eller download filerne:**
   ```bash
   git clone https://github.com/T3DDYHD/personalwebsite.git
   ```

2. **Installer de nødvendige pakker:**
   Kør følgende kommandoer i projektmappen:
   ```bash
   npm install express
   npm install axios
   npm install --save-dev nodemon
   npm install dotenv
   npm install cors
   ```
### Customize den til dine behov
- **Du kan selv vælge at uploade en video på:** [Five Manage](https://fivemanage.com/)
```
{
    "backgroundVideo": "https://r2.fivemanage.com/DoYALrlzky4ByIcbQU4B3/video/LetGo.mp4",
    "logo": "https://cdn.discordapp.com/avatars/513639579715371009/0936665370f736a7ba3c3618f19abee5.png?size=1024",
    "username": "Ditnavn her",
    "socialLinks": [
        {
            "icon": "fab fa-spotify",
            "url": "https://spotify.com",
            "color": "#1db954"
        },
        {
            "icon": "fab fa-twitter",
            "url": "https://twitter.com",
            "color": "#00acee"
        },
        {
            "icon": "fab fa-youtube",
            "url": "https://youtube.com",
            "color": "#ff0000"
        }
    ]
}
```
### Kørsel af projektet

1. Opret en `.env`-fil i projektets rodmappe og tilføj de nødvendige miljøvariabler (eksempelvis API-nøgler eller konfigurationsindstillinger).
2. Start serveren ved hjælp af Nodemon:
   ```bash
   npx nodemon app.js
   ```
3. Åbn din browser og naviger til den angivne IP-adresse eller domæne for at se applikationen i aktion.

### Yderligere information
Hvis du oplever problemer eller har spørgsmål, er du velkommen til at oprette en [issue](https://github.com/T3DDYHD/personalwebsite/issues) i repositoryet.

**God fornøjelse!**
