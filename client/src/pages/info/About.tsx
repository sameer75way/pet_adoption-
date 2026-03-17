import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

const values = [
  { title: "Compassion First", description: "Every pet receives behavioral and medical support before being listed for adoption." },
  { title: "Thoughtful Matching", description: "We focus on long-term fit, not quick placements, so pets and families both thrive." },
  { title: "Transparent Care", description: "Adopters can review intake notes, temperament traits, and care updates in one place." },
];

const AboutPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Our Story
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 5, maxWidth: 840 }}>
          PetAdopt helps shelters, staff, and future pet parents stay aligned from intake through adoption.
        </Typography>

        <Grid container spacing={3}>
          {values.map((value) => (
            <Grid size={{ xs: 12, md: 4 }} key={value.title}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AboutPage;
