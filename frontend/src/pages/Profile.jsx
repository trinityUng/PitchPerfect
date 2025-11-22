import React from "react";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const navigate = useNavigate();
    // const [formData, setFormData] = useState({
    //     username: "",
    //     email: "",
    //     password: "",
    //     repeatPassword: ""
    // });

    // const [formData, setFormData] = useState({
    //     username: "",
    //     email: "",
    //     password: "",
    //     repeatPassword: ""
    // });
    
    // const handleChange = (e) => {
    //     setFormData({
    //       ...formData,
    //       [e.target.name]: e.target.value
    //     });
    // };
    
    // // submit → send to backend (JSON file)
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (formData.password !== formData.repeatPassword) {
    //         alert("Passwords do not match!");
    //         return;
    //     }

    //     try {
    //         const response = await fetch("http://localhost:3001/signup", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             username: formData.username,
    //             email: formData.email,
    //             password: formData.password
    //         })
    //     });

    //     const data = await response.json();

    //     if (!response.ok) {
    //         alert(data.message);
    //         return;
    //     }

    //     alert("Signup successful!");
    //     navigate("/"); // redirect
    //     } catch (err) {
    //     console.error(err);
    //     alert("Error connecting to server.");
    //     }
    // };

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
            
            <div style={{
                maxWidth: '800px',
                margin: '50px auto 200px auto', // Extra bottom margin for nav
                padding: '30px',
                background: '#FFFDEB',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                zIndex: 10,
                minHeight: '60vh',
                minWidth: '80vh',
                justifyContent: 'center'
            }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  maxWidth: '80vh',
                  marginTop: '5px'
                }}>
                  {/* <img
                    src="/images/portrait.png"
                    width={75}
                    height={75}
                    alt="Portrait"
                    style={{
                      display: 'block',
                      marginBottom: '-10px',
                    }}
                  />   */}
                  <h1 style={{color: 'black'}}>Profile</h1>
                </div>
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: '77vh',
                    gap: "20px",
                    marginTop: "-10px",
                  }}
                >
                  <div>
                    <label style={{fontWeight: 600}}>Username</label>
                    <input
                      type="Username"
                      placeholder="Enter your username"
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "6px",
                        background: "#EFF3FF",
                        border: "0px solid #FFFFFF",
                        borderRadius: "10px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{fontWeight: 600}}>Email</label>
                    <input
                      type="Email"
                      placeholder="Enter your email"
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "6px",
                        background: "#EFF3FF",
                        border: "0px solid #FFFFFF",
                        borderRadius: "10px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{fontWeight: 600}}>Password</label>
                    <input
                      type="Password"
                      placeholder="Enter your password"
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "6px",
                        background: "#EFF3FF",
                        border: "0px solid #FFFFFF",
                        borderRadius: "10px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{fontWeight: 600}}>Repeat Password</label>
                    <input
                      type="Repeat Password"
                      placeholder="Enter your password again"
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "6px",
                        background: "#EFF3FF",
                        border: "0px solid #FFFFFF",
                        borderRadius: "10px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "104%",
                      padding: "14px",
                      background: "#1E406E",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Sign Up
                  </button>
                </form>
            </div>
            
        </div>
    )
}

export default Profile;