import { useState } from "react";
import { useLoggedInUser } from "../../hooks/auth.hooks";
import { useGetAllMovies } from "../../hooks/movie.hooks";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";
import { useGetShowsByMovieId } from "../../hooks/theatre.hook";
import moment from "moment";
import "./user.styles.css";
import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import SnackbarMessage from "../../pages/snackbar";

import useRazorpay from "react-razorpay";
import { apiInstance } from "../../api";

const UserDashboard = () => {
  const [Razorpay] = useRazorpay();

  const { data: user } = useLoggedInUser();
  const { data: movies, isLoading } = useGetAllMovies();

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [selectedSeat, setSelectedSeat] = useState(null);

  let { data: shows, refetch: refetchShows } =
    useGetShowsByMovieId(selectedMovieId);

  const showObj = useMemo(() => {
    if (!shows || !selectedShowId) return null;
    const show = shows?.find((e) => e._id === selectedShowId);
    return show;
  }, [selectedShowId, shows]);

  async function handleCreateBooking() {
    const { data } = await apiInstance.post(`/booking/create`, {
      showId: selectedShowId,
      seatNumber: selectedSeat,
    });
    const order = data.order;
    const options = {
      key: "rzp_test_8wNFpjIOoobhVK",
      amount: order.amount,
      currency: order.currency,
      name: "BookingMyShow",
      order_id: order.id,
      handler: async function (response) {
        await apiInstance.post(`/booking/verify-payment`, {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
        await refetchShows();
        setSelectedSeat(null);
        setSnackbar({
          open: true,
          message: "Booking successful! Enjoy your movie!",
          severity: "success",
        });
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <div className="user_dashboard_container" style={{ padding: "20px" }}>
      <div>
        <h2>Hi {user.firstname}</h2>
        <br />
        <div className="movie_display_grid">
          {movies?.map((movie) => (
            <div
              style={{ marginTop: "10px" }}
              key={movie._id}
              onClick={() => setSelectedMovieId(movie._id)}
            >
              <Card
                sx={{ maxWidth: 345 }}
                className={selectedMovieId === movie._id ? "selected-card" : ""}
              >
                <CardMedia
                  component="img"
                  height="194"
                  image={movie.imageURL}
                  alt="Image not Available"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {movie.description}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="shows">
        {shows && (
          <div>
            {shows?.map((show) => (
              <div
                style={{ marginTop: "10px" }}
                onClick={() => {
                  setSelectedShowId(show._id);
                  setSelectedSeat(null);
                }}
                key={show._id}
              >
                <Card
                  sx={{ maxWidth: 345 }}
                  className={selectedShowId === show._id ? "selected-card" : ""}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {moment(show.startTimestamp).format(
                        "ddd DD MMM YY [at] hh:mm A"
                      )}{" "}
                      to
                      <br />
                      {moment(show.endTimestamp).format(
                        "ddd DD MMM YY [at] hh:mm A"
                      )}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      INR {show.price}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      At {show.theatreHallId.theatreId.name} -{" "}
                      {show.theatreHallId.theatreId.plot}{" "}
                      {show.theatreHallId.theatreId.street}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="seatMap">
        {showObj && (
          <div className="seats_container">
            {new Array(showObj.theatreHallId.seatingCapacity)
              .fill(1)
              .map((seat, index) => {
                const seatNum = index + 1;
                const isBooked = showObj.selectedSeats?.includes(seatNum);
                const isSelected = selectedSeat === seatNum;

                return (
                  <Button
                    key={seatNum}
                    variant="outlined"
                    disabled={isBooked}
                    className={
                      isBooked
                        ? "booked-seat"
                        : isSelected
                        ? "selected-seat"
                        : null
                    }
                    onClick={() => setSelectedSeat(index + 1)}
                  >
                    {seatNum}
                  </Button>
                );
              })}
          </div>
        )}
        <Stack spacing={2} direction="row">
          {selectedSeat && (
            <Button
              onClick={() => setSelectedSeat(null)}
              color="error"
              variant="outlined"
            >
              Clear
            </Button>
          )}
          {selectedSeat && (
            <Button onClick={handleCreateBooking} variant="contained">
              Book Now
            </Button>
          )}
        </Stack>
      </div>
      <SnackbarMessage
        handleClose={() =>
          setSnackbar({ open: false, message: "", severity: "" })
        }
        message={snackbar.message}
        open={snackbar.open}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default UserDashboard;
