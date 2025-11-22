import React from "react";

const Profile = () => {
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
            <button 
            onClick={() => alert('Practice')}
            style={{
                background: 'none',
                cursor: 'pointer',
                bottom: '0px',
                left: '30%',
                position: 'fixed',
                outline: 'none',
                boxShadow: 'none',
            }}>
            <img 
            src="/images/featherHome.png"
            width={100}
            height={100}
            alt="Home"
            style={{
                background: 'none',
                cursor: 'pointer',
            }}
            />
            </button>
            <button 
            onClick={() => alert('Practice')}
            style={{
                background: 'none',
                cursor: 'pointer',
                bottom: '0px',
                left: '40%',
                position: 'fixed',
                outline: 'none',
                boxShadow: 'none',
            }}>
            <img 
            src="/images/pawHistory.png"
            width={100}
            height={100}
            alt="History"
            style={{
                background: 'none',
                cursor: 'pointer',
            }}
            />
            </button>
            <button 
            onClick={() => alert('Practice')}
            style={{
                background: 'none',
                cursor: 'pointer',
                bottom: '0px',
                left: '50%',
                position: 'fixed',
                outline: 'none',
                boxShadow: 'none',
            }}>
            <img 
            src="/images/binoExport.png"
            width={100}
            height={100}
            alt="Export"
            style={{
                background: 'none',
                cursor: 'pointer',
            }}
            />
            </button>
            <button 
            onClick={() => alert('Practice')}
            style={{
                background: 'none',
                cursor: 'pointer',
                bottom: '0px',
                left: '60%',
                position: 'fixed',
                outline: 'none',
                boxShadow: 'none',
            }}>
            <img 
            src="/images/nestProfile.png"
            width={100}
            height={100}
            alt="Profile"
            style={{
                background: 'none',
                cursor: 'pointer',
            }}
            />
            </button>
    {/* <nav style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    bottom: '0px'
}}>
    <div style={{ display: 'flex', gap: '15px', bottom: '0px'}}>
        <button 
            onClick={() => alert('Practice')}
            style={{
                background: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                bottom: '0px',

            }}
        >
        <img 
            src="/images/featherHome.png"
            width={100}
            height={100}
            alt="Home"
        />
    </button>
    </div>
    </nav> */}
        </div>
    )
}

export default Profile;