import styled from "styled-components";

const StyledButton = styled.button`
  font-size: 1rem;
  color: ${({ doInput, color }) => (doInput !== "" ? color : "black")};
`;

export function Button({ children, color, doInput }) {
  return (
    <StyledButton color={color} doInput={doInput}>
      {children}
    </StyledButton>
  );
}
