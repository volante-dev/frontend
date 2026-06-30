import type { BuiltInLocale } from "./i18n-config";

export type Translations = Record<string, string>;

export const localTranslations = {
  fr: {
    "hero.eyebrow": "Agence de communication créative",
    "hero.heading": "Nous donnons vie aux idées qui méritent d'exister.",
    "hero.subheading":
      "Studio Volante accompagne les marques ambitieuses dans leur communication — identité visuelle, stratégie de contenu, direction artistique.",
    "hero.cta.portfolio": "Voir nos projets",
    "hero.cta.contact": "Travailler ensemble",
    "services.eyebrow": "Ce que nous faisons",
    "services.heading": "Nos services",
    "services.page.eyebrow": "Notre expertise",
    "services.page.heading":
      "Des services pensés pour faire rayonner votre marque.",
    "portfolio.eyebrow": "Nos réalisations",
    "portfolio.heading": "Portfolio",
    "portfolio.cta.viewAll": "Voir tout",
    "carousel.previous": "Réalisation précédente",
    "carousel.next": "Réalisation suivante",
    "portfolio.page.eyebrow": "Nos réalisations",
    "portfolio.page.heading": "Des projets construits avec exigence.",
    "portfolio.close": "Fermer la réalisation",
    "contact.page.eyebrow": "Nous contacter",
    "contact.page.heading": "Parlons de votre projet.",
    "contact.eyebrow": "Parlons-en",
    "contact.heading": "Démarrons un projet",
    "contact.subheading":
      "Décrivez-nous votre projet et nous vous répondrons sous 48h.",
    "contact.success.title": "Message envoyé !",
    "contact.success.body":
      "Merci pour votre message. Nous reviendrons vers vous très bientôt.",
    "contact.form.firstName": "Prénom",
    "contact.form.lastName": "Nom",
    "contact.form.email": "Email",
    "contact.form.company": "Entreprise",
    "contact.form.message": "Votre projet",
    "contact.form.messagePlaceholder":
      "Décrivez votre projet, vos objectifs, votre budget approximatif…",
    "contact.form.submit": "Envoyer le message",
    "contact.form.error":
      "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
    "studio.page.eyebrow": "Qui sommes-nous",
    "studio.page.heading": "Un studio indépendant, une vision singulière.",
    "studio.history.heading": "Notre histoire",
    "studio.history.body1":
      "Studio Volante est né de la conviction que la communication doit être aussi bien pensée qu'elle est belle. Fondé par des créatifs passionnés, le studio accompagne des marques de toutes tailles dans la construction d'une identité forte et cohérente.",
    "studio.history.body2":
      "Notre approche est toujours stratégique avant d'être esthétique : comprendre le positionnement, les cibles, les ambitions — puis créer.",
    "studio.values.heading": "Nos valeurs",
    "footer.tagline":
      "Agence de communication créative. Nous donnons vie aux idées qui comptent.",
    "footer.nav.heading": "Navigation",
    "footer.contact.heading": "Contact",
    "footer.contact.email": "yasmine@studio-volante.fr",
    "footer.contact.social": "@vlnt.studio",
    "footer.copyright": "Studio Volante. Tous droits réservés.",
    "footer.madeIn": "Fait avec soin à Paris",
    "coming-soon.soon": "Bientôt",
    "coming-soon.heading": "Quelque chose de beau\nest en préparation.",
    "coming-soon.subheading":
      "Nous peaufinons les derniers détails de notre nouveau site.",
  },
  en: {
    "hero.eyebrow": "Creative communication agency",
    "hero.heading": "We bring ideas worth sharing to life.",
    "hero.subheading":
      "Studio Volante helps ambitious brands shape their communication — visual identity, content strategy and art direction.",
    "hero.cta.portfolio": "View our work",
    "hero.cta.contact": "Work with us",
    "services.eyebrow": "What we do",
    "services.heading": "Our services",
    "services.page.eyebrow": "Our expertise",
    "services.page.heading": "Services designed to make your brand shine.",
    "portfolio.eyebrow": "Selected work",
    "portfolio.heading": "Portfolio",
    "portfolio.cta.viewAll": "View all",
    "carousel.previous": "Previous project",
    "carousel.next": "Next project",
    "portfolio.page.eyebrow": "Selected work",
    "portfolio.page.heading": "Projects crafted with care and precision.",
    "portfolio.close": "Close project",
    "contact.page.eyebrow": "Contact us",
    "contact.page.heading": "Let's talk about your project.",
    "contact.eyebrow": "Let's talk",
    "contact.heading": "Let's start a project",
    "contact.subheading":
      "Tell us about your project and we'll get back to you within 48 hours.",
    "contact.success.title": "Message sent!",
    "contact.success.body":
      "Thank you for your message. We'll get back to you very soon.",
    "contact.form.firstName": "First name",
    "contact.form.lastName": "Last name",
    "contact.form.email": "Email",
    "contact.form.company": "Company",
    "contact.form.message": "Your project",
    "contact.form.messagePlaceholder":
      "Tell us about your project, goals and approximate budget…",
    "contact.form.submit": "Send message",
    "contact.form.error":
      "Something went wrong. Please try again or contact us directly.",
    "studio.page.eyebrow": "About us",
    "studio.page.heading": "An independent studio with a singular vision.",
    "studio.history.heading": "Our story",
    "studio.history.body1":
      "Studio Volante was born from the belief that communication should be as thoughtful as it is beautiful. Founded by passionate creatives, the studio helps brands of every size build strong, consistent identities.",
    "studio.history.body2":
      "Our approach is always strategic before it is aesthetic: understand the positioning, audiences and ambitions — then create.",
    "studio.values.heading": "Our values",
    "footer.tagline":
      "Creative communication agency. We bring meaningful ideas to life.",
    "footer.nav.heading": "Navigation",
    "footer.contact.heading": "Contact",
    "footer.contact.email": "yasmine@studio-volante.fr",
    "footer.contact.social": "@vlnt.studio",
    "footer.copyright": "Studio Volante. All rights reserved.",
    "footer.madeIn": "Made with care in Paris",
    "coming-soon.soon": "Coming soon",
    "coming-soon.heading": "Something beautiful\nis on its way.",
    "coming-soon.subheading":
      "We're putting the finishing touches on our new site.",
  },
} satisfies Record<BuiltInLocale, Translations>;

export type TranslationKey = keyof (typeof localTranslations)["fr"];

export const t = (
  translations: Translations,
  key: string,
  fallback = "",
): string => translations[key] ?? fallback;
