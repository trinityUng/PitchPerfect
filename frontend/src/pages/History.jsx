import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5050/user-videos/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {/* LOGO TOP LEFT */}
      <img
        src="/images/logo.png"
        width={100}
        height={100}
        alt="Logo"
        style={{
          top: "20px",
          left: "20px",
          position: "fixed",
          zIndex: 10,
        }}
      />

      {/* DECOR IMAGES */}
      <img
        src="/images/log.png"
        width={1100}
        height={350}
        alt="log"
        style={{
          bottom: "-75px",
          left: "14%",
          position: "fixed",
          zIndex: 1,
        }}
      />
      <img
        src="/images/pinkWeed.png"
        width={500}
        height={600}
        alt="Pink"
        style={{
          bottom: "-20px",
          left: "-125px",
          position: "fixed",
          zIndex: 1,
        }}
      />
      <img
        src="/images/brownWeed.png"
        width={500}
        height={600}
        alt="Brown"
        style={{
          bottom: "-80px",
          right: "-175px",
          position: "fixed",
          zIndex: 1,
        }}
      />

      {/* TITLE */}
      <h1
        style={{
          fontSize: "3.5rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          position: "fixed",
          top: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        Log History
      </h1>

      {/* MAIN CONTAINER */}
      <div
        style={{
          position: "fixed",
          top: "46%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1100px",
          height: "555px",
          backgroundColor: "transparent",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        {/* SCROLL AREA */}
        <div
          style={{
            width: "98%",
            height: "425px",
            overflowY: "auto",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {videos.length === 0 && (
            <p
              style={{
                fontFamily: "Jua-Regular",
                fontSize: "1.6rem",
                marginTop: "50px",
                color: "#2b271c",
              }}
            >
              No recordings yet.
            </p>
          )}

          {videos.map((vid, index) => {
            const date = new Date(vid.createdAt).toLocaleString();
            const downloadURL = `http://localhost:5050/${vid.filePath}`; // direct file link

            return (
                <div
                key={index}
                style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                >
                {/* LOG IMAGE */}
                <img
                    src="/images/skinnylog.png"
                    alt="Log Entry"
                    style={{
                    height: "250px",
                    display: "block",
                    marginBottom: "-100px",
                    }}
                />

                {/* CENTERED DATE */}
                <div
                    style={{
                    position: "absolute",
                    top: "80%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    fontFamily: "Jua-Regular",
                    fontSize: "2rem",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
                    pointerEvents: "none",
                    }}
                >
                    {date}
                </div>

                {/* DOWNLOAD ICON */}
                <a
                    href={downloadURL}
                    download
                    style={{
                    position: "absolute",
                    right: "15%",          // moves it to right side of log
                    top: "80%",            // aligns vertically with text
                    transform: "translateY(-50%)",
                    zIndex: 20,
                    }}
                >
                    <img
                    src="/images/binoExport.png"
                    alt="Download Video"
                    style={{
                        width: "60px",
                        height: "60px",
                        cursor: "pointer",
                    }}
                    />
                </a>
                </div>
            );
            })}
        </div> 
    </div>   

      {/* NAVIGATION BUTTONS */}
      <img
        src="/images/featherHome.png"
        width={100}
        height={100}
        alt="Home"
        className="button-image"
        style={{
          cursor: "pointer",
          left: "33%",
          bottom: "10px",
          position: "fixed",
          zIndex: 10,
        }}
        onClick={() => navigate("/")}
      />

      <img
        src="/images/nestProfile.png"
        width={100}
        height={100}
        alt="Profile"
        className="button-image"
        style={{
          cursor: "pointer",
          left: "43%",
          bottom: "10px",
          position: "fixed",
          zIndex: 10,
        }}
        onClick={() => navigate("/profile")}
      />

      <img
        src="/images/pawHistory.png"
        width={100}
        height={100}
        alt="History"
        className="button-image"
        style={{
          cursor: "pointer",
          left: "53%",
          bottom: "10px",
          position: "fixed",
          zIndex: 10,
        }}
        onClick={() => navigate("/history")}
      />

      <img
        src="/images/binoExport.png"
        width={100}
        height={100}
        alt="Export"
        className="button-image"
        style={{
          cursor: "pointer",
          left: "63%",
          bottom: "10px",
          position: "fixed",
          zIndex: 10,
        }}
        onClick={() => navigate("/")}
      />
    </div>
  );
};

export default History;
