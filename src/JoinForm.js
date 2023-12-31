import { useHMSActions } from "@100mslive/react-sdk";
import { Fragment, useState } from "react";
import { setUser } from "./replay";

const publicToken = process.env.REACT_APP_PUBLIC_ROOM_TOKEN;

function Join() {
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState({
    name: "",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NGRmNzU0Mzk1ZjE5NGQ1ZTUwOTg2ZWMiLCJyb2xlIjoiZ3Vlc3QiLCJyb29tX2lkIjoiNjRkZjc1ZTJlYTY0YmFjNDljOTg4N2FmIiwidXNlcl9pZCI6Ijk4YjkwYjM4LWVjNDItNDAyYS05YzJhLTljNTQyMWRkZjU1MSIsImV4cCI6MTY5MjgwMDUzMCwianRpIjoiZDNhY2Y2OGQtYWM4ZS00OWZjLWE0YTctMTY5ODUzNjJlZDMxIiwiaWF0IjoxNjkyNzE0MTMwLCJpc3MiOiI2NGRmNzU0Mzk1ZjE5NGQ1ZTUwOTg2ZWEiLCJuYmYiOjE2OTI3MTQxMzAsInN1YiI6ImFwaSJ9.HcVxu1AsOR07W-v3qosCv-b_mMI6lSIvcsGFyle3ZdI",
  });

  const handleInputChange = (e) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (joinPublicRoom) => {
    if (!joinPublicRoom && !inputValues.token) {
      console.error(
        "You have neither provided a token nor choosing to join the public room"
      );
      return;
    }
    hmsActions.join({
      userName: inputValues.name,
      authToken: joinPublicRoom ? publicToken : inputValues.token,
      rememberDeviceSelection: true,
      settings: {
        isAudioMuted: true,
      },
    });
    setUser(inputValues.name, joinPublicRoom);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Join Room</h2>
      <div className="input-container">
        <input
          value={inputValues.name}
          onChange={handleInputChange}
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
        />
      </div>
      <div className="input-container">
        <input
          value={inputValues.token}
          onChange={handleInputChange}
          id="token"
          type="text"
          name="token"
          placeholder="Auth token(or join the public room)"
        />
      </div>
      <button className="btn-primary" onClick={() => handleSubmit()}>
        Join
      </button>
      {publicToken && (
        <Fragment>
          <button className="btn-primary" onClick={() => handleSubmit(true)}>
            Join Public Room
          </button>
          <p className="subtext">
            Note: Public Room is shared across everyone visiting this page.
          </p>
        </Fragment>
      )}
    </form>
  );
}

export default Join;
