import {
  Avatar,
  Alert,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchUsers, verifyUser } from "../../features/users/userSlice";

const AdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Review staff access, adopter accounts, and the current verification pipeline.
        </Typography>

        {loading && <CircularProgress sx={{ mb: 3 }} />}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid size={{ xs: 12, md: 6 }} key={user._id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>{user.name.charAt(0)}</Avatar>
                    <div>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </div>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={user._id.slice(-6).toUpperCase()} variant="outlined" />
                    <Chip label={user.role} color="primary" />
                    <Chip
                      label={user.isVerified ? "Verified Account" : "Unverified Account"}
                      color={user.isVerified ? "success" : "default"}
                      variant="outlined"
                    />
                    <Chip
                      label={
                        user.isFosterApproved
                          ? "Foster Approved"
                          : user.fosterRegistrationSubmitted
                            ? "Foster Review Pending"
                            : "Not a Foster"
                      }
                      color={
                        user.isFosterApproved
                          ? "info"
                          : user.fosterRegistrationSubmitted
                            ? "warning"
                            : "default"
                      }
                      variant="outlined"
                    />
                  </Stack>
                  {!user.isVerified && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        dispatch(verifyUser(user._id));
                      }}
                    >
                      Verify Account
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AdminUsers;
