import styled from "styled-components";

const InputContainer = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #025928;
  display: block;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #733B0A;
  border-radius: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #82BF45;
  }
`;

const Input = ({ label, type, value,name, onChange }) => {
  return (
    <InputContainer>
      <Label>{label}</Label>
      <StyledInput type={type} value={value} onChange={onChange} name={name} required />
    </InputContainer>
  );
};

export default Input;
