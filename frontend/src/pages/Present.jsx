import { useEffect, useRef, useState } from "react";

export default function Present() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  // Start video + audio
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      console.log("🎥 Camera + 🎤 Mic running");
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera or microphone unavailable.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    let chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      chunks = [];
      sendAudioToBackend(blob);
    };

    recorder.start();
    setIsRecording(true);

    // Auto-loop recording every 2 seconds
    const loop = () => {
      if (!mediaRecorderRef.current || !isRecording) return;

      recorder.stop();
      setTimeout(() => {
        if (isRecording) recorder.start();
      }, 300);
    };

    setInterval(loop, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const res = await fetch("http://localhost:5000/audio-analysis", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("🎤 Live feedback:", data.feedback);
    } catch (err) {
      console.error("Error sending audio:", err);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Presentation Mode</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={styles.video}
      ></video>

      <div style={styles.buttons}>
        {!isRecording ? (
          <button onClick={startRecording} style={styles.btn}>
            🎤 Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} style={styles.stopBtn}>
            ⏹ Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
  },
  video: {
    width: "70vw",
    maxWidth: "900px",
    borderRadius: "20px",
    background: "black",
  },
  buttons: {
    marginTop: "20px",
  },
  btn: {
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: "10px",
    cursor: "pointer",
  },
  stopBtn: {
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: "10px",
    cursor: "pointer",
    background: "red",
    color: "white",
  },
};
