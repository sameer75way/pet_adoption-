import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { type AppDispatch, type RootState } from "../../app/store";
import { fetchStories } from "../../features/stories/storySlice";

const SuccessStoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading, error } = useSelector((state: RootState) => state.stories);

  useEffect(() => {
    dispatch(fetchStories(false));
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Success Stories
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          A few of the happy endings made possible by thoughtful screening and patient care.
        </Typography>

        {loading && (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        )}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {stories.map((story, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={story._id}>
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
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {story.content}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {!loading && !error && stories.length === 0 && (
          <Card sx={{ mt: 4, borderStyle: "dashed" }}>
            <CardContent sx={{ py: 5, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No stories published yet
              </Typography>
              <Typography color="text.secondary">
                Shelter staff can add success stories from the dashboard once new adoptions are completed.
              </Typography>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </Container>
  );
};

export default SuccessStoriesPage;
