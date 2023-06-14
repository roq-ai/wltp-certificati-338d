import * as yup from 'yup';

export const cardValidationSchema = yup.object().shape({
  certification_status: yup.string().required(),
  details: yup.string().required(),
  organization_id: yup.string().nullable().required(),
});
