import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  background: #121a29;
  padding: 0.75em 1.75em;
  margin: 0.75em;
  grid-column-start: 1;
  grid-column-end: 13;
`;

export const Header = styled.div`
  margin: 0 0 0.75em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3em 0.75em 0;
`;

export const Title = styled.h2`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin: 0.375em 0;
  font-weight: 500;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
`;

export const Orders = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5rem;
`;

export const AltText = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 30px;
  margin: 0 auto;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 500;
`;

export const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  text-align: left;

  margin: 0 0 0.5em;

  tr:hover {
    background: #0d121d;
    cursor: pointer;
  }
`;

export const Caption = styled.caption`
  text-align: left;
  margin: 0 0 0.5em;
`;

export const Th = styled.th`
  color: "#767f92";
  margin: 0.5em 0;
  font-size: 0.85em;
  font-weight: 500;
  text-align: right;
  &:first-child {
    text-align: left;
    display: flex;
  }
`;

export const Td = styled.td`
  min-width: max-content;
  margin: 0.3em 0;
  font-size: clamp(0.9rem, 2vw, 0.95rem);
  font-weight: 400;
  text-align: right;
  &:first-child {
    text-align: left;
    display: flex;
  }
`;

export const Divider = styled.div`
  padding: 0 15px;
`;
