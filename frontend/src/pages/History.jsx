import React from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
    const navigate = useNavigate();
    return (
        <div>
            <img 
            src="/images/logo.png" 
            width={100} 
            height={100} 
            alt="Logo" 
            style={{ 
                top: '20px',
                left: '20px',
                position: 'fixed',
            }}
            />
            <img 
            src="/images/log.png" 
            width={1100} 
            height={350} 
            alt="log" 
            style={{ 
                bottom: '-75px',
                left: '14%',
                position: 'fixed',
            }}/>
            <img 
            src="/images/pinkWeed.png" 
            width={500}
            height={600}
            alt="Pink" 
            style={{ 
                bottom: '-20px',
                left: '-125px',
                position: 'fixed',
            }}/>
            <img 
            src="/images/brownWeed.png" 
            width={500}
            height={600}
            alt="Brown" 
            style={{ 
                bottom: '-80px',
                right: '-175px',
                position: 'fixed',
                zIndex: 1
            }}/>

            <h1 style={{ 
                    fontSize: "3.5rem", 
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                    position: "fixed", 
                    top: "-5px",        
                    left: "50%",         
                    transform: "translateX(-50%)",
                    zIndex: 10          
            }}>
                Log History
            </h1>

            {/* --- CENTER RECTANGLE --- */}
            <div
                style={{
                    position: "fixed", 
                    top: "46%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "1100px",
                    height: "555px",
                    backgroundColor: "transparent",
                    border: "transparent",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 5,             
                }}
            >
                {/* Scrollable inner rectangle with tightly stacked images */}
                <div
                style={{
                    width: "98%",
                    height: "425px",          
                    backgroundColor: "transparent", 
                    borderRadius: "8px",
                    overflowY: "auto",       
                    padding: "10px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column", 
                    alignItems: "center",
                }}
                >
                {[...Array(12)].map((_, i) => (
                    <img
                    key={i}
                    src="/images/skinnylog.png"
                    alt={`Log ${i + 1}`}
                    style={{
                        display: "block",
                        height: "250px",          
                        marginBottom: "-100px",
                    }}
                    />
                ))}
                </div>
            </div>



            <img 
            src="/images/featherHome.png"
            width={100}
            height={100}
            alt="Home"
            className="button-image"
            style={{cursor: 'pointer', left: '33%', bottom: '10px', position: 'fixed'}}
            onClick={() => navigate("/")}
            />
            <img 
            src="/images/nestProfile.png"
            width={100}
            height={100}
            alt="Profile"
            className="button-image"
            style={{cursor: 'pointer', left: '43%', bottom: '10px', position: 'fixed'}}
            onClick={() => navigate("/profile")}
            />
            <img 
            src="/images/pawHistory.png"
            width={100}
            height={100}
            alt="History"
            className="button-image"
            style={{cursor: 'pointer', left: '53%', bottom: '10px', position: 'fixed'}}
            onClick={() => navigate("/history")}
            />
            <img 
            src="/images/binoExport.png"
            width={100}
            height={100}
            alt="Export"
            className="button-image"
            style={{cursor: 'pointer', left: '63%', bottom: '10px', position: 'fixed'}}
            onClick={() => navigate("/")}
            />
            
        </div>
    )
}

export default History;