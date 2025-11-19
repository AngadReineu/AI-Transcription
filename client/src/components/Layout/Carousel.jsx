import React from "react";
import "./carousel.css";
import ice from "../../assets/ice.jpg"
import bg from "../../assets/bg.jpg"

const Carousel = () => {
  const items = [
    "HTML",
    "CSS",
    "JavaScript",
    "ReactJS",
    "Figma",
    "WhisperAI",
    "Next.js",
    "Tailwind",
    "ANGAD",
    "juice WRLD"
  ];

  return (
    <div className="carousel-container">
      {/* Each scroll bar */}
      <div className="scroll" style={{ "--t": "20s" }}>
        <div>{items.map((tech) => <span key={tech}>{tech}</span>)}</div>
        <div>{items.map((tech) => <span key={tech + "2"}>{tech}</span>)}</div>
      </div>

      <div className="scroll" style={{ "--t": "30s" }}>
        <div>{items.map((tech) => <span key={tech + "3"}>{tech}</span>)}</div>
        <div>{items.map((tech) => <span key={tech + "4"}>{tech}</span>)}</div>
      </div>

      <div className="scroll" style={{ "--t": "10s" }}>
        <div>{items.map((tech) => <span key={tech + "5"}>{tech}</span>)}</div>
        <div>{items.map((tech) => <span key={tech + "6"}>{tech}</span>)}</div>
      </div>

      <div className="scroll" style={{ "--t": "40s" }}>
        <div>{items.map((tech) => <span key={tech + "7"}>{tech}</span>)}</div>
        <div>{items.map((tech) => <span key={tech + "8"}>{tech}</span>)}</div>
      </div>
      {/* <div className="scroll" style={{ "--t": "5s" }}>
        <div>
        <img src={ice} alt="ice" />
        <img src={bg} alt="bg" />
        </div>
      </div> */}
    </div>
  );
};

export default Carousel;
