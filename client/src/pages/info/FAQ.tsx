import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How long does adoption review take?",
    answer: "Most applications are reviewed within two to four business days, depending on reference checks and pet-specific needs.",
  },
  {
    question: "Can I apply for more than one pet?",
    answer: "Yes. The team will help you decide which pet is the best fit if multiple matches look promising.",
  },
  {
    question: "Do you support foster-to-adopt?",
    answer: "Yes. Approved adopters may be invited into a foster-to-adopt path when a pet needs a slower transition.",
  },
];

const FAQPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          A quick guide to the adoption process, timelines, and what happens after you apply.
        </Typography>

        {faqs.map((faq) => (
          <Accordion key={faq.question} sx={{ mb: 2, borderRadius: 3, overflow: "hidden" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </motion.div>
    </Container>
  );
};

export default FAQPage;
