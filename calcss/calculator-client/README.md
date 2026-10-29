# calculator-client

Client Angular 20 de l'API REST `calculator-api` (SEG3502, laboratoire 6). Chaque calcul envoie une requête `GET calculator/{operation}/{nombre1}/{nombre2}` à l'API Spring Boot et affiche la réponse.

## Lancer le client

L'API doit tourner sur http://localhost:8080 (voir le README à la racine du dépôt).

```bash
npm install
npx ng serve
```

Puis ouvrir http://localhost:4200/.

## Structure

| Fichier | Rôle |
|---|---|
| `src/app/service/calculator-service.ts` | Appels `HttpClient` vers les quatre routes, gestion des erreurs, état de la connexion |
| `src/app/calculator/*` | Formulaire réactif : deux nombres, choix de l'opération, aperçu de la requête |
| `src/app/calculation-result/*` | Carte Résultat : valeur, code HTTP, réponse brute, explication des erreurs |
| `src/app/request-history/*` | Tableau des dernières requêtes avec leur réponse et leur code HTTP |
| `src/app/model/*` | Types `Operation` et `Calculation` |
| `src/styles.css` | Variables de couleurs, polices Barlow et JetBrains Mono, styles communs |

## Tests

```bash
npx ng test --watch=false
```
