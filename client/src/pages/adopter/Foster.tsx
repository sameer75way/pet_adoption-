import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import api from "../../services/api";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchCurrentUser } from "../../features/auth/authSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [assignments, setAssignments] = useState<FosterAssignmentView[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const [submitting, setSubmitting] = useState(false);

  const loadAssignments = async () => {
    try {
      const response = await api.get("/foster/assignments");
      setAssignments(response.data.data);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load foster assignments");
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadAssignments();
    });
  }, []);

  const handleRegister = async () => {
    setSubmitting(true);
    try {
      await api.post("/foster/register");
      await dispatch(fetchCurrentUser()).unwrap();
      setMessageType("success");
      setMessage("Your foster registration was submitted and is now under review.");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to register as foster");
    } finally {
      setSubmitting(false);
    }
  };

  const registrationState = user?.isFosterApproved
    ? { label: "Approved Foster", color: "success" as const }
    : user?.fosterRegistrationSubmitted
      ? { label: "Under Review", color: "warning" as const }
      : { label: "Not Registered", color: "default" as const };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Foster Care
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Register as a foster parent and track any temporary placements assigned to you.
        </Typography>

        {message && <Alert severity={messageType} sx={{ mb: 3 }}>{message}</Alert>}

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Foster Registration Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Apply once and the shelter team will review your foster eligibility before assignments are made.
                </Typography>
              </Box>
              <Chip label={registrationState.label} color={registrationState.color} variant="outlined" />
            </Stack>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleRegister}
              disabled={submitting || Boolean(user?.isFosterApproved) || Boolean(user?.fosterRegistrationSubmitted)}
            >
              {user?.isFosterApproved
                ? "Foster Approved"
                : user?.fosterRegistrationSubmitted
                  ? "Registration Under Review"
                  : submitting
                    ? "Submitting..."
                    : "Register as Foster Parent"}
            </Button>
          </CardContent>
        </Card>

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
