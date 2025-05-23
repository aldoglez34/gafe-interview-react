export type TValidator = (value: string) => string | undefined;

export enum EFieldTypes {
  Input = 'input',
  Select = 'select',
}

interface IInputField {
  type: EFieldTypes;
  name: string;
  label: string;
  required?: boolean;
  validator?: TValidator;
}

export interface ISelectField extends IInputField {
  options: { value: string; label: string }[];
}

export type TFieldTypes = IInputField | ISelectField;