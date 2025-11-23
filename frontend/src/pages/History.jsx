import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

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
    <Layout>
    <div>
      

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
            const filename = vid.filePath.split("/").pop();
            const downloadURL = `http://localhost:5050/download/${filename}`;

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
                <img
                src="/images/binoExport.png"
                alt="Download Video"
                onClick={() => {
                const a = document.createElement("a");
                a.href = downloadURL;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                }}
                style={{
                    position: "absolute",
                    right: "15%",
                    top: "80%",
                    transform: "translateY(-50%)",
                    zIndex: 20,
                    width: "60px",
                    height: "60px",
                    cursor: "pointer",
                }}
                />

                </div>
            );
            })}
        </div> 
    </div>   

      
    </div>
    </Layout>
  );
};

export default History;
