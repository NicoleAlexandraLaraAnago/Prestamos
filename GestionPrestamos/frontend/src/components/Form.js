import styled from "styled-components";

const FormContainer = styled.form`
  background: #F2F2F2;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-top: 20px;
  margin-right: auto;
  margin-bottom: 20px;
  margin-left: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;
    color: #025928;
  }

  input, select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
  }

  .full-width {
    grid-column: span 2; /* Para inputs que ocupen las dos columnas */
  }

  button {
    grid-column: span 2;
    background: #025928;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
  }

  button:hover {
    background: #82BF45;
  }
`;

export default FormContainer;
