import { Box, Container, Typography, Link, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Pets, Facebook, Twitter, Instagram, MailOutline, PlaceOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = [
    {
      title: "About",
      links: [
        { label: "Our Story", to: "/about" },
        { label: "Success Stories", to: "/stories" },
      ],
    },
    {
      title: "Adopt",
      links: [
        { label: "Dogs", to: "/pets?species=dog" },
        { label: "Cats", to: "/pets?species=cat" },
        { label: "Other Pets", to: "/pets?species=other" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "FAQs", to: "/faq" },
        { label: "Contact Us", to: "/contact" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #17393f 0%, #214f56 55%, #3f2d18 100%)",
        color: "white",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Pets sx={{ color: "primary.light", fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  PetAdopt
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "grey.400", mb: 2 }}>
                Connecting loving families with pets in need of a forever home. Every adoption saves a life.
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.400", display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <MailOutline fontSize="small" /> hello@petadopt.local
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.400", display: "flex", alignItems: "center", gap: 1 }}>
                <PlaceOutlined fontSize="small" /> New York shelter network
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Facebook sx={{ color: "grey.400", cursor: "pointer", "&:hover": { color: "primary.light" } }} />
                <Twitter sx={{ color: "grey.400", cursor: "pointer", "&:hover": { color: "primary.light" } }} />
                <Instagram sx={{ color: "grey.400", cursor: "pointer", "&:hover": { color: "primary.light" } }} />
              </Box>
            </motion.div>
          </Grid>
          
          {footerLinks.map((section, index) => (
            <Grid size={{ xs: 6, md: 2 }} key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  {section.title}
                </Typography>
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    underline="none"
                    sx={{ display: "block", color: "grey.400", mb: 1, "&:hover": { color: "primary.light" } }}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", mt: 4, pt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "grey.500" }}>
            © 2026 PetAdopt. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
