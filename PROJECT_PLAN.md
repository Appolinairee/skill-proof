# TRUTHSTACK — Plan de projet (MVP 10h)

Ce document décrit les étapes détaillées pour livrer une version MVP de TruthStack en 10 heures, les critères d'acceptation, la répartition du temps et les étapes post-MVP.

## Rappel du concept
Plateforme AI qui révèle, valide et optimise les compétences réelles en croisant plusieurs sources de données : CV (PDF/DOCX), GitHub, LinkedIn, blogs/portfolios, et nom.

Outputs (MVP minimum):
- TruthProfile (skills extraits, skills inférés, score par skill avec badges: Prouvé/Declaré/Surestimé)
- CV régénéré (HTML preview + export PDF) avec badges
- Gap Analysis de base (vs job description)
- Roadmap minimal (ressources courtes + temps estimé)
- Flow interactif de questions (localStorage)

## Contrat technique (petit contrat pour chaque API/feature)

- Extraction API
  - Input: {cvFile?: File, githubUrl?: string, linkedInText?: string, name?: string}
  - Output: {skills: [{name, sourceFlags, confidence, badge, evidence}], profileSummary, rawText}
  - Erreurs: 400 pour entrée invalide, 502 pour LLM non disponible

- Scoring
  - Priorité: GitHub proof > CV/LinkedIn declared > LLM inference
  - Badge rules: Proven (evidence code + repo files), Declared (only CV/LinkedIn), Overstated (contradiction / low evidence but strong claim)

## Edge cases & risques
- CV illisible / mauvaise OCR -> proposer upload alternatif
- GitHub privé / rate-limiting -> fallback: user asks to provide token or skip
- Langues mixtes (fr/en) -> prioriser langue détectée, normaliser
- Données sensibles -> rien de stocké côté serveur (localStorage only). Si besoin de stockage, lister étapes d'opt-in.

## 10h plan (découpage horaire estimé)

Phase A — Préparation & plan (30 min)
- Créer ce fichier et todo list (fait)
- Définir env vars et .env.example

Phase B — MVP core (3h30)
1. Setup dev & dépendances (30 min)
   - Tailwind (déjà présent), installer pdf/text parser (pdf-parse / mammoth), GitHub client
2. API extraction scaffold (1h)
   - Next.js API route `/api/extract` avec un adapter LLM mock (retourne JSON example)
3. GitHub fetch helper (45 min)
   - Fetch public repo list, languages, README content, topics. Simple heuristics pour evidence.
4. File upload & PDF->text (35 min)
   - Accept upload, parse to text, return to LLM adapter

Phase C — Frontend MVP (3h)
1. Page d'entrée `/profile-builder` (45 min)
   - Form: upload CV, GitHub URL, LinkedIn text, Nom
2. Results page (1h)
   - Afficher TruthProfile minimal: skills list, badges, confidence bar
3. CV regen HTML preview + print to PDF (45 min)
4. Interactive Qs (30 min)
   - 3-5 questions simple, save in localStorage, resubmit

Phase D — Scoring, Gap & Roadmap (1h30)
1. Scoring rules implementation (40 min)
2. Gap analysis (JD paste -> token match + LLM assist) (30 min)
3. Roadmap minimal (resources static mapping + LLM fallback) (20 min)

Phase E — Tests, docs & polish (1h)
1. Unit tests for scoring (30 min)
2. README + .env.example (20 min)
3. Small UI polish & accessibility checks (10 min)

## Acceptation MVP (critères mesurables)
- End-to-end run with mock LLM: upload a CV + GitHub URL -> see at least 5 extracted skills with badges.
- CV preview generates printable HTML with badges.
- Gap analysis highlights at least 3 missing skills when pasting a JD.
- Roadmap returns at least 1 resource per missing skill.

## Détails techniques et fichiers ciblés
- API routes: `pages/api/extract.ts` (ou `app/api/extract/route.ts`) — adapter selon structure Next.js
- Frontend pages: `app/page.tsx` (landing), `app/profile-builder/page.tsx`, `app/results/page.tsx`
- Components: réutiliser `components/base/*` (Badge, Card, Button)
- GitHub helper: `lib/github.ts` ou `utils/github.ts`
- PDF/DOCX parser: `lib/parseDoc.ts`
- LLM adapter: `lib/llmAdapter.ts` (mock implementation + real provider switch)

## Backlog post-MVP (priorisé)
1. Add real LLM provider adapters (Claude/Gemini) + batching & cost controls
2. Improve GitHub evidence heuristics (test detection, commit analysis)
3. Add other sources: blog crawl, portfolio scraping
4. Multi-language advanced parsing and NER
5. User accounts & opt-in storage

## Checklist initiale (actions immédiates)
- [x] Confirmer provider LLM et si on a clés API
- [x] Confirmer priorité: GitHub proof or CV-first? (pour heuristiques)
- [x] Autoriser usage de localStorage seulement (no DB) — confirmer

## Décisions techniques confirmées (9 nov 2025)

### 1. LLM Provider
**Gemini (Google Cloud API)** — clé API disponible
- Adapter prioritaire pour extraction et validation
- Fallback mock pour dev/tests locaux
- Config dans `.env` : `GOOGLE_CLOUD_API_KEY`

### 2. Langue
**Français** — langue principale
- Interface en français
- Parsing multilingue (CV peut être en FR/EN)
- Fallback anglais pour erreurs techniques

### 3. GitHub repos privés
**Non** pour MVP — feature post-MVP
- MVP = repos publics uniquement
- Backlog: support token utilisateur pour repos privés

### 4. CV régénéré
**Client-side HTML → print** pour MVP
- Génération HTML avec badges dans le navigateur
- Bouton "Imprimer en PDF" (via window.print)
- Pas de génération server-side pour MVP

### 5. UX cible
**Développeurs d'abord** — puis généralisation
- Interface technique mais claire
- Terminologie dev-friendly (repos, commits, languages)
- Polish pour non-tech en phase 2

---

## Questions sur l'approche technique

### Architecture & flow

**Q1 - Pipeline d'extraction**  
Comment veux-tu orchestrer l'extraction multi-sources ?
- **Option A** : Séquentiel (GitHub → CV → LinkedIn → merge)
- **Option B** : Parallèle (fetch all → merge avec poids)
- **Option C** : Lazy (start with CV → enrich progressivement)

**Q2 - Matching des skills**  
Comment valider qu'une compétence GitHub correspond au CV ?
- **Option A** : Exact match (JavaScript === JavaScript)
- **Option B** : Fuzzy match + synonymes (JS ≈ JavaScript ≈ Node.js)
- **Option C** : LLM-based semantic match (Gemini compare)

**Q3 - Skill taxonomy**  
Comment structurer les compétences ?
- **Option A** : Flat list (TypeScript, React, Docker...)
- **Option B** : Catégories (Languages / Frameworks / Tools / Soft skills)
- **Option C** : Graphe de dépendances (React → JavaScript, Next.js → React)

### Scoring & validation

**Q4 - Confidence scoring**  
Comment calculer le score de confiance (0-100%) ?
```
Exemple: TypeScript
- GitHub: 3 repos TypeScript + 500 commits → +60%
- CV: mentionné 2x dans expériences → +20%
- LinkedIn: dans compétences → +10%
Total: 90% = Proven
```
Veux-tu que je :
- Propose une formule simple (weighted sum) ?
- Laisse Gemini décider du score ?
- Mix (heuristiques + LLM ajustement) ?

**Q5 - Badge rules**  
Critères exacts pour les badges ?
```
Proven (🟢) : score ≥ 70% + evidence GitHub
Declared (🟡) : score 40-69% OU pas de GitHub proof
Overstated (🔴) : score < 40% OU contradiction détectée
```
Ça te va ou tu veux ajuster les seuils ?

### Gap Analysis & Roadmap

**Q6 - Job description parsing**  
Pour extraire les skills d'une JD, on fait :
- **Option A** : Gemini extraction pure (prompt: "liste skills requis")
- **Option B** : Regex patterns + keywords + Gemini validation
- **Option C** : Match avec une ontologie de skills prédéfinie

**Q7 - Roadmap resources**  
Pour recommander des ressources, priorité ?
- **Option A** : Curated list statique (JSON mapping skill → ressources)
- **Option B** : Gemini génère des recommandations custom
- **Option C** : Appels API externes (Udemy, Coursera, etc.) — (probablement trop pour MVP)

### Questions Interactive

**Q8 - Type de questions**  
Quelles questions poser pour affiner le profil ?
Exemples:
- "As-tu déjà travaillé en production avec Docker ?"
- "Combien d'années d'expérience en React ?"
- "Préfères-tu frontend, backend ou fullstack ?"
- "Quel projet t'a le plus challengé ?"

Tu veux :
- Questions fermées (oui/non, échelle 1-5) ?
- Questions ouvertes (texte libre analysé par Gemini) ?
- Mix ?

### Priorités d'implémentation

**Q9 - First slice scope**  
Pour le premier incrément (3h), focus minimal:
```
Input: GitHub URL + CV upload
Output: Liste skills avec badges + evidence (sans roadmap/gap)
```
Ou tu veux déjà inclure LinkedIn parsing dans le first slice ?

**Q10 - Mock vs Real dès le début**  
Tu veux que je :
- **Option A** : Développe avec mock Gemini d'abord, puis branch real API ?
- **Option B** : Intègre Gemini real dès le début (je code l'adapter direct) ?

---

## Ma recommandation technique (si tu veux aller vite)

- **Pipeline** : Parallèle (Q1-B) — plus scalable
- **Matching** : Fuzzy + LLM fallback (Q2-B) — meilleur UX
- **Taxonomy** : Catégories simples (Q3-B) — plus lisible
- **Scoring** : Mix heuristiques + Gemini ajustement (Q4-C) — balance speed/quality
- **Badges** : Seuils proposés OK (Q5)
- **JD parsing** : Gemini extraction pure (Q6-A) — simple et flexible
- **Roadmap** : Curated list + Gemini enrichment (Q7-B hybrid)
- **Questions** : Mix fermées/ouvertes (Q8-C) — 3 fermées + 2 ouvertes
- **First slice** : GitHub + CV uniquement (Q9) — MVP minimal
- **Mock/Real** : Mock d'abord (Q10-A) — safer pour itérer

Dis-moi ce que tu en penses et je démarre ! 🚀
