import * as optionTypes from './option-types';

export type EmailTemplate = optionTypes.EmailBasicOptions & (
  | optionTypes.ConfirmEmail
)