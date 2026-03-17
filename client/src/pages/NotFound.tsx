import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Home, SentimentDissatisfied } from "@mui/icons-material";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SentimentDissatisfied sx={{ fontSize: 100, color: "grey.400", mb: 2 }} />
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          startIcon={<Home />}
        >
          Go Home
        </Button>
      </motion.div>
    </Container>
  );
};

export default NotFound;
