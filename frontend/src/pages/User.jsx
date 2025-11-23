import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const User = () => {
  const navigate = useNavigate();

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
          User
        </h1>

        <label
            style={{
              fontFamily: "Jua-Regular",
              color: "#1E406E",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              marginTop: "1vh"
            }}
          >
            Your High Score
          </label>
          <h1 style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginTop: "0",
            marginBottom: "0.1vh",
            fontSize: "clamp(1.2rem, 20vw, 5.0rem)",
          }}>67</h1>
        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2vh",
            alignItems: "center",
          }}
        >
          <label
            style={{
              fontFamily: "Jua-Regular",
              color: "#1E406E",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
            }}
          >
            Leaderboard
          </label>
          
          <div
            style={{
              width: "100%",
              padding: "1.5vh 1.5vw",
              background: "#1E406E",
              color: "white",
              borderRadius: "10px",
              fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
              fontFamily: "Jua-Regular",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>1 - Jocelyn Chang</span>
            <span>8999</span>
          
          </div>
          <div
            style={{
              width: "100%",
              padding: "1.5vh 1.5vw",
              background: "#1E406E",
              color: "white",
              borderRadius: "10px",
              fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
              fontFamily: "Jua-Regular",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>2 - Jocelyn</span>
            <span>891</span>
          </div>
          <div
            style={{
              width: "100%",
              padding: "1.5vh 1.5vw",
              background: "#1E406E",
              color: "white",
              borderRadius: "10px",
              fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
              fontFamily: "Jua-Regular",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "3vh",
            }}
          >
            <span>3 - Joc</span>
            <span>601</span>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default User;
