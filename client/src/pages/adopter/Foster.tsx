import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import api from "../../services/api";

interface FosterAssignmentView {
  _id: string;
  status: string;
  startDate: string;
  expectedEndDate: string;
  pet: {
    name: string;
    species: string;
  };
}

const FosterPage = () => {
  const [assignments, setAssignments] = useState<FosterAssignmentView[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const loadAssignments = async () => {
    try {
      const response = await api.get("/foster/assignments");
      setAssignments(response.data.data);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage(err.response?.data?.message || "Failed to load foster assignments");
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadAssignments();
    });
  }, []);

  const handleRegister = async () => {
    try {
      await api.post("/foster/register");
      setMessage("Your foster registration was submitted.");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage(err.response?.data?.message || "Failed to register as foster");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Foster Care
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Register as a foster parent and track any temporary placements assigned to you.
        </Typography>

        {message && <Alert severity="info" sx={{ mb: 3 }}>{message}</Alert>}

        <Button variant="contained" sx={{ mb: 4 }} onClick={handleRegister}>
          Register as Foster Parent
        </Button>

        <Grid container spacing={3}>
          {assignments.map((assignment) => (
            <Grid size={{ xs: 12, md: 6 }} key={assignment._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {assignment.pet?.name || "Assigned Pet"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {assignment.pet?.species} foster placement
                  </Typography>
                  <Chip label={assignment.status} color="primary" variant="outlined" sx={{ mb: 2 }} />
                  <Typography variant="body2">Start: {new Date(assignment.startDate).toLocaleDateString()}</Typography>
                  <Typography variant="body2">
                    Expected End: {new Date(assignment.expectedEndDate).toLocaleDateString()}
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

export default FosterPage;
