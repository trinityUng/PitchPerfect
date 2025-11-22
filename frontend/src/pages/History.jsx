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