import { useUser } from "@clerk/clerk-react";
import {
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { get } from "../services/apiClient";
import COLORS from "../theme/colors";

export const MyDocumentsPage = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const email = user?.emailAddresses?.[0]?.emailAddress;
      if (!email) return;
      setLoading(true);
      setError(null);
      try {
        const [docsRes, sumsRes] = await Promise.all([
          get("/documents/api/by-email", { email }),
          get("/documents/api/summaries", { email }),
        ]);
        setDocuments(docsRes.documents || []);
        setSummaries(sumsRes.summaries || []);
      } catch (err) {
        setError(err.message || "Eroare la încărcarea datelor.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Paper
      sx={{
        padding: "24px 48px 24px 24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px COLORS.SHADOW_DEFAULT",
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Box
            sx={{
              width: "48%",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mb: 2, pl: 0 }}
            >
              Documente Încărcate
            </Typography>
            <Box sx={{ overflowY: "auto", maxHeight: "100%" }}>
              {documents.length === 0 ? (
                <Box
                  sx={{
                    color: COLORS.TEXT_SECONDARY,
                    pl: 0,
                  }}
                >
                  <Typography sx={{ color: COLORS.TEXT_SECONDARY }}>
                    Nu ai documente încărcate.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ pl: 0 }}>
                  {documents.map((doc) => (
                    <ListItem
                      key={doc.id}
                      sx={{
                        borderRadius: "8px",
                        mb: 1,
                        backgroundColor: COLORS.BACKGROUND_LIGHT,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight={600}>{doc.name}</Typography>
                        }
                        secondary={`${formatFileSize(doc.size)} • ${formatDate(
                          doc.created_at
                        )}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              width: "48%",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mb: 2, pl: 0 }}
            >
              Rezumate
            </Typography>
            <Box sx={{ overflowY: "auto", maxHeight: "100%" }}>
              {summaries.length === 0 ? (
                <Box
                  sx={{
                    color: COLORS.TEXT_SECONDARY,
                    pl: 0,
                  }}
                >
                  <Typography sx={{ color: COLORS.TEXT_SECONDARY }}>
                    Nu există rezumate generate încă.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ pl: 0 }}>
                  {summaries.map((summary) => (
                    <ListItem
                      key={summary.summaryId}
                      sx={{
                        borderRadius: "8px",
                        mb: 1,
                        backgroundColor: COLORS.BACKGROUND_LIGHT,
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight={600}>
                            {summary.documentName} • {summary.size} caractere
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Document: {summary.documentName} (
                              {(summary.documentSize / 1024).toFixed(2)} KB) •{" "}
                              {formatDate(summary.documentCreatedAt)}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                mt: 1,
                                whiteSpace: "pre-wrap",
                                lineHeight: 1.6,
                              }}
                            >
                              {summary.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 1 }}
                            >
                              Rezumat generat la:{" "}
                              {formatDate(summary.created_at)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
