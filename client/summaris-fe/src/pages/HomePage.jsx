import {
  Check,
  CloudUpload,
  Dashboard,
  Folder,
  Home,
  Settings,
  Star,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./homePage.css";

const HomePage = ({ activePage, onDocumentCountChange }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { id: "home", label: "Acasă", icon: <Home /> },
    { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
    { id: "documents", label: "Documente", icon: <Folder /> },
    { id: "settings", label: "Setări", icon: <Settings /> },
  ];

  // Mock data - replace with actual API calls
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetch('/api/users/api/:userId')
    // setUser({
    //   id: "1",
    //   email: "user@example.com",
    //   subscription: { name: "Free" },
    //   documents: [],
    // });

    // TODO: Replace with actual API call
    // fetch('/api/documents/api?user_id=:userId')
    setDocuments([
      {
        id: "1",
        name: "Document 1.pdf",
        created_at: new Date(),
        size: 1024000,
      },
      {
        id: "2",
        name: "Document 2.pdf",
        created_at: new Date(),
        size: 2048000,
      },
    ]);
  }, []);

  useEffect(() => {
    // Update document count in parent
    if (onDocumentCountChange) {
      onDocumentCountChange(documents.length);
    }
  }, [documents, onDocumentCountChange]);

  const handleFileUpload = async (file) => {
    setLoading(true);
    try {
      // TODO: Implement file upload
      // const formData = new FormData();
      // formData.append('file', file);
      // await fetch('/api/documents/create', { method: 'POST', body: formData });

      console.log("Uploading file:", file.name);
      // Refresh documents list
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc);
    // TODO: Fetch document details and summary
    // fetch(`/api/documents/api/${doc.id}`)
  };

  const handleDeleteDocument = async (docId) => {
    // TODO: Implement delete
    // await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
    setDocuments(documents.filter((d) => d.id !== docId));
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const documentCount = documents.length;
  const planName = "Free"; // Mock data, will be updated by App.jsx

  const getPlanBadgeStyle = (plan) => {
    const getColor = () => {
      switch (plan?.toLowerCase()) {
        case "premium":
          return { bg: "#a855f7", color: "#fff" };
        case "pro":
          return { bg: "#831DC6", color: "#fff" };
        default:
          return { bg: "#6b21a8", color: "#fff" };
      }
    };
    const colors = getColor();
    return {
      backgroundColor: colors.bg,
      color: colors.color,
      fontWeight: 600,
      fontSize: "0.875rem",
    };
  };

  const handleNavigation = (pageId) => {
    // This function is now handled by App.jsx
  };

  const handleLogout = () => {
    // TODO: Implement logout
    console.log("Logout");
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "0",
      period: "lună",
      features: [
        "Până la 5 documente/lună",
        "Rezumat de bază",
        "Suport prin email",
        "Stocare limitată",
      ],
      color: "#6b21a8",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "29",
      period: "lună",
      features: [
        "Până la 50 documente/lună",
        "Rezumat detaliat",
        "Suport priorititar",
        "Stocare extinsă",
        "Export în multiple formate",
      ],
      color: "#831DC6",
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "59",
      period: "lună",
      features: [
        "Documente nelimitate",
        "Rezumat avansat cu AI",
        "Suport 24/7",
        "Stocare nelimitată",
        "Export în multiple formate",
        "API access",
        "Integrare cu servicii externe",
      ],
      color: "#a855f7",
      popular: false,
    },
  ];

  // Return only the content based on activePage
  if (activePage === "home") {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "24px",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Plans Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, marginBottom: "16px", color: "#6b21a8" }}
          >
            Planuri disponibile
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              width: "100%",
            }}
          >
            {plans.map((plan) => (
              <Card
                key={plan.id}
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: plan.popular
                    ? "0 8px 24px rgba(131, 29, 198, 0.2)"
                    : "0 2px 8px rgba(0,0,0,0.1)",
                  border: plan.popular
                    ? `2px solid ${plan.color}`
                    : "1px solid #e0e0e0",
                  borderRadius: "12px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 32px rgba(131, 29, 198, 0.25)",
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Popular"
                    sx={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      backgroundColor: plan.color,
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                    icon={<Star sx={{ fontSize: "14px" }} />}
                  />
                )}
                <CardContent sx={{ padding: "24px", flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: "8px",
                      color: "#6b21a8",
                    }}
                  >
                    {plan.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      marginBottom: "16px",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: plan.color }}
                    >
                      {plan.price}€
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginLeft: "4px" }}
                    >
                      /{plan.period}
                    </Typography>
                  </Box>
                  <Divider sx={{ marginBottom: "16px" }} />
                  <List sx={{ padding: 0 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ padding: "4px 0" }}>
                        <ListItemIcon sx={{ minWidth: "28px" }}>
                          <Check sx={{ color: plan.color, fontSize: "18px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: "body2",
                            sx: { color: "#333" },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ padding: "12px 24px 24px" }}>
                  <Button
                    fullWidth
                    variant={plan.popular ? "contained" : "outlined"}
                    sx={{
                      backgroundColor: plan.popular
                        ? plan.color
                        : "transparent",
                      color: plan.popular ? "#fff" : plan.color,
                      borderColor: plan.color,
                      padding: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    onClick={() => {
                      console.log("Selected plan:", plan.id);
                    }}
                  >
                    {plan.id === "free"
                      ? "Planul curent"
                      : plan.id === planName?.toLowerCase()
                      ? "Planul curent"
                      : "Upgrade"}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Documents Section */}
        <Paper
          sx={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
            minHeight: 0,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "24px", fontWeight: 600, color: "#6b21a8" }}
          >
            Documente
          </Typography>

          {/* Upload Area */}
          <Box
            sx={{
              border: `2px dashed ${isDragging ? "#831DC6" : "#c084fc"}`,
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
              backgroundColor: isDragging ? "#f3e8ff" : "#fafafa",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginBottom: "24px",
              "&:hover": {
                borderColor: "#831DC6",
                backgroundColor: "#f3e8ff",
              },
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
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
                color: "#831DC6",
                marginBottom: "12px",
              }}
            />
            <Typography variant="body1" sx={{ marginBottom: "8px" }}>
              Trageți fișierele aici sau faceți clic pentru a încărca
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PDF, DOC, DOCX, TXT (max 10MB)
            </Typography>
            {loading && (
              <CircularProgress
                size={24}
                sx={{ marginTop: "24px", color: "#831DC6" }}
              />
            )}
          </Box>

          {/* Document List */}
          {/* <Box sx={{ flex: 1, overflowY: "auto" }}>
            {documents.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  padding: "24px",
                  color: "#7c3aed",
                }}
              >
                <Description
                  sx={{
                    fontSize: "48px",
                    marginBottom: "12px",
                    opacity: 0.3,
                    color: "#831DC6",
                  }}
                />
                <Typography sx={{ color: "#7c3aed" }}>Nu există documente încărcate</Typography>
              </Box>
            ) : (
              <List>
                {documents.map((doc) => (
                  <ListItem
                    key={doc.id}
                    sx={{
                      borderRadius: "8px",
                      marginBottom: "8px",
                      backgroundColor:
                        selectedDocument?.id === doc.id
                          ? "#f3e8ff"
                          : "#ffffff",
                      border:
                        selectedDocument?.id === doc.id
                          ? `2px solid #831DC6`
                          : "1px solid #e9d5ff",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor:
                          selectedDocument?.id === doc.id
                            ? "#f3e8ff"
                            : "#fafafa",
                      },
                    }}
                    onClick={() => handleDocumentSelect(doc)}
                  >
                    <Description
                      sx={{ marginRight: "12px", color: "#831DC6" }}
                    />
                    <ListItemText
                      primary={doc.name}
                      secondary={`${formatFileSize(doc.size)} • ${formatDate(
                        doc.created_at
                      )}`}
                    />
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                      size="small"
                      sx={{
                        color: "#831DC6",
                        "&:hover": {
                          backgroundColor: "#f3e8ff",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box> */}
        </Paper>
      </Box>
    );
  }

  // Other pages content
  return (
    <Box
      sx={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        padding: "24px",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* Left Section - Documents */}
      <Paper
        sx={{
          padding: "24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "24px", fontWeight: 600 }}>
          Documente
        </Typography>

        {/* Upload Area */}
        <Box
          sx={{
            border: `2px dashed ${isDragging ? "#831DC6" : "#c084fc"}`,
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: isDragging ? "#f3e8ff" : "#fafafa",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginBottom: "24px",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
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
              color: "#831DC6",
              marginBottom: "12px",
            }}
          />
          <Typography variant="body1" sx={{ marginBottom: "8px" }}>
            Trageți fișierele aici sau faceți clic pentru a încărca
          </Typography>
          <Typography variant="body2" color="text.secondary">
            PDF, DOC, DOCX, TXT (max 10MB)
          </Typography>
          {loading && (
            <CircularProgress
              size={24}
              sx={{ marginTop: "24px", color: "#831DC6" }}
            />
          )}
        </Box>

        {/* Document List */}
        {/* <Box sx={{ flex: 1, overflowY: "auto" }}>
          {documents.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                padding: "24px",
                color: "text.secondary",
              }}
            >
              <Description
                sx={{
                  fontSize: "48px",
                  marginBottom: "12px",
                  opacity: 0.3,
                }}
              />
              <Typography>Nu există documente încărcate</Typography>
            </Box>
          ) : (
            <List>
              {documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    borderRadius: "8px",
                    marginBottom: "8px",
                    backgroundColor:
                      selectedDocument?.id === doc.id ? "#e3f2fd" : "#ffffff",
                    border:
                      selectedDocument?.id === doc.id
                        ? `2px solid #1976d2`
                        : "1px solid #e0e0e0",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDocumentSelect(doc)}
                >
                  <Description sx={{ marginRight: "12px", color: "#666" }} />
                  <ListItemText
                    primary={doc.name}
                    secondary={`${formatFileSize(doc.size)} • ${formatDate(
                      doc.created_at
                    )}`}
                  />
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc.id);
                    }}
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box> */}
      </Paper>

      {/* Right Section - Details & Summary */}
      {/* <Paper
        sx={{
          padding: "24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Detalii & Rezumat
          </Typography>
          {selectedDocument && (
            <IconButton size="small" onClick={() => setSelectedDocument(null)}>
              <Refresh />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ marginBottom: "24px" }} />

        {!selectedDocument ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Description
              sx={{
                fontSize: "64px",
                marginBottom: "24px",
                opacity: 0.2,
              }}
            />
            <Typography variant="h6" sx={{ marginBottom: "8px" }}>
              Selectați un document
            </Typography>
            <Typography variant="body2">
              Alegeți un document din listă pentru a vedea detaliile și
              rezumatul
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <Box sx={{ marginBottom: "24px" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ marginBottom: "8px" }}
              >
                Nume document
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: "16px" }}>
                {selectedDocument.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: "24px",
                  marginBottom: "16px",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mărime
                  </Typography>
                  <Typography variant="body1">
                    {formatFileSize(selectedDocument.size)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Data încărcării
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedDocument.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ margin: "24px 0" }} />

            <Box>
              <Typography
                variant="subtitle1"
                sx={{ marginBottom: "16px", fontWeight: 600 }}
              >
                Rezumat
              </Typography>
              {selectedDocument.summary ? (
                <Paper
                  sx={{
                    padding: "16px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {selectedDocument.summary.content ||
                      "Rezumatul va apărea aici după procesare..."}
                  </Typography>
                </Paper>
              ) : (
                <Box
                  sx={{
                    padding: "24px",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  <CircularProgress size={24} sx={{ marginBottom: "12px" }} />
                  <Typography variant="body2">
                    Rezumatul este în procesare...
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Paper> */}
    </Box>
  );
};

export default HomePage;
