# Fullstack 2 projektin palautus repository

## Projektin käynnistäminen Dockerilla

### Kloonaa repository ja siirry kansioon
```bash
git clone https://github.com/mvento-lapinamk/full-stack-ohjelmointi-2-ryhma-1-projekti.git
cd full-stack-ohjelmointi-2-ryhma-1-projekti
```
### Aja docker komento
```bash
docker compose up --build

```


    
## Projektin käynnistäminen lokaalisti (npm)
```bash
git clone https://github.com/mvento-lapinamk/full-stack-ohjelmointi-2-ryhma-1-projekti.git
cd full-stack-ohjelmointi-2-ryhma-1-projekti
```

### Asenna ensin Backend riippuvuudet ja käynnistä.
```bash
cd Backend  
npm i  
npm run dev
```

### Kun Backend on käynnissä. Avaa uusi terminaali ja suorita
```bash
cd Frontend  
npm i  
npm run dev
```

### Avaa selain ja siirry osoitteeseen
```bash
http://localhost:5173
```

