import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>

      {/* Continuous Goose Sound */}
      <audio src="/images/goosesound.mp3" autoPlay loop />

      {/* Top-left image */}
      <img
        src="/images/clouds.png"
        alt="Top Left"
        style={{
          position: "fixed",
          top: 50,
          left: 0,
          width: "600px",
          height: "auto",
          opacity: 0.6,
        }}
      />

      {/* Top-right image */}
      <img
        src="/images/clouds.png"
        alt="Top Right"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "600px",
          height: "auto",
          opacity: 0.6,
        }}
      />

      {/* Left image at bottom-left corner */}
      <img
        src="/images/weeds.png"
        alt="Left"
        style={{
          position: "fixed",
          bottom: -100,
          left: -75,
          width: "550px",
          height: "auto",
        }}
      />

      {/* Right image at bottom-right corner */}
      <img
        src="/images/goose.gif"
        alt="Right"
        style={{
          position: "fixed", 
          bottom: 0,         
          right: 0,         
          width: "350px",
          height: "auto",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
          paddingTop: "25rem",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: "8rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Welcome!
        </h1>

        <div style={{ display: "flex", gap: "3rem", marginTop: "-7rem" }}>
          <img
            src="/images/lilypadLogin.png"
            alt="Button 1"
            className="button-image"
            style={{ width: "95px", height: "95px", cursor: "pointer" }}
            onClick={() => navigate("/login")} 
          />

          <img
            src="/images/lilypadSignup.png"
            alt="Button 2"
            className="button-image"
            style={{ width: "95px", height: "95px", cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
