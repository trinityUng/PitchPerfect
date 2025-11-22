// -------------------------------
// PitchPerfect JavaScript Frontend
// -------------------------------

// root UI container
const root = document.getElementById("root");

// create a title
const title = document.createElement("h1");
title.innerText = "PitchPerfect — JS Frontend";
title.style.fontFamily = "Arial";
title.style.color = "#333";

root.appendChild(title);

// description text
const desc = document.createElement("p");
desc.innerText = "Click the button to send test metrics to the backend:";
desc.style.fontFamily = "Arial";
root.appendChild(desc);

// button
const btn = document.createElement("button");
btn.innerText = "Send Test Metrics";
btn.style.padding = "12px 20px";
btn.style.background = "#4F46E5";
btn.style.color = "#fff";
btn.style.border = "none";
btn.style.borderRadius = "8px";
btn.style.cursor = "pointer";
btn.style.fontSize = "16px";

root.appendChild(btn);

// output box
const output = document.createElement("div");
output.style.marginTop = "20px";
output.style.padding = "20px";
output.style.background = "white";
output.style.borderRadius = "10px";
output.style.minHeight = "100px";
output.style.maxWidth = "500px";
output.style.fontFamily = "Arial";
output.innerText = "AI feedback will appear here...";

root.appendChild(output);


// -------------------------------
// BACKEND REQUEST
// -------------------------------

async function sendMetrics() {
  const metrics = {
    eye_contact: 0.82,
    posture: 0.65,
    gestures: 0.3,
    head_tilt: 2.1
  };

  output.innerText = "Sending request to backend...";

  try {
    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(metrics)
    });

    const data = await res.json();
    output.innerText = "Gemini Feedback:\n\n" + data.feedback;

  } catch (err) {
    output.innerText = "❌ Error connecting to backend!";
    console.error(err);
  }
}

// attach event
btn.addEventListener("click", sendMetrics);
