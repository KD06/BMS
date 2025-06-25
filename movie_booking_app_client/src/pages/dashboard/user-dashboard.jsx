import { useState } from "react";
import { useLoggedInUser } from "../../hooks/auth.hooks";
import { useGetAllMovies } from "../../hooks/movie.hooks";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useGetShowsByMovieId } from "../../hooks/theatre.hook";
import moment from "moment";
import "./user.css";
import { useMemo } from "react";

import useRazorpay from "react-razorpay";
import { apiInstance } from "../../api";

const UserDashboard = () => {
  const [Razorpay] = useRazorpay();

  const { data: user } = useLoggedInUser();
  const { data: movies, isLoading } = useGetAllMovies();

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);

  const [selectedSeat, setSelectedSeat] = useState(null);

  const { data: shows } = useGetShowsByMovieId(selectedMovieId);

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
      key: "rzp_test_SOzicN4cTTzIuG",
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
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <div className="user_dashboard_container" style={{ padding: "20px" }}>
      <div>
        <h1>Hi {user.firstname}</h1>
        <div className="movie_display_grid">
          {movies?.map((movie) => (
            <div
              style={{ marginTop: "10px" }}
              key={movie._id}
              onClick={() => setSelectedMovieId(movie._id)}
            >
              <Card sx={{ maxWidth: 345 }}>
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
      <div>
        {shows && (
          <div>
            {shows?.map((show) => (
              <div
                style={{ marginTop: "10px" }}
                onClick={() => setSelectedShowId(show._id)}
                key={show._id}
              >
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {moment(show.startTimestamp).format(
                        "DD/MM/YY [at] hh:mm A"
                      )}{" "}
                      to
                      <br />
                      {moment(show.endTimestamp).format(
                        "DD/MM/YY [at] hh:mm A"
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
      <div>
        {showObj && (
          <div className="seats_container">
            {new Array(showObj.theatreHallId.seatingCapacity)
              .fill(1)
              .map((seat, index) => (
                <span
                  className={
                    index + 1 === selectedSeat ? "selected-seat" : null
                  }
                  onClick={() => setSelectedSeat(index + 1)}
                  key={index}
                >
                  {index + 1}
                </span>
              ))}
          </div>
        )}
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
      </div>
    </div>
  );
};

export default UserDashboard;
