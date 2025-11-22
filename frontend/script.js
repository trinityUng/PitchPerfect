async function sendSample() {
    const metrics = {
      eye_contact: 0.8,
      posture: 0.6,
      gestures: 0.3,
      head_tilt: 2.1,
    };
  
    document.getElementById("output").innerHTML = "Sending request to backend...";
  
    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metrics),
      });
  
      const data = await res.json();
  
      document.getElementById("output").innerHTML =
        `<strong>Gemini says:</strong><br><br>${data.feedback}`;
  
    } catch (err) {
      document.getElementById("output").innerHTML =
        "❌ Error connecting to backend. Is it running?";
      console.error(err);
    }
  }
  