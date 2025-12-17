import { useUser } from "@clerk/clerk-react";
import { CloudUpload, Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { MainModal } from "../components/common/Modal";
import { PlanCard } from "../components/plans/PlanCard";
import { MESSAGES, SUBSCRIPTIONS } from "../constants/common";
import { ERRORS, SUCCESS } from "../constants/toastMessages";
import { get, post } from "../services/apiClient";
import COLORS from "../theme/colors";
import { formatDate, formatFileSize } from "../utils/common";

export const HomePage = () => {
  const { user } = useUser();
  const [document, setDocument] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [planSuccess, setPlanSuccess] = useState(null);
  const [activePlanId, setActivePlanId] = useState(null);

  // Map subscription name to plan ID
  const getPlanIdFromSubscriptionName = (subscriptionName) => {
    const nameToIdMap = {
      Gratuit: "free",
      Pro: "pro",
      Premium: "premium",
    };
    return nameToIdMap[subscriptionName] || null;
  };

  // Fetch current subscription
  useEffect(() => {
    const fetchActivePlan = async () => {
      const email = user?.emailAddresses?.[0]?.emailAddress;
      if (!email) return;
      try {
        const res = await get("/subscriptions/api", { email });
        const subscriptionName = res.subscription?.name;
        if (subscriptionName) {
          const planId = getPlanIdFromSubscriptionName(subscriptionName);
          setActivePlanId(planId);
        }
      } catch (err) {
        console.error("Failed to fetch active plan:", err);
      }
    };
    fetchActivePlan();
  }, [user, planSuccess]);

  const plans = SUBSCRIPTIONS;

  const handleSelectPlan = async (planId) => {
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      setError(ERRORS.SELECT_PLAN_AUTH);
      return;
    }
    setPlanLoading(true);
    setPlanSuccess(null);
    setError(null);
    try {
      await post("/subscriptions/api/select", { email, plan: planId });
      setPlanSuccess(SUCCESS.SELECT_PLAN);
    } catch (err) {
      console.error("Select plan error:", err);
      setError(err.data?.message || err.message || ERRORS.SELECT_PLAN);
    } finally {
      setPlanLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      setError(ERRORS.UPLOAD_AUTH);
      return;
    }

    // Verifică dimensiunea fișierului (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError(ERRORS.FILE_DIMENSION);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setLimitReached(false);

    try {
      const email = user.emailAddresses[0].emailAddress;

      const response = await post("/documents/api/upload", {
        email,
        name: file.name,
        size: file.size,
        s3_url: "",
      });

      setDocument({
        id: response.document.id,
        name: response.document.name,
        size: response.document.size,
        created_at: response.document.created_at,
      });

      setSuccess(SUCCESS.UPLOAD_SUCCESS(response.remainingAttempts));

      if (response.remainingAttempts === 0) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (error.data?.limitReached || error.message?.includes("limita")) {
        setLimitReached(true);
        setError(error.data?.message || error.message || ERRORS.FREE_LIMIT);
      } else if (error.data?.error === "Document already exists") {
        setError(error.data?.message || ERRORS.SINGLE_UPLOAD);
      } else {
        setError(error.data?.message || error.message || ERRORS.UPLOAD_ERR);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    setDocument(null);
    setError(null);
    setSuccess(null);
    setLimitReached(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleCopySummary = () => {
    if (summary?.content) {
      navigator.clipboard.writeText(summary.content);
      setSuccess(SUCCESS.SUMMARY_COPIED);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDownloadSummary = () => {
    if (summary?.content) {
      const blob = new Blob([summary.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rezumat-${document?.name || "document"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess(SUCCESS.SUMMARY_DOWNLOADED);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleObtineRezumat = async () => {
    if (!document || !user?.emailAddresses?.[0]?.emailAddress) {
      setError(ERRORS.NO_DOCUMENT_FOR_SUMMARY);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const email = user.emailAddresses[0].emailAddress;
      const response = await post(`/documents/api/${document.id}/summarize`, {
        email,
      });

      setSummary(response.summary);
      setSummaryDialogOpen(true);
      setSuccess(SUCCESS.SUMMARY_GENERATED);
    } catch (error) {
      console.error("Summarize error:", error);
      setError(
        error.data?.message || error.message || ERRORS.SUMMARY_GENERATION
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Paper
      sx={{
        padding: "24px 48px 24px 24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 2px 8px ${COLORS.SHADOW_DEFAULT}`,
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      <Card
        sx={{ p: 3, borderRadius: 4, alignContent: "center", display: "flex" }}
      >
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {MESSAGES.PLATFORM_DESCRIPTION}
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {MESSAGES.FREE_LIMIT}
          </Typography>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
          mt: 2,
          mb: 4,
        }}
      >
        {plans.map((plan) => {
          const isActive = plan.id === activePlanId;
          return (
            <PlanCard
              plan={plan}
              handleClick={() => handleSelectPlan(plan.id)}
              isLoading={planLoading}
              isActive={isActive}
            />
          );
        })}
      </Box>

      <Typography
        variant="h6"
        sx={{ marginBottom: "24px", fontWeight: 600, marginTop: "40px" }}
      >
        {MESSAGES.DOCUMENTS_TITLE}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {planSuccess && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setPlanSuccess(null)}
        >
          {planSuccess}
        </Alert>
      )}

      {limitReached && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {ERRORS.FREE_LIMIT}
        </Alert>
      )}

      <Box
        sx={{
          border: `2px dashed ${
            isDragging ? COLORS.PRIMARY_MAIN : COLORS.PRIMARY_LIGHTER
          }`,
          borderRadius: "8px",
          padding: "24px",
          textAlign: "center",
          backgroundColor: isDragging
            ? COLORS.PRIMARY_ULTRA_LIGHT
            : COLORS.BACKGROUND_LIGHT,
          cursor: document || limitReached ? "not-allowed" : "pointer",
          opacity: document || limitReached ? 0.6 : 1,
          transition: "all 0.3s ease",
          marginBottom: "24px",
          pointerEvents: document || limitReached ? "none" : "auto",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!document && !limitReached) {
            window.document.getElementById("file-input").click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt"
        />
        <CloudUpload
          sx={{
            fontSize: "48px",
            color: COLORS.PRIMARY_MAIN,
            marginBottom: "12px",
          }}
        />
        <Typography variant="body1" sx={{ marginBottom: "8px" }}>
          {document || limitReached
            ? MESSAGES.UPLOAD_SINGLE_DOCUMENT
            : MESSAGES.UPLOAD_DRAG_OR_CLICK}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {MESSAGES.FILE_TYPES}
        </Typography>
        {loading && (
          <CircularProgress
            size={24}
            sx={{ marginTop: "24px", color: COLORS.PRIMARY_MAIN }}
          />
        )}
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {!document ? (
          <Box
            sx={{
              textAlign: "center",
              padding: "24px",
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            <Typography sx={{ color: COLORS.TEXT_SECONDARY }}>
              {MESSAGES.NO_DOCUMENT}
            </Typography>
          </Box>
        ) : (
          <List>
            <ListItem
              sx={{
                borderRadius: "8px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
            >
              <ListItemText
                primary={document.name}
                secondary={`${formatFileSize(document.size)} • ${formatDate(
                  document.created_at
                )}`}
              />
              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDocument(document.id);
                }}
                size="small"
                sx={{
                  color: COLORS.PRIMARY_MAIN,
                  marginRight: "16px",
                  "&:hover": {
                    backgroundColor: COLORS.PRIMARY_ULTRA_LIGHT,
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
              <Button
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: COLORS.PRIMARY_MAIN,
                  color: COLORS.WHITE,
                  "&:hover": {
                    backgroundColor: COLORS.PURPLE_LAVANDER,
                  },
                  "&:disabled": {
                    backgroundColor: COLORS.GRAY,
                  },
                }}
                onClick={handleObtineRezumat}
              >
                {loading ? MESSAGES.PROCESSING : MESSAGES.GET_SUMMARY}
              </Button>
            </ListItem>
          </List>
        )}
      </Box>

      <MainModal
        open={summaryDialogOpen}
        onClose={() => setSummaryDialogOpen(false)}
        summary={summary}
        documentName={document?.name}
        onCopy={handleCopySummary}
        onDownload={handleDownloadSummary}
      />
    </Paper>
  );
};
