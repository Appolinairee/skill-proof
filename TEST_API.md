# Test de l'API /api/extract

Pour tester l'API d'extraction, vous pouvez utiliser curl ou Postman.

## Exemple avec curl

```bash
curl -X POST http://localhost:3000/api/extract \
  -F "name=John Doe" \
  -F "githubUrl=https://github.com/octocat" \
  -F "cv=@/path/to/your/cv.pdf" \
  -F "linkedinText=Développeur fullstack avec 5 ans d'expérience..."
```

## Exemple avec un fichier test

1. Créez un fichier texte simple comme CV de test:
```
Compétences:
- JavaScript
- TypeScript
- React
- Node.js

Expérience:
Développeur Frontend chez TechCorp (2020-2023)
- Développement d'applications React
- Migration vers TypeScript
```

2. Testez avec:
```bash
curl -X POST http://localhost:3000/api/extract \
  -F "name=Test User" \
  -F "githubUrl=appolinairee" \
  -F "cv=@test-cv.txt"
```

## Réponse attendue

```json
{
  "success": true,
  "data": {
    "sources": {
      "name": "Test User",
      "cv": {
        "rawText": "...",
        "sections": {
          "skills": "...",
          "experience": "..."
        }
      },
      "github": {
        "username": "appolinairee",
        "repos": [...],
        "topLanguages": {...}
      }
    },
    "analysis": {
      "skills": [
        {
          "name": "TypeScript",
          "category": "language",
          "confidence": 85,
          "sources": ["cv", "github"]
        },
        ...
      ],
      "summary": "..."
    }
  }
}
```
