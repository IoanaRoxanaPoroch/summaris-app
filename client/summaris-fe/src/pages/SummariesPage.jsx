import { useUser } from "@clerk/clerk-react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { get } from "../services/apiClient";

export const SummariesPage = () => {
  const { user } = useUser();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;
      setLoading(true);
      setError(null);
      try {
        const email = user.emailAddresses[0].emailAddress;
        const response = await get("/documents/api/summaries", { email });
        setSummaries(response.summaries || []);
      } catch (err) {
        setError(err.message || "Eroare la încărcarea rezumatelor.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
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
      <Card sx={{ p: 3, borderRadius: 4, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Rezumatele mele
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vezi rezumatele generate pentru documentele tale.
          </Typography>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : summaries.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            padding: "24px",
            color: COLORS.TEXT_SECONDARY,
          }}
        >
          <Typography sx={{ color: COLORS.TEXT_SECONDARY }}>
            Nu ai rezumate încă.
          </Typography>
        </Box>
      ) : (
        <List sx={{ overflowY: "auto", flex: 1 }}>
          {summaries.map((summary) => (
            <ListItem
              key={summary.summaryId}
              sx={{
                borderRadius: "8px",
                mb: 1,
                alignItems: "flex-start",
                backgroundColor: COLORS.BACKGROUND_LIGHT,
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
                      sx={{ mt: 1, whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                    >
                      {summary.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Rezumat generat la: {formatDate(summary.created_at)}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};
