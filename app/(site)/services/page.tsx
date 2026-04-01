import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ServicesList from "@/components/sections/ServicesList/ServicesList";
import ContactForm from "@/components/sections/ContactForm/ContactForm";
import { colors } from "@/app/theme/tokens";
import type { Service } from "@/components/sections/ServicesList/ServicesList";

export const metadata = {
  title: "Services — Studio Volante",
};

const getServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/services`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<Service[]>;
  } catch {
    return [];
  }
};

const ServicesPage = async () => {
  const services = await getServices();

  return (
    <>
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
          borderBottom: `1px solid ${colors.blueGray}`,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
            Notre expertise
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 700 }}>
            Des services pensés pour faire rayonner votre marque.
          </Typography>
        </Box>
      </Box>

      <ServicesList services={services} />
      <ContactForm />
    </>
  );
};

export default ServicesPage;
