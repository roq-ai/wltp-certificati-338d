import * as yup from 'yup';
import { cardValidationSchema } from 'validationSchema/cards';

export const organizationValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  card: yup.array().of(cardValidationSchema),
});
