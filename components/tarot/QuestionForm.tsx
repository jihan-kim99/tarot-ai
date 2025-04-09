// QuestionForm.tsx - Initial form for user info and question
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, Typography, TextField, Button } from "@mui/material";

interface QuestionFormProps {
  onSubmit: (userInfo: string, question: string) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const [userInfo, setUserInfo] = useState<string>("");
  const [question, setQuestion] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo && question) {
      onSubmit(userInfo, question);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "500px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom>
          Prepare Your Tarot Reading
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Share some information and your question. Then you&apos;ll select a
          card for your reading.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Who are you? (e.g., age, situation)"
            margin="normal"
            value={userInfo}
            onChange={(e) => setUserInfo(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="What would you like to know?"
            margin="normal"
            multiline
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Continue to Card Selection
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default QuestionForm;
