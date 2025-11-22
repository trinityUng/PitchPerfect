import React from "react";
import { useNavigate } from "react-router-dom";
// import "./Layout.css"; // optional if you want styling here

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const bottomNavItems = [
    { src: "/images/featherHome.png", alt: "Home", route: "/" },
    { src: "/images/nestProfile.png", alt: "Profile", route: "/profile" },
    { src: "/images/pawHistory.png", alt: "History", route: "/history" },
    // { src: "/images/binoExport.png", alt: "Export", route: "/" },
  ];

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

         {/* Background Images */}
         <img 
           src="/images/log.png" 
           alt="Log" 
           style={{position: "fixed",
            bottom: "-8%",
            left: "10%",
            width: "90vw",
            maxWidth: "1100px",
            height: "auto",
            zIndex: 1,}}
         />
         <img 
           src="/images/pinkWeed.png" 
           alt="Pink Weed" 
           style={{position: "fixed",
            bottom: "-3%",
            left: "-10%",
            width: "30vw",
            maxWidth: "500px",
            height: "auto",
            zIndex: 1,}}
         />
         <img 
           src="/images/brownWeed.png" 
           alt="Brown Weed" 
           style={{position: "fixed",
            bottom: "-5%",
            right: "-12%",
            width: "30vw",
            maxWidth: "500px",
            height: "auto",
            zIndex: 1,}}
         />

         {/* Bottom Navigation */}
         <div style={{position: "fixed",
    bottom: "2%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "2vw",
    zIndex: 50,}}>
           {bottomNavItems.map((item, index) => (
             <img
               key={index}
               src={item.src}
               alt={item.alt}
               style={{width: "4vw",
                maxWidth: "100px",
                minWidth: "30px",
                height: "auto",
                cursor: "pointer",}}
               onClick={() => navigate(item.route)}
             />
           ))}
         </div>
      <div styles={{    maxWidth: "90%",
    margin: "0 auto",
    padding: "3vh 2vw",
    background: "#fffdeb",
    borderRadius: "2vw",
    boxShadow: "0 1vh 3vh rgba(0, 0, 0, 0.2)",
    position: "relative",
    zIndex: 10,
    minHeight: "60vh",}}>
        {children}
      </div>

    </div>
  );
};

export default Layout;

