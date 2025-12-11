import { ContentCopy, Download } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";

import { MESSAGES } from "../../constants/common";
import COLORS from "../../theme/colors";
import { formatDate } from "../../utils/common";

export const MainModal = ({
  open,
  onClose,
  summary,
  documentName,
  onCopy,
  onDownload,
}) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: COLORS.PRIMARY_ULTRA_LIGHT,
          color: COLORS.PRIMARY_MAIN,
          fontWeight: 600,
        }}
      >
        <Typography variant="h6">{MESSAGES.SUMMARY_DIALOG_TITLE}</Typography>

        <Box>
          <Tooltip title={MESSAGES.SUMMARY_COPY_TOOLTIP}>
            <IconButton
              onClick={onCopy}
              size="small"
              sx={{ color: COLORS.PRIMARY_MAIN, mr: 1 }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={MESSAGES.SUMMARY_DOWNLOAD_TOOLTIP}>
            <IconButton
              onClick={onDownload}
              size="small"
              sx={{ color: COLORS.PRIMARY_MAIN }}
            >
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {summary ? (
          <Box>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
                color: "text.primary",
                fontSize: "1rem",
              }}
            >
              {summary.content}
            </Typography>
            {summary.created_at && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 2, fontStyle: "italic" }}
              >
                {MESSAGES.SUMMARY_GENERATED_AT} {formatDate(summary.created_at)}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary">
            {MESSAGES.NO_SUMMARY_AVAILABLE}
          </Typography>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, backgroundColor: COLORS.BACKGROUND_LIGHT }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: COLORS.PRIMARY_MAIN,
            "&:hover": {
              backgroundColor: COLORS.PURPLE_LAVANDER,
            },
          }}
        >
          {MESSAGES.CLOSE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
