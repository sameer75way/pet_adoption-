import { useEffect, useState } from "react";
import {
  Alert,
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

interface FosterApplicant {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isFosterApproved?: boolean;
  fosterRegistrationSubmitted?: boolean;
}

const FosterApprovalsPage = () => {
  const [applicants, setApplicants] = useState<FosterApplicant[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const loadApplicants = async () => {
    try {
      const response = await api.get("/foster/applicants");
      setApplicants(response.data.data);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage(err.response?.data?.message || "Failed to load foster applicants");
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadApplicants();
    });
  }, []);

  const approveApplicant = async (id: string) => {
    try {
      await api.patch(`/foster/${id}/approve`);
      setApplicants((current) =>
        current.map((applicant) =>
          applicant._id === id
            ? {
                ...applicant,
                isFosterApproved: true,
                fosterRegistrationSubmitted: false,
              }
            : applicant
        )
      );
      setMessage("Foster applicant approved successfully.");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage(err.response?.data?.message || "Failed to approve foster applicant");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Foster Approvals
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Review adopter registrations and approve foster parents so they can receive assignments.
        </Typography>

        {message && <Alert severity="info" sx={{ mb: 3 }}>{message}</Alert>}

        <Grid container spacing={3}>
          {applicants.map((applicant) => (
            <Grid size={{ xs: 12, md: 6 }} key={applicant._id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {applicant.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {applicant.email}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    <Chip label={applicant.isVerified ? "Verified" : "Unverified"} color={applicant.isVerified ? "success" : "warning"} variant="outlined" />
                    <Chip
                      label={applicant.isFosterApproved ? "Approved Foster" : applicant.fosterRegistrationSubmitted ? "Pending Review" : "Not Submitted"}
                      color={applicant.isFosterApproved ? "success" : applicant.fosterRegistrationSubmitted ? "warning" : "default"}
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    disabled={Boolean(applicant.isFosterApproved) || !applicant.fosterRegistrationSubmitted}
                    onClick={() => approveApplicant(applicant._id)}
                  >
                    {applicant.isFosterApproved ? "Approved" : "Approve Foster"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {applicants.length === 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                No foster registrations are waiting for review right now.
              </Typography>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </Container>
  );
};

export default FosterApprovalsPage;
