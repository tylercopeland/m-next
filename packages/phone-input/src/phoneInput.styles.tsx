import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import styled from '@emotion/styled';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';

export const ReactPhoneStyled = styled(PhoneInput) <{ isMobile: boolean }>`
    .country-list {
        width: 300px;
        height: 300px;
        max-height: 300px;
        overflow-x: hidden;
    }

    .form-control {
        height: ${({ isMobile }) => isMobile ? '48px' : '32px'};
        width: 100%;
        border-radius: 2px;
        background-color: transparent;
        z-index: 3;
    }

    .form-control:hover:not(:focus) {
        border-color: black;
        background-color: transparent;
    }

    .form-control:focus {
        border-color: ${colors['blue']};
        background-color: transparent;
    }

    .flag-dropdown {
        border: none;
        margin: 1px;
        border-radius: 2px; 
        background-color: transparent;
        z-index: 4;  
    }
    .flag-dropdown:hover {
        background-color: transparent;
    }

    .selected-flag, .selected-flag:hover {
        background-color: transparent;
    }
    .selected-flag > div {
        border-radius: 2px;        
    }

    .search {
        padding-right: ${({ isMobile }) => isMobile ? '40px' : '20px'} !important;
    }
`;

export const ReactPhoneContainer = styled.div`
    border: none;
    position: relative;
    width: 100%;
`;

export const ValidationMessage = styled.span`
    display: block;
    color: ${colors['red']};
    width: 100%;
    font-size: 12px;
    line-height: 16px;
`;

export const ValidationMessageWrapper = styled.div`    
    display: flex;
    align-items: center;
    align-items: flex-start; /* to top align icon */
    margin: 6px 0 14px 0;
    margin-bottom: 10px
`;

export const ValidationIcon = styled(SvgIcon)`
    padding-right: 4px;
    color: ${colors['red']};
`;