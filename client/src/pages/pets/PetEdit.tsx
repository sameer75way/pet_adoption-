import { useEffect } from "react";
import { Container, CircularProgress, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../app/store";
import { clearCurrentPet, fetchPetById, updatePet } from "../../features/pets/petSlice";
import PetForm from "../../components/pets/PetForm";

const PetEdit = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentPet, loading, error } = useSelector((state: RootState) => state.pets);

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id));
    }

    return () => {
      dispatch(clearCurrentPet());
    };
  }, [dispatch, id]);

  if (!currentPet && loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!currentPet) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error || "Pet not found."}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <PetForm
          title={`Edit ${currentPet.name}`}
          subtitle="Update the intake profile, shelter details, and adoption readiness for this pet."
          submitLabel="Save Changes"
          initialPet={currentPet}
          onSubmit={async (data) => {
            const updated = await dispatch(updatePet({ id: currentPet._id, data })).unwrap();
            navigate(`/pets/${updated._id}`);
          }}
        />
      </motion.div>
    </Container>
  );
};

export default PetEdit;
