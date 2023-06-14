import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCardById, updateCardById } from 'apiSdk/cards';
import { Error } from 'components/error';
import { cardValidationSchema } from 'validationSchema/cards';
import { CardInterface } from 'interfaces/card';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function CardEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CardInterface>(
    () => (id ? `/cards/${id}` : null),
    () => getCardById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CardInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCardById(id, values);
      mutate(updated);
      resetForm();
      router.push('/cards');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CardInterface>({
    initialValues: data,
    validationSchema: cardValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Card
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="certification_status" mb="4" isInvalid={!!formik.errors?.certification_status}>
              <FormLabel>Certification Status</FormLabel>
              <Input
                type="text"
                name="certification_status"
                value={formik.values?.certification_status}
                onChange={formik.handleChange}
              />
              {formik.errors.certification_status && (
                <FormErrorMessage>{formik.errors?.certification_status}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="details" mb="4" isInvalid={!!formik.errors?.details}>
              <FormLabel>Details</FormLabel>
              <Input type="text" name="details" value={formik.values?.details} onChange={formik.handleChange} />
              {formik.errors.details && <FormErrorMessage>{formik.errors?.details}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'card',
  operation: AccessOperationEnum.UPDATE,
})(CardEditPage);
