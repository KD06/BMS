import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackbarMessage = (props) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={props.open}
      onClose={props.handleClose}
      autoHideDuration={2000}
    >
      <Alert
        onClose={props.handleClose}
        severity={props.severity || "info"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMessage;
