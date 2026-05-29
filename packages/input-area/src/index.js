import InputArea from './InputArea';

// `Textarea` is the canonical name going forward (per the m-one design system audit).
// The package and default export are kept as `InputArea` for backwards compatibility.
export { default as Textarea } from './InputArea';
export { default as InputArea } from './InputArea';
export { default as DebouncedInputArea } from './DebouncedInputArea';
export { default as DebouncedTextarea } from './DebouncedInputArea';

export default InputArea;
