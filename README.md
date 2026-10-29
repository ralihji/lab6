# SEG3502 · Laboratoire 6 : service Web REST Calculator

Service Web REST de calculatrice développé avec **Spring Boot** (Kotlin) et documenté avec **OpenAPI**, accompagné d'un **client Angular** qui appelle l'API.

**Équipe** : Brayan Adou (300433616) · Hjiyej Andaloussi Elghali (300379897)

## Contenu du dépôt

| Dossier | Rôle |
|---|---|
| `calcss/calculator-api` | API REST Spring Boot 4 (Kotlin) : les quatre opérations, la gestion des erreurs, la documentation OpenAPI et les tests |
| `calcss/calculator-client` | Client Angular 20 de l'API : formulaire, résultat, historique des requêtes et design (HTML/CSS) |

## Routes de l'API

| Méthode | Route | Exemple | Réponse |
|---|---|---|---|
| GET | `/calculator/add/{nombre1}/{nombre2}` | `/calculator/add/2/3` | `5.0` |
| GET | `/calculator/subtract/{nombre1}/{nombre2}` | `/calculator/subtract/10/4` | `6.0` |
| GET | `/calculator/multiply/{nombre1}/{nombre2}` | `/calculator/multiply/2.5/4` | `10.0` |
| GET | `/calculator/divide/{nombre1}/{nombre2}` | `/calculator/divide/7/2` | `3.5` |

Erreurs :

- une division par zéro (`/calculator/divide/5/0`) renvoie le code `400` avec le message `Division by zero is not allowed` ;
- un nombre invalide (`/calculator/add/abc/2`) renvoie le code `400` avec le message `Unable to process request`.

Documentation OpenAPI, une fois l'API démarrée :

- JSON : http://localhost:8080/v3/api-docs
- YAML : http://localhost:8080/v3/api-docs.yaml
- Swagger UI : http://localhost:8080/swagger-ui.html

## Prérequis

- JDK 17 ou plus récent (le wrapper `gradlew` télécharge Gradle tout seul)
- Node.js 20.19 ou plus récent, avec npm
- Git

## 1. Démarrer l'API

```bash
cd calcss/calculator-api
./gradlew bootRun          # Windows (PowerShell) : .\gradlew.bat bootRun
```

L'API écoute sur http://localhost:8080. Pendant que l'API tourne, la progression de Gradle reste vers 80 % : c'est normal.

## 2. Démarrer le client Angular (dans un deuxième terminal)

```bash
cd calcss/calculator-client
npm install
npx ng serve               # ou : npm start
```

Ouvrir http://localhost:4200/ dans un navigateur. Le bandeau affiche « API en ligne » quand l'API répond.

Le client et l'API tournent sur deux origines différentes (ports 4200 et 8080). L'annotation `@CrossOrigin("http://localhost:4200")` placée sur `CalculatorController` autorise ces appels (CORS).

## Tests et compilation

```bash
cd calcss/calculator-api
./gradlew build                  # compile et lance les 7 tests de l'API

cd calcss/calculator-client
npx ng test --watch=false        # 9 tests : service HTTP, calculatrice, application
npx ng build                     # version de production dans dist/calculator-client
```
