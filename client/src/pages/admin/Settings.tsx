import {
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

const settings = [
  {
    title: "Application Auto-Assignment",
    description: "Automatically assign new adoption applications to the next available staff member.",
    enabled: true,
  },
  {
    title: "Public Success Stories",
    description: "Show completed adoption stories on the public-facing site.",
    enabled: true,
  },
  {
    title: "Medical Alert Emails",
    description: "Send staff alerts when a pet medical record is updated.",
    enabled: false,
  },
];

const AdminSettings = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Configure how the shelter team runs reviews, communications, and public content.
        </Typography>

        <Grid container spacing={3}>
          {settings.map((setting) => (
            <Grid size={{ xs: 12, md: 6 }} key={setting.title}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {setting.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {setting.description}
                  </Typography>
                  <FormControlLabel control={<Switch checked={setting.enabled} />} label={setting.enabled ? "Enabled" : "Disabled"} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AdminSettings;
