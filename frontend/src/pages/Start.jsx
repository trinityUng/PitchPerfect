import React from "react";
import { useNavigate } from "react-router-dom";
// import "./Layout.css"; // optional if you want styling here

const Start = ({ children }) => {
  const navigate = useNavigate();


  return (
    <div style={{position: "relative",
        width: "100vw",
        minHeight: "100vh",
        overflowX: "hidden",}}>
         
         {/* Logo */}
         <img 
           src="/images/logo.png" 
           alt="Logo" 
           style={{position: "fixed",
            top: "2%",
            left: "2%",
            width: "5vw",
            maxWidth: "100px",
            height: "auto",
            zIndex: 50}}
         />

                  <img 
           src="/images/flowers2.png" 
           alt="Left Flowers" 
           style={{position: "fixed",
            bottom: "-4%",
            left: "-10%",
            width: "50vw",
            maxWidth: "600px",
            height: "auto",
            zIndex: 1,}}
         />

                  <img 
           src="/images/flowers1.png" 
           alt="Right Flowers" 
           style={{position: "fixed",
            bottom: "-7%",
            right: "-10%",
            width: "50vw",
            maxWidth: "650px",
            height: "auto",
            zIndex: 1,}}
         />


      {children}

    </div>
  );
};

export default Start;

