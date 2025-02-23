import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #025928;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background-color: #82BF45;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Button = ({ text, onClick, disabled }) => {
  return <StyledButton onClick={onClick} disabled={disabled}>{text}</StyledButton>;
};

export default Button;
