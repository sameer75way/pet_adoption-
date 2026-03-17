import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import type { AppDispatch, RootState } from "../../app/store";
import {
  type Application,
  fetchApplications,
  fetchMyApplications,
  upsertApplicationRealtime,
  updateApplicationStatus,
} from "../../features/applications/applicationSlice";
import { getSocket } from "../../services/socket";

const Applications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { applications, myApplications, error } = useSelector(
    (state: RootState) => state.applications
  );
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const isAdopter = user?.role === "Adopter";

  useEffect(() => {
    if (isAdopter) {
      dispatch(fetchMyApplications());
    } else {
      dispatch(fetchApplications({}));
    }
  }, [dispatch, isAdopter]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleApplicationUpdated = (application: Application) => {
      dispatch(upsertApplicationRealtime(application));
    };

    socket.on("application:submitted", handleApplicationUpdated);
    socket.on("application:updated", handleApplicationUpdated);

    return () => {
      socket.off("application:submitted", handleApplicationUpdated);
      socket.off("application:updated", handleApplicationUpdated);
    };
  }, [dispatch]);

  const tableRows = (isAdopter ? myApplications : applications).map((application) => ({
    id: application._id,
    pet: application.pet?.name || "Unknown Pet",
    applicant: application.applicant?.name || user?.name || "Applicant",
    status: application.status,
    date: new Date(application.createdAt).toLocaleDateString(),
    questionnaire: application.questionnaire,
    applicantEmail: application.applicant?.email || "",
    rejectionReason: application.rejectionReason,
  }));

  const selectedApplication = useMemo(
    () => (isAdopter ? myApplications : applications).find((application) => application._id === selectedApplicationId) || null,
    [applications, isAdopter, myApplications, selectedApplicationId]
  );

  const closeDialog = () => {
    setSelectedApplicationId(null);
    setRejectionReason("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "under_review":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {isAdopter ? "My Applications" : "Adoption Applications"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isAdopter
              ? "Track the status of the pets you have applied for."
              : "Manage and review adoption applications."}
          </Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Pet</TableCell>
                    {!isAdopter && <TableCell>Applicant</TableCell>}
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.id}</TableCell>
                      <TableCell>{app.pet}</TableCell>
                      {!isAdopter && <TableCell>{app.applicant}</TableCell>}
                      <TableCell>{app.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={app.status.replace("_", " ")}
                          color={getStatusColor(app.status) as "success" | "error" | "warning" | "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedApplicationId(app.id)}
                        >
                          {isAdopter ? "View" : "Review"}
                        </Button>
                        {!isAdopter && app.status === "submitted" && (
                          <Button
                            size="small"
                            sx={{ ml: 1 }}
                            onClick={() =>
                              dispatch(
                                updateApplicationStatus({
                                  id: app.id,
                                  status: "under_review",
                                })
                              )
                            }
                          >
                            Start Review
                          </Button>
                        )}
                        {!isAdopter && app.status === "under_review" && (
                          <>
                            <Button
                              size="small"
                              color="success"
                              sx={{ ml: 1 }}
                              onClick={() =>
                                dispatch(
                                  updateApplicationStatus({
                                    id: app.id,
                                    status: "approved",
                                  })
                                )
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              sx={{ ml: 1 }}
                              onClick={() => setSelectedApplicationId(app.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Dialog open={Boolean(selectedApplication)} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>{isAdopter ? "Application Details" : "Review Application"}</DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Pet:</strong> {selectedApplication.pet.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Applicant:</strong> {selectedApplication.applicant.name}
                  {!isAdopter && selectedApplication.applicant.email ? ` (${selectedApplication.applicant.email})` : ""}
                </Typography>
                <Typography variant="body2">
                  <strong>Housing:</strong> {selectedApplication.questionnaire.housingType}
                </Typography>
                <Typography variant="body2">
                  <strong>Has Yard:</strong> {selectedApplication.questionnaire.hasYard ? "Yes" : "No"}
                </Typography>
                <Typography variant="body2">
                  <strong>Household:</strong> {selectedApplication.questionnaire.householdAdults} adults, {selectedApplication.questionnaire.householdChildren} children
                </Typography>
                <Typography variant="body2">
                  <strong>Other Pets:</strong> {selectedApplication.questionnaire.otherPets || "None listed"}
                </Typography>
                <Typography variant="body2">
                  <strong>Previous Experience:</strong> {selectedApplication.questionnaire.previousPets || "Not provided"}
                </Typography>
                <Typography variant="body2">
                  <strong>Hours Alone:</strong> {selectedApplication.questionnaire.hoursAlonePerDay}
                </Typography>
                <Typography variant="body2">
                  <strong>Reason for Adoption:</strong> {selectedApplication.questionnaire.reasonForAdoption}
                </Typography>
                {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                  <Alert severity="warning">{selectedApplication.rejectionReason}</Alert>
                )}
                {!isAdopter && selectedApplication.status === "under_review" && (
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Reason for rejection"
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                  />
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
            {!isAdopter && selectedApplication?.status === "submitted" && (
              <Button
                onClick={async () => {
                  await dispatch(
                    updateApplicationStatus({
                      id: selectedApplication._id,
                      status: "under_review",
                    })
                  );
                  closeDialog();
                }}
              >
                Start Review
              </Button>
            )}
            {!isAdopter && selectedApplication?.status === "under_review" && (
              <>
                <Button
                  color="success"
                  onClick={async () => {
                    await dispatch(
                      updateApplicationStatus({
                        id: selectedApplication._id,
                        status: "approved",
                      })
                    );
                    closeDialog();
                  }}
                >
                  Approve
                </Button>
                <Button
                  color="error"
                  onClick={async () => {
                    await dispatch(
                      updateApplicationStatus({
                        id: selectedApplication._id,
                        status: "rejected",
                        rejectionReason,
                      })
                    );
                    closeDialog();
                  }}
                >
                  Reject
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default Applications;
