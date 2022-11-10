import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const Button = styled.button`
  display: inline-flex;
  justify-content: center;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid gray;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-weight: 500;
`;

export const SVG = styled.svg`
  margin: 0 1rem;
  height: 1rem;
  width: 1rem;
`;

export const Expanded = styled.div`
  transform-origin: top right;
  position: absolute;
  margin-top: 0.2rem;
  width: 14rem;
  border-radius: 0.375rem;
`;

export const Item = styled.div`
  padding: 0.2rem 0;
`;
