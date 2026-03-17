import { Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

const stories = [
  {
    title: "Luna Found a Hiking Buddy",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200",
    summary: "After a careful match review, Luna joined an active family and now spends weekends on trail walks.",
  },
  {
    title: "Milo Finally Has a Quiet Window Seat",
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=1200",
    summary: "Milo was paired with a calm adopter who wanted a conversational companion and a relaxed home routine.",
  },
  {
    title: "Charlie Graduated From Foster to Forever",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1200",
    summary: "A foster placement turned into a permanent home once Charlie settled in and showed off his affectionate side.",
  },
];

const SuccessStoriesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Success Stories
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          A few of the happy endings made possible by thoughtful screening and patient care.
        </Typography>

        <Grid container spacing={3}>
          {stories.map((story, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={story.title}>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.08 }}>
                <Card sx={{ height: "100%" }}>
                  <CardMedia component="img" height="220" image={story.image} alt={story.title} />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {story.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {story.summary}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default SuccessStoriesPage;
