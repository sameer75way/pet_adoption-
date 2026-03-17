import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { motion } from "framer-motion";
import type { AppDispatch } from "../../app/store";
import { createPet } from "../../features/pets/petSlice";
import PetForm from "../../components/pets/PetForm";

const PetCreate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <PetForm
          title="Add New Pet"
          subtitle="Create a full intake record so the pet can move through medical review, fostering, and adoption."
          submitLabel="Create Pet"
          onSubmit={async (data) => {
            const created = await dispatch(createPet(data)).unwrap();
            navigate(`/pets/${created._id}`);
          }}
        />
      </motion.div>
    </Container>
  );
};

export default PetCreate;
