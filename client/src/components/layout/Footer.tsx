import { Box, Container, Typography, Link, Grid, Stack, Chip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Pets,
  Facebook,
  Twitter,
  Instagram,
  MailOutline,
  PlaceOutlined,
  FavoriteBorder,
  VolunteerActivism,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = [
    {
      title: "Explore",
      links: [
        { label: "About", to: "/about" },
        { label: "Success Stories", to: "/stories" },
        { label: "Browse Pets", to: "/pets" },
      ],
    },
    {
      title: "Adopt",
      links: [
        { label: "Dogs", to: "/pets?species=dog" },
        { label: "Cats", to: "/pets?species=cat" },
        { label: "Small Animals", to: "/pets?species=rabbit" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQs", to: "/faq" },
        { label: "Contact", to: "/contact" },
        { label: "Foster Program", to: "/adopter/foster" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #102b2f 0%, #153f45 42%, #8f4e0c 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 12% 16%, rgba(255,255,255,0.14), transparent 18%), radial-gradient(circle at 84% 18%, rgba(255,255,255,0.12), transparent 16%), linear-gradient(transparent, rgba(0,0,0,0.18))",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 6, md: 7 } }}>
        <Box
          sx={{
            mb: 5,
            p: { xs: 2.5, md: 3 },
            borderRadius: 6,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="overline" sx={{ letterSpacing: "0.14em", opacity: 0.8 }}>
                Shelter Operations, Better Designed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                A calmer way to manage adoptions from first intake to forever home.
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.82, maxWidth: 720 }}>
                PetAdopt gives staff and adopters one shared place to browse pets, review applications, manage foster readiness, and tell the stories that keep the mission moving.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ md: "flex-end" }}>
                <Chip
                  icon={<FavoriteBorder />}
                  label="Adoption-first"
                  sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#fff" }}
                />
                <Chip
                  icon={<VolunteerActivism />}
                  label="Foster-aware"
                  sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#fff" }}
                />
                <Chip
                  icon={<Pets />}
                  label="Shelter-ready"
                  sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4.5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                <Pets sx={{ color: "#d9f4f6", fontSize: 34 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  PetAdopt
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)", mb: 2.5 }}>
                Connecting teams, adopters, and rescue pets through a warmer digital experience that still handles the operational work.
              </Typography>
              <Stack spacing={1.25} sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)", display: "flex", alignItems: "center", gap: 1 }}>
                  <MailOutline fontSize="small" /> hello@petadopt.local
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)", display: "flex", alignItems: "center", gap: 1 }}>
                  <PlaceOutlined fontSize="small" /> New York shelter network
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.2}>
                {[Facebook, Twitter, Instagram].map((Icon, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 40,
                      height: 40,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      transition: "transform 0.2s ease, background 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        bgcolor: "rgba(255,255,255,0.16)",
                      },
                    }}
                  >
                    <Icon sx={{ color: "#f4efe7", fontSize: 20 }} />
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </Grid>

          {footerLinks.map((section, index) => (
            <Grid size={{ xs: 6, md: 2.5 }} key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  {section.title}
                </Typography>
                <Stack spacing={1.2}>
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      component={RouterLink}
                      to={link.to}
                      underline="none"
                      sx={{
                        color: "rgba(255,255,255,0.72)",
                        fontSize: "0.96rem",
                        transition: "transform 0.2s ease, color 0.2s ease",
                        "&:hover": {
                          color: "#fff",
                          transform: "translateX(3px)",
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            mt: 5,
            pt: 3,
            display: "flex",
            gap: 1,
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.62)" }}>
            © 2026 PetAdopt. Designed for shelter teams who need both warmth and clarity.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
            Intake • Review • Foster • Adopt
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
