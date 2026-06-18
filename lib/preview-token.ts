import { createHmac, timingSafeEqual } from "crypto";

type PreviewPayload = {
  slug: string;
  exp: number;
};

const getPreviewSecret = () => process.env.PREVIEW_SECRET;

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export const verifyProjectPreviewToken = (
  token: string | undefined,
  slug: string,
) => {
  const secret = getPreviewSecret();
  if (!secret || secret.length < 32 || !token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expected = sign(encodedPayload, secret);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as PreviewPayload;
    return payload.slug === slug && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};
