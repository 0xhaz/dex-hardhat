import styled from "styled-components";
import Blockies from "react-blockies";

export const Wrapper = styled.div`
  width: calc(100% - 3rem);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #282b2f;
  display: flex;
  align-items: center;
  z-index: 1;
`;

export const Title = styled.div`
  font-size: 2rem;
  font-weight: 600;
  flex: 1;
`;

export const ButtonsContainer = styled.div`
  display: flex;
`;

export const Button = styled.div`
  border: 1px solid #282b2f;
  padding: 0.8rem;
  font-size: 1.3rem;
  font-weight: 500;
  border-radius: 0.4rem;
  margin-right: 1rem;

  &:hover {
    cursor: pointer;
  }
`;

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#0a0b0d",
    padding: 0,
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(10, 11, 13, 0.75)",
  },
};

export const myBlockies = styled.div`
  margin: 0 0 0 0.6em;
  padding: 1rem;
`;

export const Text = styled.p`
  font-weight: 400;
`;
