"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@/components/ui/Button/Button";
import { colors } from "@/app/theme/tokens";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: connecter à une API de mailing (Resend, Mailgun, etc.)
    await new Promise((res) => setTimeout(res, 800));
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
          Parlons-en
        </Typography>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Démarrons un projet
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 6 }}>
          Décrivez-nous votre projet et nous vous répondrons sous 48h.
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
              Message envoyé !
            </Typography>
            <Typography variant="body2">
              Merci pour votre message. Nous reviendrons vers vous très bientôt.
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
              <TextField label="Prénom" name="firstName" required fullWidth />
              <TextField label="Nom" name="lastName" required fullWidth />
            </Box>
            <TextField label="Email" name="email" type="email" required fullWidth />
            <TextField label="Entreprise" name="company" fullWidth />
            <TextField
              label="Votre projet"
              name="message"
              multiline
              rows={5}
              required
              fullWidth
              placeholder="Décrivez votre projet, vos objectifs, votre budget approximatif…"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
              data-testid="contact-submit"
              sx={{ alignSelf: "flex-start" }}
            >
              Envoyer le message
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContactForm;
