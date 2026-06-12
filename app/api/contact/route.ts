import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req: Request) => {
  const { firstName, lastName, email, company, message } = await req.json();

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Studio Volante <no-reply@studio-volante.fr>",
    to: "yasmine@studio-volante.fr",
    replyTo: email,
    subject: `Nouveau message de ${firstName} ${lastName}`,
    text: [
      `Prénom : ${firstName}`,
      `Nom : ${lastName}`,
      `Email : ${email}`,
      company ? `Entreprise : ${company}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
};
