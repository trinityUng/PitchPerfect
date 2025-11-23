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

  const [toneImage, setToneImage] = useState(null); // state for goose
  const [speechBubble, setSpeechBubble] = useState(null); // for speech bubble
  const [speechText, setSpeechText] = useState(""); // for speech bubble (text)

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

    // load initial goose 
    const welcomeGoose = "/images/Appreciative.png";
    const welcomeBubble = "/images/speech.png";
    const welcomeText =
      "Smile, you're on camera! You'll receive feedback throughout your presentation.";

    setToneImage(welcomeGoose);
    setSpeechBubble(welcomeBubble);
    setSpeechText(welcomeText);

    const timer = setTimeout(() => {
      setToneImage(null);
      setSpeechBubble(null);
      setSpeechText("");
    }, 8000);
    
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
    fullVideoRecorder.onstop = async () => {
      const blob = new Blob(fullVideoChunks, { type: "video/webm" });

      // Create preview for download (optional)
      setFullVideoURL(URL.createObjectURL(blob));

      // Upload to backend
      await uploadFullVideo(blob);
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
        setTimeout(() => loopAudioRecorder.stop(), 10000);
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

      //console.log("FEEDBACK RECEIVED:", feedback);

      if (recordingFlagRef.current) {
        loopVideoRecorder.start();
        setTimeout(() => loopVideoRecorder.stop(), 20000);
      }
    };

    loopVideoRecorder.start();
    setTimeout(() => loopVideoRecorder.stop(), 2000);
  };

  /* STOP RECORDING */
      const stopRecording = async () => {
      recordingFlagRef.current = false;
      setIsRecordingState(false);

      exitFullscreen();

      fullVideoRecorderRef.current?.stop();
      fullAudioRecorderRef.current?.stop();
      loopAudioRecorderRef.current?.stop();
      loopVideoRecorderRef.current?.stop();

      // wait a bit for uploadFullVideo() to run
      setTimeout(() => {
        navigate("/feedback");
      }, 500);
    };



  const sendAudioChunk = async (blob) => {
    const form = new FormData();
    form.append("audio", blob);
    const analysis = await fetch("http://localhost:5050/process-audio", {
      method: "POST",
      body: form,
    }).then((res) => res.json());

    console.log("audio feedback received: ", analysis.feedback);

    // determine if feedback is 'Appreciative', 'Evaluative', or 'Actionable'
    const feedbackToneResponse = await fetch("http://localhost:5050/get-tone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: analysis.feedback }),
    });

    const tone = await feedbackToneResponse.json();
    console.log("Tone identified:", tone.result);

    // prompt goose image
    showToneTemporarily(tone.result, analysis.feedback);
  };

  const sendVideoChunk = async (blob) => {
    const form = new FormData();
    form.append("video", blob);

    const analysis = await fetch("http://localhost:5050/process-video", {
      method: "POST",
      body: form,
    }).then((res) => res.json());

    console.log("raw data response: ", analysis.rawResults);

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
    console.log("video feedback received: ", feedback);

    return feedback;

    // when feedback is received, use it to pick one of three gooses, then provide feedback in speech bubble
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

  // function to display goose
  const showToneTemporarily = (tone, rawFeedbackText) => {
    const map = {
      Appreciative: "/images/Appreciative.png",
      Evaluative: "/images/Evaluative.png",
      Actionable: "/images/Actionable.png",
    };

    const img = map[tone];

    if (!img) {
      console.error("Unknown tone:", tone);
      return;
    }

    setToneImage(img); // display goose

    setSpeechBubble("/images/speech.png"); // display speech bubble
    setSpeechText(rawFeedbackText); // set speech bubble text

    // Hide after 10 seconds
    setTimeout(() => {
      setToneImage(null);
      setSpeechBubble(null);
      setSpeechText("");
    }, 8000);
  };

  const uploadFullVideo = async (blob) => {
  const userId = localStorage.getItem("userId"); 
  // make sure you save userId in localStorage during login

  const form = new FormData();
  form.append("video", blob, "recording.webm");
  form.append("userId", userId);

  try {
    const res = await fetch("http://localhost:5050/upload-full-video", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    console.log("UPLOAD RESULT:", data);
  } catch (err) {
    console.error("Failed to upload full video:", err);
  }
};


  useEffect(() => {
    startCamera();
  }, []);

  return (
    // <Layout>
    <div
      ref={containerRef}
      style={{ position: "relative", minHeight: "100vh" }}
    >
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
          <Layout></Layout>
        </>
      )}

      {/* VIDEO (normal size OR fullscreen) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: isFullscreenMode ? "100vw" : "52vw",
          height: isFullscreenMode ? "100vh" : "auto",
          objectFit: isFullscreenMode ? "cover" : "contain",
          borderRadius: isFullscreenMode ? "0px" : "20px",
          transform: isFullscreenMode
            ? "scaleX(-1)"
            : "translate(-50%, -50%) scaleX(-1)",
          background: "black",
          position: isFullscreenMode ? "relative" : "absolute",
          top: isFullscreenMode ? "0" : "45%",
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
                color: "black",
              }}
            >
              ⬇ Download Full Audio
            </a>
          )}
        </div>
      )}

      {/* SPEECH BUBBLE + TEXT */}
      {speechBubble && (
        <div
          style={{
            position: "fixed",
            bottom: "290px",
            left: "350px", // change to shift right
            width: "1000px",
            zIndex: 999999999,
          }}
        >
          <img
            src={speechBubble}
            alt="speech bubble"
            style={{
              width: "100%",
              height: "auto",
            }}
          />

          {/* TEXT */}
          <div
            style={{
              position: "absolute",
              top: "26%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "85%",
              fontSize: "2.2rem",
              fontWeight: "600",
              color: "black",
              lineHeight: "2.6rem",
              textAlign: "center",
              wordWrap: "break-word",
            }}
          >
            {speechText}
          </div>
        </div>
      )}

      {/* GOOSE */}
      {toneImage && (
        <img
          src={toneImage}
          alt="tone indicator"
          style={{
            position: "fixed",
            bottom: "-10px",
            left: "-120px", // moving goose toward left edge
            width: "600px",
            height: "600px",
            objectFit: "contain",
            zIndex: 99999999,
            pointerevents: "none",
            filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
          }}
        />
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
