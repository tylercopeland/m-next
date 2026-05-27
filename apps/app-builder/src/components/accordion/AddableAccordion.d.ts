import { ReactNode } from 'react';

export interface AddableAccordionProps {
  children?: ReactNode;
  title?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onAdd?: () => void;
  canAdd?: boolean;
  addButtonLabel?: string;
  className?: string;
}

declare const AddableAccordion: React.FC<AddableAccordionProps>;
export default AddableAccordion;
