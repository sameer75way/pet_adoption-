import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Add, AutoStories, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import type { AppDispatch, RootState } from "../../app/store";
import {
  createStory,
  deleteStory,
  fetchStories,
  updateStory,
  type Story,
} from "../../features/stories/storySlice";

type StoryFormState = {
  title: string;
  summary: string;
  content: string;
  image: string;
  petName: string;
  adopterName: string;
  published: boolean;
};

const emptyForm: StoryFormState = {
  title: "",
  summary: "",
  content: "",
  image: "",
  petName: "",
  adopterName: "",
  published: true,
};

const ManageStories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading, submitting, error } = useSelector(
    (state: RootState) => state.stories
  );
  const [form, setForm] = useState<StoryFormState>(emptyForm);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchStories(true));
  }, [dispatch]);

  const dialogTitle = useMemo(
    () => (editingStory ? "Edit Success Story" : "Add Success Story"),
    [editingStory]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingStory(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      petName: form.petName || undefined,
      adopterName: form.adopterName || undefined,
    };

    const result = editingStory
      ? await dispatch(updateStory({ id: editingStory._id, data: payload }))
      : await dispatch(createStory(payload));

    if (createStory.fulfilled.match(result) || updateStory.fulfilled.match(result)) {
      setMessage(editingStory ? "Story updated successfully." : "Story added successfully.");
      resetForm();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Success Stories
            </Typography>
            <Typography color="text.secondary">
              Publish adoption outcomes, foster wins, and happy endings for the public site.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setForm(emptyForm);
              setEditingStory(null);
              setIsDialogOpen(true);
            }}
          >
            Add Story
          </Button>
        </Stack>

        {message && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage(null)}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {stories.map((story, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={story._id}>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardMedia component="img" height="240" image={story.image} alt={story.title} />
                  <CardContent>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
                      <Chip
                        label={story.published ? "Published" : "Hidden"}
                        color={story.published ? "success" : "default"}
                        variant="outlined"
                      />
                      {story.petName && <Chip label={`Pet: ${story.petName}`} variant="outlined" />}
                      {story.adopterName && (
                        <Chip label={`Family: ${story.adopterName}`} variant="outlined" />
                      )}
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {story.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {story.summary}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      {story.content}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<EditOutlined />}
                        onClick={() => {
                          setEditingStory(story);
                          setForm({
                            title: story.title,
                            summary: story.summary,
                            content: story.content,
                            image: story.image,
                            petName: story.petName || "",
                            adopterName: story.adopterName || "",
                            published: story.published,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteOutline />}
                        onClick={() => {
                          void dispatch(deleteStory(story._id));
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {!loading && stories.length === 0 && (
          <Card sx={{ borderStyle: "dashed", mt: 2 }}>
            <CardContent sx={{ py: 5, textAlign: "center" }}>
              <AutoStories sx={{ fontSize: 42, color: "text.secondary", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No stories yet
              </Typography>
              <Typography color="text.secondary">
                Add your first rescue success story to show up on the public stories page.
              </Typography>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onClose={resetForm} fullWidth maxWidth="md">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Short Summary"
                value={form.summary}
                onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Full Story"
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                multiline
                minRows={5}
                fullWidth
              />
              <TextField
                label="Image URL"
                value={form.image}
                onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                fullWidth
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Pet Name"
                    value={form.petName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, petName: event.target.value }))
                    }
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Adopter or Family Name"
                    value={form.adopterName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, adopterName: event.target.value }))
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Switch
                  checked={form.published}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, published: event.target.checked }))
                  }
                />
                <Typography>Show this story on the public site</Typography>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetForm}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                void handleSubmit();
              }}
              disabled={
                submitting ||
                !form.title.trim() ||
                !form.summary.trim() ||
                !form.content.trim() ||
                !form.image.trim()
              }
            >
              {editingStory ? "Save Changes" : "Publish Story"}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default ManageStories;
