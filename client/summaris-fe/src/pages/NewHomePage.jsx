import { CloudUpload, Delete } from "@mui/icons-material";
import {
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
import axios from "axios";
import { useState } from "react";

export const NewHomePage = () => {
  const [documents, setDocuments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setLoading(true);
    console.log("file", file);
    setDocuments((prev) => [...prev, file]);
    try {
      console.log("Uploading file:", file.name);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    setDocuments(documents.filter((d) => d.id !== docId));
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null);
    }
  };

  console.log("documents", documents);

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

  const handleObtineRezumat = async () => {
    console.log("trimite doc la be");
    try {
      const res = await axios.post();
    } catch (error) {}
  };
  return (
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
      <Card
        sx={{ p: 3, borderRadius: 4, alignContent: "center", display: "flex" }}
      >
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Platforma noastră de management inteligent al informației!
            Utilizează-ți eficient timpul cu rezumate automate pentru
            documentele tale PDF.
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            Te invităm să testezi aplicația — ai la dispoziție 3 încercări
            gratuite.
          </Typography>
        </CardContent>
      </Card>

      <Typography
        variant="h6"
        sx={{ marginBottom: "24px", fontWeight: 600, marginTop: "40px" }}
      >
        Documente
      </Typography>

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
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {documents.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              padding: "24px",
              color: "#7c3aed",
            }}
          >
            <Typography sx={{ color: "#7c3aed" }}>
              Nu există documente încărcate
            </Typography>
          </Box>
        ) : (
          <List>
            {documents.map((doc) => (
              <ListItem
                key={doc.id}
                sx={{
                  borderRadius: "8px",
                  marginBottom: "8px",

                  cursor: "pointer",
                }}
              >
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
                    marginRight: "16px",
                    "&:hover": {
                      backgroundColor: "#f3e8ff",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#831DC6",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#a066de",
                    },
                  }}
                  onClick={handleObtineRezumat}
                >
                  Obtine rezumat
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};
