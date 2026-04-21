import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ChatBubbleOutline, Close } from "@mui/icons-material";
import api from "../../services/api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const initialSuggestions = [
  "How do I apply to adopt a pet?",
  "Show me available dogs.",
  "How does foster work?",
  "Where can I check my application status?",
];

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

const toBlocks = (content: string): ContentBlock[] => {
  const lines = content.split("\n");
  const blocks: ContentBlock[] = [];

  let listItems: string[] = [];
  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    const bulletMatch = trimmed.match(/^([*-])\s+(.*)$/);
    if (bulletMatch) {
      listItems.push(bulletMatch[2]);
      continue;
    }

    flushList();
    blocks.push({ type: "paragraph", text: trimmed });
  }

  flushList();
  return blocks;
};

const renderInlineBold = (text: string) => {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <Box component="strong" key={`${part}-${index}`} sx={{ fontWeight: 800 }}>
          {part}
        </Box>
      );
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
};

const ChatbotWidget = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousResponseId, setPreviousResponseId] = useState<string | undefined>(undefined);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => draft.trim().length > 0 && !loading, [draft, loading]);

  useEffect(() => {
    if (!open) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [open, messages.length, loading]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setError(null);
    setLoading(true);
    setDraft("");

    setMessages((current) => [...current, { role: "user", content: trimmed }]);

    try {
      const response = await api.post("/chat", {
        message: trimmed,
        previousResponseId,
      });

      const answer = response.data?.data?.answer as string | undefined;
      const responseId = response.data?.data?.responseId as string | undefined;

      setPreviousResponseId(responseId || previousResponseId);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: answer || "I couldn't generate an answer. Please try again." },
      ]);
    } catch (chatError) {
      const err = chatError as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Chat failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ position: "fixed", right: 18, bottom: 18, zIndex: 1400 }}>
        <IconButton
          onClick={() => setOpen((current) => !current)}
          sx={{
            bgcolor: "primary.main",
            color: "#fff",
            width: 54,
            height: 54,
            boxShadow: "0 18px 42px rgba(27, 43, 52, 0.28)",
            "&:hover": { bgcolor: "primary.dark" },
          }}
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? <Close /> : <ChatBubbleOutline />}
        </IconButton>
      </Box>

      {open && (
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            inset: isMobile ? 10 : "auto",
            right: isMobile ? "auto" : 18,
            bottom: isMobile ? "auto" : 86,
            width: isMobile ? "auto" : 420,
            height: isMobile ? "auto" : 560,
            maxWidth: isMobile ? "none" : "min(420px, calc(100vw - 36px))",
            maxHeight: isMobile ? "calc(100dvh - 20px)" : "calc(100dvh - 120px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: isMobile ? 4 : 3,
            overflow: "hidden",
            border: "1px solid rgba(195, 180, 161, 0.35)",
            background: "rgba(255, 251, 245, 0.92)",
            backdropFilter: "blur(18px)",
            zIndex: 1401,
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              position: "sticky",
              top: 0,
              zIndex: 1,
              background: "rgba(255, 251, 245, 0.92)",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 800 }}>PetAdopt Assistant</Typography>
              <Typography variant="caption" color="text.secondary">
                Ask about pets, adoption, foster, and app features.
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} aria-label="Close chat">
              <Close />
            </IconButton>
          </Box>
          <Divider />

          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {messages.length === 0 ? (
              <Stack spacing={1.2}>
                <Typography variant="body2" color="text.secondary">
                  Try one of these:
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} flexWrap="wrap" gap={1}>
                  {initialSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      size="small"
                      variant="outlined"
                      onClick={() => void sendMessage(suggestion)}
                      sx={{ borderRadius: 999, justifyContent: "flex-start" }}
                      fullWidth={isMobile}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={1.5}>
                {messages.map((message, index) => (
                  <Box
                    key={`${message.role}-${index}`}
                    sx={{
                      display: "flex",
                      justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        px: 1.5,
                        py: 1.1,
                        maxWidth: { xs: "92%", sm: "85%" },
                        borderRadius: 2.5,
                        bgcolor:
                          message.role === "user"
                            ? "rgba(31, 111, 120, 0.16)"
                            : "rgba(255, 255, 255, 0.9)",
                        border:
                          message.role === "user"
                            ? "1px solid rgba(31, 111, 120, 0.16)"
                            : "1px solid rgba(195, 180, 161, 0.35)",
                      }}
                    >
                      {message.role === "assistant" ? (
                        <Stack spacing={0.75}>
                          {toBlocks(message.content).map((block, blockIndex) => {
                            if (block.type === "list") {
                              return (
                                <Box
                                  key={`list-${blockIndex}`}
                                  component="ul"
                                  sx={{
                                    pl: 2.25,
                                    my: 0,
                                    "& li": { mt: 0.3 },
                                  }}
                                >
                                  {block.items.map((item, itemIndex) => (
                                    <Box key={`item-${itemIndex}`} component="li">
                                      <Typography variant="body2">
                                        {renderInlineBold(item)}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              );
                            }

                            return (
                              <Typography key={`p-${blockIndex}`} variant="body2">
                                {renderInlineBold(block.text)}
                              </Typography>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                          {message.content}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                ))}
                {loading && (
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 1.5,
                        py: 1.1,
                        borderRadius: 2.5,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid rgba(195, 180, 161, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Thinking…
                      </Typography>
                    </Paper>
                  </Box>
                )}
                {error && (
                  <Typography variant="caption" color="error.main">
                    {error}
                  </Typography>
                )}
                <Box ref={scrollAnchorRef} />
              </Stack>
            )}
          </Box>

          <Divider />
          <Box
            sx={{
              p: 1.5,
              position: "sticky",
              bottom: 0,
              zIndex: 1,
              background: "rgba(255, 251, 245, 0.92)",
            }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your question…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                multiline
                maxRows={4}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (canSend) void sendMessage(draft);
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={() => void sendMessage(draft)}
                disabled={!canSend}
                sx={{ minWidth: isMobile ? 84 : 90, borderRadius: 999 }}
              >
                Send
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatbotWidget;
