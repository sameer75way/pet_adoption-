import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import api from "../../services/api";

interface Conversation {
  _id: string;
  participants: Array<{ _id: string; name: string }>;
  lastMessage?: { content: string };
}

interface Message {
  _id: string;
  content: string;
  sender?: { name?: string };
}

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const loadConversations = async () => {
      const response = await api.get("/messages/conversations");
      setConversations(response.data.data);
      if (response.data.data[0]) {
        setSelectedConversation(response.data.data[0]._id);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    const loadMessages = async () => {
      const response = await api.get(`/messages/${selectedConversation}`);
      setMessages(response.data.data);
    };

    loadMessages();
  }, [selectedConversation]);

  const sendMessage = async () => {
    if (!selectedConversation || !draft.trim()) return;

    const response = await api.post(`/messages/${selectedConversation}`, {
      content: draft,
    });
    setMessages((current) => [...current, response.data.data]);
    setDraft("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Messages
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "320px 1fr" }, gap: 3 }}>
          <Card>
            <CardContent>
              <List sx={{ p: 0 }}>
                {conversations.map((conversation) => (
                  <ListItemButton
                    key={conversation._id}
                    selected={conversation._id === selectedConversation}
                    onClick={() => setSelectedConversation(conversation._id)}
                  >
                    <ListItemText
                      primary={conversation.participants.map((participant) => participant.name).join(", ")}
                      secondary={conversation.lastMessage?.content || "No messages yet"}
                    />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: "grid", gap: 2 }}>
                {messages.map((message) => (
                  <Box key={message._id} sx={{ p: 2, borderRadius: 2, bgcolor: "grey.100" }}>
                    <Typography variant="caption" color="text.secondary">
                      {message.sender?.name || "Shelter Team"}
                    </Typography>
                    <Typography variant="body2">{message.content}</Typography>
                  </Box>
                ))}
                <TextField
                  multiline
                  minRows={3}
                  placeholder="Write a message to the shelter team..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <Button variant="contained" onClick={sendMessage}>
                  Send Message
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </motion.div>
    </Container>
  );
};

export default MessagesPage;
