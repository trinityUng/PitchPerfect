import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout.jsx";

export default function Present() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const streamRef = useRef(null);

  const [isRecordingState, setIsRecordingState] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  // RECORDERS
  const loopAudioRecorderRef = useRef(null);
  const loopVideoRecorderRef = useRef(null);
  const fullAudioRecorderRef = useRef(null);
  const fullVideoRecorderRef = useRef(null);

  const recordingFlagRef = useRef(false);

  const [fullAudioURL, setFullAudioURL] = useState(null);
  const [fullVideoURL, setFullVideoURL] = useState(null);

  /* ENTER FULLSCREEN */
  const enterFullscreen = () => {
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
      setIsFullscreenMode(true);
    }
  };

  /* EXIT FULLSCREEN */
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreenMode(false);
  };

  /* START CAMERA */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  /* START RECORDING */
  const startRecording = () => {
    if (!streamRef.current) return;

    enterFullscreen();
    recordingFlagRef.current = true;
    setIsRecordingState(true);

    const stream = streamRef.current;
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    /* FULL VIDEO */
    let fullVideoChunks = [];
    const fullVideoStream = new MediaStream([videoTrack, audioTrack]);
    const fullVideoRecorder = new MediaRecorder(fullVideoStream, {
      mimeType: "video/webm; codecs=vp8,opus",
    });
    fullVideoRecorderRef.current = fullVideoRecorder;

    fullVideoRecorder.ondataavailable = (e) => fullVideoChunks.push(e.data);
    fullVideoRecorder.onstop = () => {
      const blob = new Blob(fullVideoChunks, { type: "video/webm" });
      setFullVideoURL(URL.createObjectURL(blob));
    };
    fullVideoRecorder.start();

    /* FULL AUDIO */
    let fullAudioChunks = [];
    const fullAudioStream = new MediaStream([audioTrack]);
    const fullAudioRecorder = new MediaRecorder(fullAudioStream, {
      mimeType: "audio/webm",
    });
    fullAudioRecorderRef.current = fullAudioRecorder;

    fullAudioRecorder.ondataavailable = (e) => fullAudioChunks.push(e.data);
    fullAudioRecorder.onstop = () => {
      const blob = new Blob(fullAudioChunks, { type: "audio/webm" });
      setFullAudioURL(URL.createObjectURL(blob));
    };
    fullAudioRecorder.start();

    /* LOOP AUDIO */
    const loopAudioStream = new MediaStream([audioTrack]);
    let loopAudioChunks = [];
    const loopAudioRecorder = new MediaRecorder(loopAudioStream, {
      mimeType: "audio/webm",
    });
    loopAudioRecorderRef.current = loopAudioRecorder;

    loopAudioRecorder.ondataavailable = (e) => loopAudioChunks.push(e.data);

    loopAudioRecorder.onstop = () => {
      const blob = new Blob(loopAudioChunks, { type: "audio/webm" });
      loopAudioChunks = [];
      sendAudioChunk(blob);

      if (recordingFlagRef.current) {
        loopAudioRecorder.start();
        setTimeout(() => loopAudioRecorder.stop(), 20000);
      }
    };

    loopAudioRecorder.start();
    setTimeout(() => loopAudioRecorder.stop(), 20000);

    /* LOOP VIDEO */
    const loopVideoStream = new MediaStream([videoTrack]);
    let loopVideoChunks = [];
    const loopVideoRecorder = new MediaRecorder(loopVideoStream, {
      mimeType: "video/webm; codecs=vp8",
    });
    loopVideoRecorderRef.current = loopVideoRecorder;

    loopVideoRecorder.ondataavailable = (e) => loopVideoChunks.push(e.data);

    loopVideoRecorder.onstop = async () => {
      const blob = new Blob(loopVideoChunks, { type: "video/webm" });
      loopVideoChunks = [];
      //sendVideoChunk(blob);

      const feedback = await sendVideoChunk(blob);

      console.log("FEEDBACK RECEIVED:", feedback);

      if (recordingFlagRef.current) {
        loopVideoRecorder.start();
        setTimeout(() => loopVideoRecorder.stop(), 20000);
      }
    };

    loopVideoRecorder.start();
    setTimeout(() => loopVideoRecorder.stop(), 2000);
  };

  /* STOP RECORDING */
      const stopRecording = () => {
      recordingFlagRef.current = false;
      setIsRecordingState(false);

      exitFullscreen();

      fullVideoRecorderRef.current?.stop();
      fullAudioRecorderRef.current?.stop();
      loopAudioRecorderRef.current?.stop();
      loopVideoRecorderRef.current?.stop();
      
      navigate("/feedback");
    };


  const sendAudioChunk = async (blob) => {
    const form = new FormData();
    form.append("audio", blob);
    await fetch("http://localhost:5050/process-audio", {
      method: "POST",
      body: form,
    });
  };

  const sendVideoChunk = async (blob) => {
    const form = new FormData();
    form.append("video", blob);

    const analysis = await fetch("http://localhost:5050/process-video", {
      method: "POST",
      body: form,
    }).then((res) => res.json());

    console.log("received from server: ", analysis); // for debugging

    // sanity check to make sure we received feedback
    if (!analysis) {
      console.error("Missing or invalid response: ", analysis);
      return;
    }

    const feedbackResponse = await fetch(
      "http://localhost:5050/video-feedback",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawResults: analysis.rawResults }),
      }
    );

    const feedbackData = await feedbackResponse.json();

    const feedback = feedbackData.feedback;
    //console.log("Feedback from server:", feedback);

    return feedback;
  };

  const triggerVideoDownload = () => {
  if (!fullVideoURL) return;

  const a = document.createElement("a");
  a.href = fullVideoURL;
  a.download = "full-video.webm";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

  useEffect(() => {
    startCamera();
  }, []);

  return (
    // <Layout>
    <div ref={containerRef} style={{ position: "relative", minHeight: "100vh" }}>
      
      {/* FLOATING BUTTON (ALWAYS SHOWN EVEN IN FULLSCREEN) */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      >
        {!isRecordingState ? (
          <button style={styles.btn} onClick={startRecording}>
            🎤 Start Recording
          </button>
        ) : (
          <button style={styles.stopBtn} onClick={stopRecording}>
            ⏹ Stop Recording
          </button>
        )}
      </div>

      {/* ------------------------------------------- */}
      {/* NORMAL MODE DECORATIONS (HIDDEN IN FULLSCREEN) */}
      {/* ------------------------------------------- */}

      {!isFullscreenMode && (
        <>
        <Layout>
        </Layout>
        </>
      )}

      {/* VIDEO (normal size OR fullscreen) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: isFullscreenMode ? "100vw" : "47vw",
          height: isFullscreenMode ? "100vh" : "auto",
          objectFit: isFullscreenMode ? "cover" : "contain",
          borderRadius: isFullscreenMode ? "0px" : "20px",
          transform: isFullscreenMode ? "scaleX(-1)" : "translate(-50%, -50%) scaleX(-1)",
          background: "black",
          position: isFullscreenMode ? "relative" : "absolute",
          top: isFullscreenMode ? "0" : "42%",
          left: isFullscreenMode ? "0" : "50%",
          display: "block",
        }}
      />


      {/* DOWNLOAD LINKS (always clickable) */}
      {(fullAudioURL || fullVideoURL) && (
        <div
          style={{
            position: "fixed",
            bottom: isFullscreenMode ? "20px" : "120px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999999, // <-- KEY FIX
            background: "rgba(255,255,255,0.8)",
            padding: "10px 20px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >

          {/* COMMENTED OUT PER REQUEST */}
          {false && fullAudioURL && (
            <a
              href={fullAudioURL}
              download="full-audio.webm"
              style={{
                marginRight: "20px",
                cursor: "pointer",
                fontWeight: "600",
                color: "black"
              }}
            >
              ⬇ Download Full Audio
            </a>
          )}

        </div>
      )}
    </div>
    // </Layout>
  );
}

const styles = {
  btn: {
    padding: "6px 14px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    background: "black",
    color: "white",
  },
  stopBtn: {
    padding: "6px 14px",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    background: "red",
    color: "white",
  },
};
