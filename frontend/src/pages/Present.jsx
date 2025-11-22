import { useEffect, useRef, useState } from "react";

export default function Present() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isRecordingState, setIsRecordingState] = useState(false);


  // RECORDERS
  const loopAudioRecorderRef = useRef(null);
  const loopVideoRecorderRef = useRef(null);
  const fullAudioRecorderRef = useRef(null);
  const fullVideoRecorderRef = useRef(null);

  // INTERVAL STOP FLAGS
  const recordingFlagRef = useRef(false);

  // DOWNLOAD URLs
  const [fullAudioURL, setFullAudioURL] = useState(null);
  const [fullVideoURL, setFullVideoURL] = useState(null);

  /* ---------------------------------------------
     1. START CAMERA
  --------------------------------------------- */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

    } catch (err) {
      console.error("Camera access error:", err);
      alert("Camera or microphone not available.");
    }
  };

  /* ---------------------------------------------
     2. START RECORDING
  --------------------------------------------- */
  const startRecording = () => {
    if (!streamRef.current) return;

    recordingFlagRef.current = true;
    setIsRecordingState(true);

    const stream = streamRef.current;
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    /* -------------------------
       FULL VIDEO (with audio)
    --------------------------*/
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


    /* -------------------------
       FULL AUDIO (microphone only)
    --------------------------*/
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


    /* -------------------------
       LOOP AUDIO RECORDER (2 sec)
    --------------------------*/
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
        setTimeout(() => loopAudioRecorder.stop(), 2000);
      }
    };

    loopAudioRecorder.start();
    setTimeout(() => loopAudioRecorder.stop(), 2000);



    /* -------------------------
       LOOP VIDEO RECORDER (2 sec)
    --------------------------*/
    const loopVideoStream = new MediaStream([videoTrack]);
    let loopVideoChunks = [];

    const loopVideoRecorder = new MediaRecorder(loopVideoStream, {
      mimeType: "video/webm; codecs=vp8",
    });
    loopVideoRecorderRef.current = loopVideoRecorder;

    loopVideoRecorder.ondataavailable = (e) => loopVideoChunks.push(e.data);

    loopVideoRecorder.onstop = () => {
      const blob = new Blob(loopVideoChunks, { type: "video/webm" });
      loopVideoChunks = [];

      sendVideoChunk(blob);

      if (recordingFlagRef.current) {
        loopVideoRecorder.start();
        setTimeout(() => loopVideoRecorder.stop(), 2000);
      }
    };

    loopVideoRecorder.start();
    setTimeout(() => loopVideoRecorder.stop(), 2000);
  };

  /* ---------------------------------------------
     3. STOP RECORDING
  --------------------------------------------- */
  const stopRecording = () => {
    recordingFlagRef.current = false;
    setIsRecordingState(false);


    fullVideoRecorderRef.current?.stop();
    fullAudioRecorderRef.current?.stop();
    loopAudioRecorderRef.current?.stop();
    loopVideoRecorderRef.current?.stop();
  };

  /* ---------------------------------------------
     4. SEND AUDIO CHUNK TO BACKEND
  --------------------------------------------- */
  const sendAudioChunk = async (blob) => {
    const form = new FormData();
    form.append("audio", blob);

    try {
      await fetch("http://localhost:5000/audio-chunk", {
        method: "POST",
        body: form,
      });
    } catch (err) {
      console.error("Audio chunk error:", err);
    }
  };

  /* ---------------------------------------------
     5. SEND VIDEO CHUNK TO BACKEND
  --------------------------------------------- */
  const sendVideoChunk = async (blob) => {
    const form = new FormData();
    form.append("video", blob);

    try {
      await fetch("http://localhost:5000/video-chunk", {
        method: "POST",
        body: form,
      });
    } catch (err) {
      console.error("Video chunk error:", err);
    }
  };

  /* ---------------------------------------------
     INIT CAMERA
  --------------------------------------------- */
  useEffect(() => {
    startCamera();
  }, []);

  /* ---------------------------------------------
     RENDER UI
  --------------------------------------------- */
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Presentation Mode</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "70vw",
          maxWidth: "900px",
          borderRadius: "20px",
          transform: "scaleX(-1)",
        }}
      ></video>

      {!isRecordingState ? (
        <button onClick={startRecording} style={styles.btn}>
          🎤 Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} style={styles.stopBtn}>
          ⏹ Stop Recording
        </button>
      )}

      {fullAudioURL && (
        <div style={{ marginTop: "20px" }}>
          <a href={fullAudioURL} download="full-audio.webm">
            ⬇ Download Full Audio
          </a>
        </div>
      )}

      {fullVideoURL && (
        <div style={{ marginTop: "10px" }}>
          <a href={fullVideoURL} download="full-video.webm">
            ⬇ Download Full Video (audio + visual)
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  btn: {
    padding: "12px 20px",
    fontSize: "1.2rem",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "20px",
  },
  stopBtn: {
    padding: "12px 20px",
    fontSize: "1.2rem",
    borderRadius: "10px",
    cursor: "pointer",
    background: "red",
    color: "white",
    marginTop: "20px",
  },
};
