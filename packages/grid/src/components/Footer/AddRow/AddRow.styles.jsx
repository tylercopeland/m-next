import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

export const Input = styled.input`
    font-size: 16px !important;
    padding: 8px !important;
    border: 1px solid #545F67 !important;
    border-radius: 2px !important;
    margin: 0 16px 0 0 !important;
    width: 72px !important;

    &:focus {
        outline: none;
        border-color: #0D71C8
        box-shadow: 0 0 1px 2px rgba(93, 157, 213, 0.3);
    }

    &:hover {
        border-color: #0D71C8
    }
`;
