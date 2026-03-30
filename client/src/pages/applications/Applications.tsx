import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  AssignmentTurnedIn,
  HourglassTop,
  MarkEmailRead,
  Pets,
} from "@mui/icons-material";
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
import {
  getRealtimePollMs,
  getSocket,
  isRealtimeEnabled,
} from "../../services/socket";
import { usePollingEffect } from "../../hooks/usePollingEffect";
import { gradients } from "../../theme";

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

  usePollingEffect(
    !isRealtimeEnabled(),
    async () => {
      if (isAdopter) {
        await dispatch(fetchMyApplications());
        return;
      }

      await dispatch(fetchApplications({}));
    },
    getRealtimePollMs()
  );

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

  const sourceApplications = isAdopter ? myApplications : applications;
  const tableRows = sourceApplications.map((application) => ({
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
    () =>
      sourceApplications.find((application) => application._id === selectedApplicationId) || null,
    [selectedApplicationId, sourceApplications]
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

  const submittedCount = sourceApplications.filter((application) => application.status === "submitted").length;
  const reviewCount = sourceApplications.filter((application) => application.status === "under_review").length;
  const approvedCount = sourceApplications.filter((application) => application.status === "approved").length;

  const summaryCards = [
    {
      title: isAdopter ? "Total Applications" : "Submitted Queue",
      value: isAdopter ? String(sourceApplications.length) : String(submittedCount),
      note: isAdopter ? "Every pet you have actively applied for" : "Newly submitted applications waiting to be triaged",
      icon: <Pets />,
      accent: gradients.primary,
    },
    {
      title: "Under Review",
      value: String(reviewCount),
      note: "Applications currently in staff decision flow",
      icon: <HourglassTop />,
      accent: gradients.warning,
    },
    {
      title: isAdopter ? "Approved Matches" : "Approved Applications",
      value: String(approvedCount),
      note: isAdopter ? "Applications that are moving toward placement" : "Successful outcomes recorded in the pipeline",
      icon: <AssignmentTurnedIn />,
      accent: gradients.success,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            mb: 4,
            overflow: "hidden",
            color: "#fff",
            background: isAdopter ? gradients.primary : gradients.hero,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Chip
                  label={isAdopter ? "Applicant View" : "Review Workspace"}
                  sx={{
                    mb: 2,
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {isAdopter ? "My Applications" : "Adoption Applications"}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.88, maxWidth: 780 }}>
                  {isAdopter
                    ? "Track each application with clearer status cues, faster details, and a calmer overview of where every match stands."
                    : "Review new matches, move strong fits into active review, and document final decisions without losing the bigger picture."}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    bgcolor: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backgroundImage: "none",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                      <MarkEmailRead />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {isRealtimeEnabled() ? "Live updates enabled" : "Auto refresh enabled"}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {isRealtimeEnabled()
                        ? "New submissions and review changes flow into this page automatically when the realtime connection is active."
                        : "New submissions and review changes refresh automatically in the background while this page is open."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {summaryCards.map((card, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={card.title}>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "50%",
                          background: card.accent,
                          color: "#fff",
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {card.title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          {card.value}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {card.note}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                px: { xs: 2.5, md: 3 },
                py: 2.5,
                borderBottom: "1px solid rgba(188,175,156,0.26)",
                background:
                  "linear-gradient(135deg, rgba(23,92,99,0.08) 0%, rgba(201,110,22,0.08) 100%)",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {isAdopter ? "Application Timeline" : "Review Table"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isAdopter
                  ? "Open any row to review your answers and status notes."
                  : "Use the actions column to move promising applications through review quickly."}
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Pet</TableCell>
                    {!isAdopter && <TableCell>Applicant</TableCell>}
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((app) => (
                    <TableRow key={app.id} hover>
                      <TableCell sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                        {app.id.slice(-8)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{app.pet}</TableCell>
                      {!isAdopter && <TableCell>{app.applicant}</TableCell>}
                      <TableCell>{app.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={app.status.replace(/_/g, " ")}
                          color={
                            getStatusColor(app.status) as "success" | "error" | "warning" | "default"
                          }
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
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
                                onClick={() => setSelectedApplicationId(app.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Dialog open={Boolean(selectedApplication)} onClose={closeDialog} fullWidth maxWidth="md">
          <DialogTitle>
            {isAdopter ? "Application Details" : "Review Application"}
          </DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                        Match Overview
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                        {selectedApplication.pet.name}
                      </Typography>
                      <Stack spacing={1.1}>
                        <Typography variant="body2">
                          <strong>Applicant:</strong> {selectedApplication.applicant.name}
                          {!isAdopter && selectedApplication.applicant.email
                            ? ` (${selectedApplication.applicant.email})`
                            : ""}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong> {selectedApplication.status.replace(/_/g, " ")}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Housing:</strong> {selectedApplication.questionnaire.housingType}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Has Yard:</strong> {selectedApplication.questionnaire.hasYard ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Household:</strong> {selectedApplication.questionnaire.householdAdults} adults,{" "}
                          {selectedApplication.questionnaire.householdChildren} children
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                        Context
                      </Typography>
                      <Stack spacing={1.1} sx={{ mt: 1 }}>
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
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                  <Grid size={{ xs: 12 }}>
                    <Alert severity="warning">{selectedApplication.rejectionReason}</Alert>
                  </Grid>
                )}

                {!isAdopter && selectedApplication.status === "under_review" && (
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Reason for rejection"
                      value={rejectionReason}
                      onChange={(event) => setRejectionReason(event.target.value)}
                    />
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
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
