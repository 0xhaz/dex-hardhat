import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  background: #121a29;
  padding: 0.75em 1.75em;
  margin: 0.75em;
  min-height: 325px;
  grid-column-start: 1;
  grid-column-end: 13;
`;

export const Header = styled.div`
  margin: 0 0 0.75em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Flex = styled.div`
  display: flex;
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
