import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router';
import { User, UserType } from '../../user.mjs';
import userService from '../services/user.service';
import { EFieldTypes, ISelectField, TFieldTypes, TValidator } from '../utils/types';
import validators from '../utils/validators';
import styles from './UserForm.module.css';

const fields: TFieldTypes[] = [
  {
    type: EFieldTypes.Input,
    name: 'firstName',
    label: 'First Name',
    required: true,
    validator: validators.isValidString,
  },
  {
    type: EFieldTypes.Input,
    name: 'lastName',
    label: 'Last Name',
    required: true,
    validator: validators.isValidString,
  },
  {
    type: EFieldTypes.Input,
    name: 'phoneNumber',
    label: 'Phone Number',
    validator: validators.isValidPhoneNumber,
  },
  {
    type: EFieldTypes.Input,
    name: 'email',
    label: 'Email',
    required: true,
    validator: validators.isValidEmail,
  },
  {
    type: EFieldTypes.Select,
    name: 'type',
    label: 'Type',
    options: [
      { value: UserType.Basic, label: 'Basic' },
      { value: UserType.Admin, label: 'Admin' },
    ],
    required: true,
    validator: validators.isValidString,
  },
];

// I'm not super happy with this, with more time I would move this to a hook or a headless component
const fieldMapper: Record<
  EFieldTypes,
  (args: {
    value: string;
    field: TFieldTypes;
    onChange: (name: string, value: string, validator?: TValidator) => void;
  }) => React.ReactNode
> = {
  input: args => (
    <input
      id={args.field.name}
      name={args.field.name}
      onChange={e => args.onChange(args.field.name, e.target.value, args.field.validator)}
      value={args.value}
    />
  ),
  select: args => (
    <select
      id={args.field.name}
      name={args.field.name}
      onChange={e => args.onChange(args.field.name, e.target.value, args.field.validator)}
      value={args.value}
    >
      <option disabled value="">
        Select an option
      </option>
      {(args.field as ISelectField).options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
};

const INITIAL_DATA: User = {
  _id: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  type: '' as UserType,
};

export const UserForm = ({ user }: { user?: User }) => {
  const [formData, setFormData] = useState(user ?? INITIAL_DATA);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleChangeValue = (name: string, value: string, validator?: TValidator) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validator?.(value) ?? '',
    }));
  };

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await userService.create(formData);
      setFormData(INITIAL_DATA);
      navigate('/');
    } catch (err) {
      console.log({ err });
    }
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await userService.update(formData);
      setFormData(INITIAL_DATA);
      navigate('/');
    } catch (err) {
      console.log({ err });
    }
  };

  const onCancel = () => {
    setFormData(INITIAL_DATA);
    navigate('/');
  };

  /* ---------------------------------- UTILS --------------------------------- */
  const allFormsFilled = fields
    .filter(field => field.required)
    .every(field => formData[field.name] !== '');

  const hasErrors = Object.entries(errors).some(([, errorMsg]) => errorMsg);

  return (
    <form className={styles['form']} onSubmit={user ? onUpdate : onCreate}>
      {fields.map((field, idx) => (
        <Fragment key={idx}>
          <label htmlFor={field.name}>
            {field.label}
            {field.required && '*'}
          </label>
          {fieldMapper[field.type]({
            value: formData[field.name],
            field,
            onChange: handleChangeValue,
          })}
          {errors[field.name] && <span className={styles['error']}>{errors[field.name]}</span>}
        </Fragment>
      ))}
      <div>
        <button onClick={onCancel} type="button">
          Cancel
        </button>
        <button disabled={!allFormsFilled || hasErrors} type="submit">
          {user ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};
