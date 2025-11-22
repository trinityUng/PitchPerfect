import React from "react";

const Layout = ({ children }) => {
    return (
<div style={{ background: 'lightblue', padding: '20px' }}>
            <h1>PitchPerfect (This should show!)</h1>
            <p>Logo should be below:</p>
            <img 
                src="/images/logo.png"
                width={100}
                height={100}
                alt="Logo"
                style={{ border: '2px solid red' }}
            />
            <hr />
            {children}
        </div>
    )
}

export default Layout;