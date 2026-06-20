# Checklist SEO et visibilité IA

## Variables de production

Configurer sur le frontend :

```text
NEXT_PUBLIC_APP_URL=https://studio-volante.fr
COMING_SOON=true
NEXT_PUBLIC_STUDIO_LEGAL_NAME=
NEXT_PUBLIC_STUDIO_STREET_ADDRESS=
NEXT_PUBLIC_STUDIO_POSTAL_CODE=
NEXT_PUBLIC_STUDIO_CITY=Paris
NEXT_PUBLIC_STUDIO_ADDRESS_LABEL=
NEXT_PUBLIC_STUDIO_PHONE=
NEXT_PUBLIC_SOCIAL_PROFILES=https://...,https://...
NEXT_PUBLIC_HERO_VIDEO_POSTER_URL=https://...
INDEXNOW_KEY=
```

`NEXT_PUBLIC_SOCIAL_PROFILES` doit uniquement contenir les profils officiels de
Studio Volante. L'adresse structurée n'est publiée que lorsque ses champs sont
renseignés.

Configurer la même valeur `INDEXNOW_KEY` dans `volante-web-admin`, ainsi que
`FRONTEND_APP_URL=https://studio-volante.fr`. Sans cette clé, les notifications
IndexNow sont simplement désactivées.

## Avant le lancement

1. Déployer la migration Prisma `20260620180000_add_project_case_study_fields`.
2. Compléter les réalisations publiées dans l'onglet « Etude de cas » de
   l'administration. Ne publier que des clients, résultats et distinctions
   vérifiables.
3. Vérifier `/robots.txt`, `/sitemap.xml` et `/opengraph-image` sur la preview.
   Le sitemap est volontairement vide tant que `COMING_SOON=true`.
4. Vérifier que la page d'attente contient une directive `noindex`.

## Lancement

1. Passer `COMING_SOON=false` et redéployer.
2. Contrôler sans cookie de preview que `/`, `/en`, `/portfolio` et une
   réalisation renvoient le contenu final.
3. Créer et vérifier les propriétés de domaine dans Google Search Console et
   Bing Webmaster Tools.
4. Soumettre `https://studio-volante.fr/sitemap.xml` aux deux outils.
5. Inspecter puis demander l'indexation de l'accueil, des pages services et
   portfolio, et de deux réalisations représentatives.
6. Créer ou compléter Google Business Profile avec le même nom, la même adresse,
   le même téléphone et le même site.

## Contrôle mensuel

- Couverture d'indexation, erreurs sitemap et Core Web Vitals dans Search Console.
- Impressions et clics Web/Chat dans Bing Webmaster Tools.
- Requêtes de marque et requêtes métier en français et en anglais.
- Citations de Studio Volante dans Google AI, ChatGPT, Claude et Perplexity à
  partir d'un jeu de questions stable.
- Acquisition de mentions vérifiables depuis les sites clients, partenaires,
  annuaires professionnels et publications créatives.
