import React, { useState } from "react";
import {
  Container,
  Button,
  SVG,
  Expanded,
  Item,
} from "../../styles/dropdown.styled";

export type DropdownProps = {
  label: string;
  items: string[];
  onSelect: (item: string) => void;
  selected?: string;
};

const Dropdown = ({ label, items, onSelect, selected }: DropdownProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setExpanded(false);
  };

  return (
    <Container>
      <div>
        <Button
          type="button"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setExpanded(!expanded)}
        >
          {label}
          <SVG
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </SVG>
        </Button>
      </div>
      {expanded && (
        <Expanded>
          <Item>
            {items.map(item => {
              return (
                <button
                  key={item}
                  role="menuitem"
                  tabIndex={1}
                  id="menu-item-0"
                  onClick={() => handleSelect(item)}
                >
                  {item}
                </button>
              );
            })}
          </Item>
        </Expanded>
      )}
    </Container>
  );
};

export default Dropdown;
