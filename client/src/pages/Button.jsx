import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import genie from "../assets/genie.png";

const Button = ({ textBefore, textAfter, to, fullSlide }) => {
  return (
    <StyledWrapper $fullSlide={fullSlide}>
      <Link to={to}>
        <button>
          <img src={genie} alt="genie" className="genie" />
          <span className="text-before">{textBefore}</span>
          <span className="text-after">{textAfter}</span>
        </button>
      </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Genie on left initially */
    gap: 12px;
    padding: 16px 40px;
    min-width: 260px; /* ensures long text fits */
    font-weight: 600;
    font-size: 18px;
    color: black;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 50px;
    border: 2px solid black;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #d4af37;
    transition: all 0.5s ease;
  }

  button:active {
    transform: scale(0.95);
  }

  button img.genie {
    width: 36px;
    height: 36px;
    margin-right: 10px;
    position: relative;
    z-index: 2;
    transition: all 0.7s ease;
  }

  button .text-before,
  button .text-after {
    position: absolute;
    transition: all 0.5s ease;
    font-family: "Cinzel Decorative", serif;
    white-space: nowrap;
  }

  button .text-before {
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  button .text-after {
    left: 50%;
    transform: translateX(150%);
    z-index: 1;
    opacity: 0;
  }

  button:hover img.genie {
    /* Use 170px for the leaderboard button (fullSlide=true) 
       and 140px for all others. This keeps the genie visible at the edge. */
    transform: translateX(${(props) => (props.$fullSlide ? '170px' : '140px')});
  }

  button:hover .text-before {
    transform: translateX(-150%);
    opacity: 0;
  }

  button:hover .text-after {
    transform: translateX(-50%);
    opacity: 1;
  }
`;

export default Button;