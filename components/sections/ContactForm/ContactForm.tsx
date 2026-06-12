"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@/components/ui/Button/Button";
import { colors } from "@/app/theme/tokens";
import { t } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n";

interface ContactFormProps {
  translations?: Translations;
}

const ContactForm = ({ translations = {} }: ContactFormProps) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setError(true);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <Box
      component="section"
      data-testid="contact-form-section"
      sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 4 } }}
    >
      <Box sx={{ maxWidth: 640, mx: "auto" }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: colors.green }}>
          {t(translations, "contact.eyebrow", "Parlons-en")}
        </Typography>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {t(translations, "contact.heading", "Démarrons un projet")}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 6 }}>
          {t(translations, "contact.subheading", "Décrivez-nous votre projet et nous vous répondrons sous 48h.")}
        </Typography>

        {sent ? (
          <Box
            sx={{
              p: 4,
              border: `1px solid ${colors.blueGray}`,
              borderRadius: 2,
              textAlign: "center",
            }}
            data-testid="contact-success"
          >
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t(translations, "contact.success.title", "Message envoyé !")}
            </Typography>
            <Typography variant="body2">
              {t(translations, "contact.success.body", "Merci pour votre message. Nous reviendrons vers vous très bientôt.")}
            </Typography>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            data-testid="contact-form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              <TextField
                label={t(translations, "contact.form.firstName", "Prénom")}
                name="firstName"
                required
                fullWidth
              />
              <TextField
                label={t(translations, "contact.form.lastName", "Nom")}
                name="lastName"
                required
                fullWidth
              />
            </Box>
            <TextField
              label={t(translations, "contact.form.email", "Email")}
              name="email"
              type="email"
              required
              fullWidth
            />
            <TextField
              label={t(translations, "contact.form.company", "Entreprise")}
              name="company"
              fullWidth
            />
            <TextField
              label={t(translations, "contact.form.message", "Votre projet")}
              name="message"
              multiline
              rows={5}
              required
              fullWidth
              placeholder={t(translations, "contact.form.messagePlaceholder", "Décrivez votre projet, vos objectifs, votre budget approximatif…")}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
              data-testid="contact-submit"
              sx={{ alignSelf: "flex-start" }}
            >
              {t(translations, "contact.form.submit", "Envoyer le message")}
            </Button>

            {error && (
              <Typography variant="body2" sx={{ color: "error.main" }}>
                {t(
                  translations,
                  "contact.form.error",
                  "Une erreur est survenue. Veuillez réessayer ou nous contacter directement."
                )}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContactForm;
