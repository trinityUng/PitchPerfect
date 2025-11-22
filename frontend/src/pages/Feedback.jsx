import Layout from "./Layout.jsx";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const navigate = useNavigate();
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
              style={{ width: "105px", height: "90px", cursor: "pointer", marginLeft: "25px" }}
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
              src="/images/export.png"
              alt="right button"
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