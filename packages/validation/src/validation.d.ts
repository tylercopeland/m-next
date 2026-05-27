declare module '@m-next/validation' {
    import * as React from 'react';

    export interface ValidationRuleRequired {
        type: 'isRequired' | 'isValidEmail';
        customMessage?: string;
    }

    export interface ValidationRuleLength {
        type: 'isValidLength';
        customMessage?: string;
        minLength?: number;
        maxLength?: number;
    }

    export interface ValidationRuleRange {
        type: 'isValidRange';
        customMessage?: string;
        minValue?: number;
        maxValue?: number;
    }

    export type ValidationRule =
        | ValidationRuleRequired
        | ValidationRuleLength
        | ValidationRuleRange;

    export interface ValidationProps {
        id?: string;
        message?: string | React.ReactNode;
        isV4Design?: boolean;
        compactStyle?: boolean;
        onValidation?: (isValid: boolean) => void;
        rules?: ValidationRule[];
        value?: string | number;
    }
    
    export interface ValidationMessageProps {
        id?: string;
        message?: string | React.ReactNode;
        isV4Design?: boolean;
        compactStyle?: boolean;
    }

    export const Validation: React.FC<ValidationProps>;
    export const ValidationMessage: React.FC<ValidationMessageProps>;
}