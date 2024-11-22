import React, { useState } from "react";
import { Input, Tag } from "antd";

interface Props {
  placeholder?: string;
  onUpdateChips?: (chips: string[]) => void; // Callback for updating chips
}

const SearchWithChips: React.FC<Props> = ({ placeholder, onUpdateChips }) => {
  const [chips, setChips] = useState<string[]>([]); // Specify that `chips` is a string array
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        const newChips = [...chips, trimmedValue];
        setChips(newChips);
        setInputValue("");
        onUpdateChips?.(newChips);
      }
    }
  };

  const handleChipRemove = (chipToRemove: string) => {
    const updatedChips = chips.filter((chip) => chip !== chipToRemove);
    setChips(updatedChips);
    onUpdateChips?.(updatedChips); 
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ border: "1px solid #d9d9d9", padding: "8px", borderRadius: "4px" }}>
        {chips.map((chip, index) => (
          <Tag
            key={index}
            closable
            onClose={() => handleChipRemove(chip)}
            style={{ marginBottom: "8px" }}
          >
            {chip}
          </Tag>
        ))}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder || "Type something and press Enter or ','"}
          bordered={false}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default SearchWithChips;
