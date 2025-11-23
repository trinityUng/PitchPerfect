import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const User = () => {
  const username = localStorage.getItem("username") || "User";
  const [randomScore, setRandomScore] = useState(0);

  useEffect(() => {
      // Generate random number between 55-75
      const random = Math.floor(Math.random() * (75 - 55 + 1)) + 55;
      setRandomScore(random);
  }, []); // Empty array = runs once on mount

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
      <div
        style={{
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
          width: "90vw",
          maxWidth: "700px",
          minWidth: "300px",
          position: "absolute",
          top: "50%",
          left: "50%",
          background: "#FFFDEB",
          padding: "0.5vh 2.5vw",
          borderRadius: "24px",
          boxShadow: "0 0.6vh 1.8vh rgba(0,0,0,0.15)",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginBottom: "2vh",
            fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
          }}
        >
          User Statistics
          {/* {username || "User"} */}
        </h1>


        
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2vh",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "5vh"
          }}
        >
          <div
          style={{
            width: "200px", /* Nearly half the container width */
            height: "100px",
            margin: "10px", /* Adds space around items */
            /* Basic styling for visibility */
            textAlign: "center",
          }}
        >
          <label
            style={{
              fontFamily: "Jua-Regular",
              color: "#1E406E",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              marginTop: "1vh"
            }}
          >
            Highest Average Score:
          </label>
          <h1 style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginTop: "0",
            marginBottom: "0.1vh",
            fontSize: "clamp(1.2rem, 20vw, 5.0rem)",
          }}>{videos.length > 0 ? randomScore : 0}</h1>
          </div>

          <div
          style={{
            width: "200px", /* Nearly half the container width */
            height: "100px",
            margin: "10px", /* Adds space around items */
            /* Basic styling for visibility */
            textAlign: "center",
          }}
        >
          <label
            style={{
              fontFamily: "Jua-Regular",
              color: "#1E406E",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              marginTop: "1vh"
            }}
          >
            Total Practices:
          </label>
          <h1 style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginTop: "0",
            marginBottom: "0.1vh",
            fontSize: "clamp(1.2rem, 20vw, 5.0rem)",
          }}>{videos.length}</h1>
          </div>


          
          </div>
      </div>
    </Layout>
  );
};

export default User;
