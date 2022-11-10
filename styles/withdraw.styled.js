import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
`;

export const WalletContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

export const Title = styled.div`
  align-self: center;
  margin-left: 1rem;
`;

export const Account = styled.p`
  margin-left: 1rem;
  margin-top: 1rem;
`;

export const SVG = styled.svg`
  height: 2rem;
  width: 2rem;
`;

export const Container = styled.div`
  position: absolute;
  width: 90%;
`;

export const InputContainer = styled.div`
  border: 1px solid white;
  border-radius: 0.35rem;
  padding: 1rem 1rem;
`;

export const SubmitContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: -30px;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  line-height: 1rem;
  margin-bottom: 0.85rem;
`;

export const Input = styled.input`
  display: block;
  width: 100%;
  border: none;
  font-size: 1rem;
  padding: 5px;
  background: transparent;
  margin-bottom: 1rem;
  &:focus {
    background-color: rgb(38, 57, 77);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
`;

export const Button = styled.button`
  width: 30%;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  border-radius: 0.5rem;
  margin: 0.2rem 0.1rem;
  /* border-color: rgba(229, 231, 235); */
  font-size: 1rem;
  line-height: 1.25rem;

  &:hover {
    background-color: #3773f5;
  }
`;
