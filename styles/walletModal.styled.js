import styled from "styled-components";

export const Wrapper = styled.div`
  height: 35rem;
  width: 27rem;
  color: white;
  border: 1px solid #282b2f;
  display: flex;
  flex-direction: column;
`;

export const Selector = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 5rem;
`;

export const Option = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  font-size: 1.2rem;
  font-weight: 600;

  &:hover {
    cursor: pointer;
    background-color: #111214;
  }
`;

export const selectedStyle = {
  color: "#3773f5",
};

export const unselectedStyle = {
  border: "1px solid #282b2f",
};

export const ModalMain = styled.div`
  padding: 1rem;
  flex: 1;
`;
