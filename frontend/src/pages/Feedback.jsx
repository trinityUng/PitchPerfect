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
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingLeft: "40px",
              paddingRight: "40px",

              paddingBottom: "20px",
            }}
          >
            <img
              src="/images/presentAgain.png"
              alt="Left button"
              className="button-image"
              style={{
                width: "105px",
                height: "90px",
                cursor: "pointer",
                marginLeft: "25px",
              }}
              onClick={() => navigate("/present")}
            />

            <img
              src="/images/binoGoose.png"
              alt="feedback icon"
              style={{
                width: "700px",
                marginBottom: "-20px",
              }}
            />

            <img
              src="/images/bluepdf.png"
              alt="download PDF"
              style={{
                width: "50px",
                cursor: "pointer",
                marginRight: "30px",
              }}
              onClick={downloadPDF}
            />

            <img
            src="/images/export.png"
            alt="Download Latest Video"
            onClick={downloadLatestVideo}
            style={{
                width: "70px",
                cursor: "pointer",
                marginRight: "40px",
            }}

            />
          </div>
        </div>
      </Layout>
    </div>
  );
}
