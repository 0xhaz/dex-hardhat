import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  background: #121a29;
  padding: 0.75em 1.75em;
  margin: 0.75em;
  min-height: 325px;
  max-width: 34%;
`;

export const Header = styled.div`
  margin: 0 0 0.75em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin: 0.375em 0;
  font-weight: 500;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
`;

export const Tabs = styled.div`
  border-radius: 10px;
  padding: 0.2em;
  display: grid;
  grid-template-columns: repeat(1fr);
  gap: 2px;
  margin-bottom: 10px;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  line-height: 1rem;
  margin-bottom: 0.45rem;
`;

export const Input = styled.input`
  display: block;
  width: 95%;
  border: none;
  font-size: 0.85rem;
  padding: 10px 5px;
  background: #0d121d;
  margin-bottom: 20px;
  &:focus {
    background-color: rgb(35, 57, 77);
  }
`;

export const Button = styled.button`
  background: #0d121d;
  min-width: 10em;
  padding: 0.5em 0.75em;
  margin-right: 0.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  align-items: center;
`;

export const selectedStyle = {
  backgroundColor: "#3773f5",
};

export const unselectedStyle = {
  color: "white",
};

export const disableStyle = {
  backgroundColor: "#385777",
};
