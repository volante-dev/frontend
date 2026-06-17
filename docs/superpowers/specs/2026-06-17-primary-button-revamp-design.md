# Primary Button Revamp — Design Spec

**Date:** 2026-06-17  
**Status:** Approved

## Context

Le bouton primary (`variant="contained"`) de Studio Volante a actuellement un fond vert plein (#3F5E5A) avec du texte off-white. L'objectif est de lui donner un aspect plus raffiné et premium : fond quasi-transparent légèrement plus sombre que la page, bordure dégradée, glow sous le bouton, et animation chatoyante au hover.

Les boutons secondary (`outlined`, `text`) ne changent pas.

---

## Decisions

| Aspect | Valeur |
|---|---|
| Fond du bouton | `#EAECEE` — légèrement plus sombre que le fond de page `#F7F8F9` |
| Couleur du texte | `#3F5E5A` (green) — inversé par rapport à l'actuel |
| Bordure | Dégradé 135° de `#3F5E5A` → `#D8CAAA` (champagne), épaisseur 1.5px |
| Glow au repos | `box-shadow: 0 6px 20px rgba(63, 94, 90, 0.20)` |
| Glow au hover | `0 10px 32px rgba(63, 94, 90, 0.50), 0 4px 16px rgba(216, 202, 170, 0.40)` |
| Transition hover | `0.6s ease` |
| Animation hover | Pulse respirant : glow oscille entre valeur hover et valeur +amplifiée, `2s ease-in-out infinite` |

---

## Technique CSS — Bordure dégradée avec border-radius

`border-image` ne supporte pas `border-radius`. La solution retenue est le **mask trick** via `::before` :

```css
/* Principe */
.button::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;                  /* épaisseur de la bordure */
  background: linear-gradient(135deg, #3F5E5A, #D8CAAA);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;         /* ne montre que l'anneau de bordure */
  pointer-events: none;
}
```

Cette technique est stable dans tous les navigateurs modernes (Chrome, Firefox, Safari).

---

## Keyframes

```css
@keyframes pulse-glow {
  0%, 100% {
    box-shadow:
      0 10px 32px rgba(63, 94, 90, 0.50),
      0 4px 16px rgba(216, 202, 170, 0.40);
  }
  50% {
    box-shadow:
      0 14px 44px rgba(63, 94, 90, 0.68),
      0 6px 22px rgba(216, 202, 170, 0.52);
  }
}
```

Les keyframes sont ajoutées via `MuiCssBaseline.styleOverrides` pour être disponibles globalement.

---

## Fichiers à modifier

### 1. `app/theme/tokens.ts`
Ajouter deux tokens :
- `buttonSurface: "#EAECEE"` — fond du bouton primary
- `champagne: "#D8CAAA"` — couleur de fin du dégradé

### 2. `app/theme/theme.ts`

**`MuiButton.styleOverrides.root`** — retirer `boxShadow: "none"` et `"&:hover": { boxShadow: "none" }` du `root` (ils écrasent le glow du contained).  
Déplacer `boxShadow: "none"` dans les overrides `outlined` et `text` (MUI v7 ne génère pas de shadow pour ces variants par défaut, mais on explicite pour rester robuste).

**`MuiButton.styleOverrides.contained`** — remplacer entièrement par :
```ts
contained: {
  backgroundColor: colors.buttonSurface,
  color: colors.green,
  position: "relative",
  border: "none",
  boxShadow: "0 6px 20px rgba(63, 94, 90, 0.20)",
  transition: "box-shadow 0.6s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    padding: "1.5px",
    background: `linear-gradient(135deg, ${colors.green}, ${colors.champagne})`,
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  },
  "&:hover": {
    backgroundColor: colors.buttonSurface,
    boxShadow:
      "0 10px 32px rgba(63, 94, 90, 0.50), 0 4px 16px rgba(216, 202, 170, 0.40)",
    animation: "pulse-glow 2s ease-in-out 0.6s infinite",
  },
},
```

**`MuiCssBaseline.styleOverrides`** — ajouter les keyframes dans le body override existant :
```ts
"@keyframes pulse-glow": {
  "0%, 100%": {
    boxShadow:
      "0 10px 32px rgba(63, 94, 90, 0.50), 0 4px 16px rgba(216, 202, 170, 0.40)",
  },
  "50%": {
    boxShadow:
      "0 14px 44px rgba(63, 94, 90, 0.68), 0 6px 22px rgba(216, 202, 170, 0.52)",
  },
},
```

---

## Hors scope

- Boutons `outlined` et `text` : inchangés
- Composant `Button.tsx` : inchangé (aucune modification nécessaire)
- Storybook stories : mettre à jour `Contained` pour refléter le nouveau style (optionnel, en bonus)

---

## Vérification

1. `npm run dev` — vérifier visuellement le bouton "Voir nos projets" dans la Hero section
2. Tester le hover sur desktop (glow + animation)
3. Vérifier que les boutons `outlined` et `text` sont inchangés
4. `npm run build` — vérifier qu'il n'y a pas d'erreurs TypeScript
5. `npx vitest` — vérifier que les tests Storybook passent
