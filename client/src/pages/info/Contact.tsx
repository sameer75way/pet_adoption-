import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

const contacts = [
  { title: "Adoption Desk", detail: "adopt@petadopt.com", note: "Questions about available pets and applications." },
  { title: "Shelter Team", detail: "(555) 010-2222", note: "Daily updates for visiting hours and meet-and-greets." },
  { title: "Volunteer Support", detail: "volunteer@petadopt.com", note: "Foster registration and community opportunities." },
];

const ContactPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          Reach the right team quickly whether you are adopting, fostering, or coordinating shelter operations.
        </Typography>

        <Grid container spacing={3}>
          {contacts.map((contact) => (
            <Grid size={{ xs: 12, md: 4 }} key={contact.title}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {contact.title}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {contact.detail}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contact.note}
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

export default ContactPage;
