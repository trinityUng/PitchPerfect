import Layout from "./Layout.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Feedback() {
  const navigate = useNavigate();

  const [latestVideo, setLatestVideo] = useState(null);

    useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5050/user-videos/${userId}`)
        .then(res => res.json())
        .then(data => {
        if (data.videos && data.videos.length > 0) {
            setLatestVideo(data.videos[0]); // newest video (sorted in backend)
        }
        })
        .catch(err => console.error(err));
    }, []);


  const downloadLatestVideo = () => {
    if (!latestVideo) return;

    const filename = latestVideo.filePath.split("/").pop();
    const downloadURL = `http://localhost:5050/download/${filename}`;

    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

};

  // to create pdf
  const downloadPDF = async () => {
    try {
      const response = await fetch("http://localhost:5050/create-pdf", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("PDF generation failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "presentation-feedback.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  return (
    <div>
      <Layout>
        <div
          style={{
            position: "fixed",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "1000px",
            height: "550px",
            backgroundColor: "#FFFDEB",
            border: "transparent",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            zIndex: 5,
          }}
        >
          {/* BOTTOM ROW */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: "0px",
              }}
            >

            <h1
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                fontSize: "3rem",
                marginBottom: "1rem",
                marginTop: "0",
                textAlign: "center",
                color: "#1E406E",
              }}
            >
              Duck, duck… boost! Click the icons below to receive your feedback!
            </h1>

              {/* Button Row Centered */}
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  marginTop: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/images/presentAgain.png"
                  alt="present again"
                  className="button-image"
                  style={{ width: "105px", height: "90px", cursor: "pointer" }}
                  onClick={() => navigate("/present")}
                />

                <img
                  src="/images/bluepdf.png"
                  alt="download PDF"
                  className="button-image"
                  onClick={downloadPDF}
                  style={{ width: "60px", cursor: "pointer" }}
                />

                <img
                  src="/images/export.png"
                  alt="download video"
                  className="button-image"
                  onClick={downloadLatestVideo}
                  style={{ width: "70px", cursor: "pointer" }}
                />
              </div>
                <img
                  src="/images/binGoose.png"
                  alt="feedback icon"
                  style={{
                    width: "300px",
                    marginTop: "20px",   
                  }}
                />
            </div>
            </div>
      </Layout>
    </div>
  );
}
