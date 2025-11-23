import Layout from "./Layout.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Feedback() {
  const navigate = useNavigate();

  const [latestVideo, setLatestVideo] = useState(null);
  const [latestPDF, setLatestPDF] = useState(null);
  const [toneScore, setToneScore] = useState(0); // <-- new state for score
  const [dictionScore, setDictionScore] = useState(0); // <-- new state for score
  const [confidenceScore, setConfidenceScore] = useState(0); // <-- new state for score

  useEffect(() => {
    // Generate a tone score
    const tonescore = Math.floor(Math.random() * (75 - 55 + 1)) + 55;
    setToneScore(tonescore);

        // Generate a tone score
        const dictionscore = Math.floor(Math.random() * (65 - 45 + 1)) + 45;
        setDictionScore(dictionscore);

            // Generate a tone score
    const confidencescore = Math.floor(Math.random() * (90 - 70 + 1)) + 70;
    setConfidenceScore(confidencescore);

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Fetch newest video
    fetch(`http://localhost:5050/user-videos/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.videos && data.videos.length > 0) {
          setLatestVideo(data.videos[0]);
        }
      })
      .catch((err) => console.error(err));

    // Fetch newest PDF
    fetch(`http://localhost:5050/user-pdfs/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.pdfs && data.pdfs.length > 0) {
          setLatestPDF(data.pdfs[0]); // newest PDF
        }
      })
      .catch((err) => console.error(err));
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

    const downloadLatestPDF = () => {
    if (!latestPDF) {
      console.error("No PDF found for this user");
      return;
    }

    const filename = latestPDF.filePath.split("/").pop();
    const downloadURL = `http://localhost:5050/download-pdf/${filename}`;

    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // to create pdf
  /**const downloadPDF = async () => {
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
  };**/

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
            justifyContent: "flex-start", // Align content from the top
            alignItems: "center",
            zIndex: 5
          }}
        >
          <div>
          <h1
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                fontSize: "2rem",
                // marginBottom: "1rem",
                marginTop: "4vh",
                textAlign: "center",
                color: "#1E406E",
                zIndex: 20
              }}
            >
              Duck, duck… boost! Click the icons below to receive your feedback!
            </h1>
          </div>
          <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2vh",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "5vh",
          }}
        >

          <div
          style={{
            width: "200px", /* Nearly half the container width */
            height: "100px",
            margin: "10px", /* Adds space around items */
            /* Basic styling for visibility */
            textAlign: "center",
          }}
        >
          <label
            style={{
              fontFamily: "Jua-Regular",
              color: "#1E406E",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              marginTop: "1vh"
            }}
          >
            Tone Score:
          </label>
          <h1 style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginTop: "0",
            marginBottom: "0.1vh",
            fontSize: "clamp(1.2rem, 20vw, 5.0rem)",
          }}>{toneScore}</h1>
          </div>

          <div
          style={{
            width: "200px", /* Nearly half the container width */
            height: "100px",
            margin: "10px", /* Adds space around items */
            /* Basic styling for visibility */
            textAlign: "center",
          }}
        >
          <label
            style={{
              fontFamily: "Jua-Regular",
              color: "#1E406E",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              marginTop: "1vh"
            }}
          >
            Diction Score:
          </label>
          <h1 style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginTop: "0",
            marginBottom: "0.1vh",
            fontSize: "clamp(1.2rem, 20vw, 5.0rem)",
          }}>{dictionScore}</h1>
          </div>

          <div
          style={{
            width: "200px", /* Nearly half the container width */
            height: "100px",
            margin: "10px", /* Adds space around items */
            /* Basic styling for visibility */
            textAlign: "center",
          }}
        >
          <label
            style={{
              fontFamily: "Jua-Regular",
              color: "#1E406E",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              marginTop: "1vh"
            }}
          >
            Confidence Score:
          </label>
          <h1 style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginTop: "0",
            marginBottom: "0.1vh",
            fontSize: "clamp(1.2rem, 20vw, 5.0rem)",
          }}>{confidenceScore}</h1>
          </div>


          
          </div>
          {/* <h1>{randomScore}</h1> */}
                    {/* Display random score */}
                    {/* <h1
            style={{
              color: "#1E406E",
              fontFamily: "Jua-Regular",
              marginBottom: "20px",
              fontSize: "2rem",
            }}
          >
            Tone Score: {toneScore}
          </h1>

          <h1
            style={{
              color: "#1E406E",
              fontFamily: "Jua-Regular",
              marginBottom: "20px",
              fontSize: "2rem",
            }}
          >
            Diction Score: {dictionScore}
          </h1>

          <h1
            style={{
              color: "#1E406E",
              fontFamily: "Jua-Regular",
              marginBottom: "20px",
              fontSize: "2rem",
            }}
          >
            Confidence Score: {confidenceScore}
          </h1> */}
          {/* BOTTOM ROW */}
          {/* <div
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
              src="/images/binGoose.png"
              alt="feedback icon"
              style={{
                width: "250px",
                marginTop: "160px",
                alignItems:"center"
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
              onClick={downloadLatestPDF}
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
          </div> */}
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
  {/* Left Button */}
  <img
    src="/images/presentAgain.png"
    alt="Left button"
    className="button-image"
    style={{
      width: "105px",
      height: "90px",
      cursor: "pointer",
      marginLeft: "20px",
      marginBottom: "20px"
    }}
    onClick={() => navigate("/present")}
  />

  {/* Center Image */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      flex: 1, // take remaining space
    }}
  >
    <img
      src="/images/binGoose.png"
      alt="feedback icon"
      style={{
        width: "250px",
        marginTop: "105px"
      }}
    />
  </div>

  {/* Right Stack */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      marginRight: "20px",
      marginBottom: "20px"
    }}
  >
    <img
      src="/images/bluepdf.png"
      alt="download PDF"
      style={{
        width: "50px",
        cursor: "pointer",
      }}
      onClick={downloadLatestPDF}
    />
    <img
      src="/images/export.png"
      alt="Download Latest Video"
      style={{
        width: "70px",
        cursor: "pointer",
      }}
      onClick={downloadLatestVideo}
    />
  </div>
</div>
        </div>
      </Layout>
    </div>
  );
}
