import {
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface MedicalRecordView {
  _id: string;
  type: string;
  title: string;
  notes: string;
  date: string;
  pet?: {
    name: string;
  };
}

const StaffMedical = () => {
  const [records, setRecords] = useState<MedicalRecordView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const response = await api.get("/medical/records");
        setRecords(response.data.data);
      } catch (loadError) {
        const err = loadError as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || "Failed to load medical records");
      } finally {
        setLoading(false);
      }
    };

    queueMicrotask(() => {
      void loadRecords();
    });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Medical Records
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Track recent treatments and check which pets are medically cleared for adoption.
        </Typography>

        {loading && <CircularProgress sx={{ mb: 3 }} />}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {records.map((record) => (
            <Grid size={{ xs: 12, md: 4 }} key={record._id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {record.pet?.name || "Unknown Pet"}
                    </Typography>
                    <Chip label={record.type} color="info" variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Updated on {new Date(record.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>{record.title}</Typography>
                  <Typography variant="body2">{record.notes}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default StaffMedical;
