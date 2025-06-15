// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect, forwardRef } from 'react';
// components
import Page from '../../components/Page';
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  ButtonBase,
  IconButton,
  TextField,
  InputAdornment,
  Badge,
} from '@mui/material';
import { IconButtonAnimate } from 'src/components/animate';
import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch } from 'react-redux';
//import { updateProgram } from "src/redux/actions/createProgram";

import Iconify from '../../components/Iconify';
import LabeledInput from '../../components/core/LabeledInput';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { handleuploadImage } from 'src/utils/uploader';
import Input from 'src/components/Labs/Cropper';
import { useOutletContext } from 'react-router-dom';
import DurationPopover from 'src/components/instructor/durationPopover';
import WorkoutIntensityPopOver from 'src/components/instructor/calenderFormatPopover';
import SubscriptionTypePopover from 'src/components/instructor/subscriptionTypePopover';
import ProgramTypePopover from 'src/components/instructor/ProgramTypePopover';
import MaximumClientPopover from 'src/components/instructor/MaximumClientPopover';
import { useConfirmationModalContext } from 'src/utils/Modal';
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal';
import MaskedInput from 'src/components/core/MaskedInput';
import { hasExercisesInWeeks } from 'src/utils/commonHelper';
import AddImage from 'src/assets/IconSet/AddImage';
const RootStyle = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  flexGrow: 1,
  height: '100vh',
}));

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  maxWidth: 'xs',
  zIndex: 100,
  borderRadius: '0px 0px 8px 8px',
}));

const InsideBoxStyle = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  paddingTop: 52,
  paddingBottom: 24,
  zIndex: 100,
  top: 0,
}));
const SocialButton = styled(ButtonBase)(({ theme }) => ({
  height: 45,

  borderRadius: 16,
  background: '#F9FCFD',
  fontFamily: 'Proxima Nova',
  /* Dark primary / 50% */
  color: '#172A44',
  fontSize: 18,
  fontWeight: 'bold',
  width: '100%',
  marginBottom: 8,
  border: '2px solid rgba(23, 42, 68, 0.5)',
}));

// ----------------------------------------------------------------------

export default forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const modalContext = useConfirmationModalContext();
  const [Program, updateProgram, mode] = useOutletContext();

  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const [selectedDuration, setSelectedDuration] = useState(
    Program.ExercisePlan.weeks.length ? Program.ExercisePlan.weeks.length : 4,
  );
  const [selectedType, setSelectedType] = useState(Program.Type ? Program.Type : 'Easy');
  const handleSelectDuration = (val) => {
    if (val > selectedDuration) {
      setSelectedDuration(val);
      setFieldValue('Duration', val);

      return;
    } else {
      if (hasExercisesInWeeks(Program, val, selectedDuration)) {
        modalContext
          .showConfirmationModal(
            'Alert!',
            'Reducing week in already created calendar will delete all the workouts of deleted week. Do you want to continue?',
            'Yes',
            'No',
          )
          .then((res) => {
            if (res) {
              setSelectedDuration(val);
              setFieldValue('Duration', val);
            } else {
            }
          });
      } else {
        setSelectedDuration(val);
        setFieldValue('Duration', val);

        return;
      }
    }

    // setSelectedDuration(val);
    // dispatch(
    //   updateProgram({
    //     Duration: val,
    //   })
    // );
  };
  const handleSelectType = (val) => {
    setFieldValue('calendarType', val);
    dispatch(
      updateProgram({
        calendarType: val,
      }),
    );
  };

  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').max(50, 'Title too long'),
    // description: Yup.string()
    //     .required('Description is required')
    //     .max(1000, 'Description too long'),
    price: Yup.number().required('Price is required'),
    totalClients: Yup.number().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      title: Program.Title || '',
      description: Program.Description || '',
      BannerImage: Program.BannerImage,
      price: Program.Price,
      PaymentType: Program.PaymentType || 'Free',
      ProgramType: Program.ProgramType || 'Public',
      maximumClient: Program.maximumClient || 'Unlimited',
      totalClients: Program.totalClients || 10,
      calendarType: Program.calendarType || 'Standard days',
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      let weeks = [...Program.ExercisePlan.weeks];
      if (selectedDuration < Program.Duration) {
        weeks.splice(selectedDuration, Program.Duration - 1);
      }

      if (selectedDuration > Program.Duration) {
        let it = new Array(selectedDuration - Program.Duration).fill(0).map((i) => {
          weeks.push({
            days: [
              {
                Title: '',
                IsRest: false,
                Exercise: [],
                Cover: null,
              },
              {
                Title: '',
                IsRest: false,
                Exercise: [],
                Cover: null,
              },
              {
                Title: '',
                IsRest: false,
                Exercise: [],
                Cover: null,
              },
              {
                Title: '',
                IsRest: false,
                Exercise: [],
                Cover: null,
              },
              {
                Title: '',
                IsRest: false,
                Exercise: [],
                Cover: null,
              },
              {
                Title: '',
                IsRest: false,
                Exercise: [],
                Cover: null,
              },
              {
                Title: '',
                IsRest: false,
                Exercise: [],
                Cover: null,
              },
            ],
          });
          return 'dsf';
        });
      }

      dispatch(
        updateProgram({
          Title: values.title,
          Description: values.description,
          BannerImage: values.BannerImage,
          Duration: selectedDuration || 4,
          Price: values.price,
          ProgramType: values.ProgramType,
          ExercisePlan: {
            ...Program.ExercisePlan,
            weeks: weeks,
          },
        }),
      );

      //navigate(computePath(mode, "/workoutCalendar", Program._id));
    },
  });

  const handleMaximumClient = (val) => {
    if (val == 'Limited') {
      setFieldValue('totalClients', 10);
      setFieldValue('maximumClient', val);
      dispatch(
        updateProgram({
          totalClients: 10,
          maximumClient: val,
        }),
      );
    } else {
      setFieldValue('maximumClient', val);
      dispatch(
        updateProgram({
          maximumClient: val,
        }),
      );
    }
  };

  const handleSubscriptionType = (val) => {
    if (val == 'Free') {
      setFieldValue('price', 0);
      setFieldValue('PaymentType', val);
      dispatch(
        updateProgram({
          Price: 0,
          PaymentType: val,
        }),
      );
    } else {
      setFieldValue('PaymentType', val);
      dispatch(
        updateProgram({
          PaymentType: val,
        }),
      );
    }
  };

  const handleProgramType = (val) => {
    setFieldValue('ProgramType', val);
    dispatch(
      updateProgram({
        ProgramType: val,
      }),
    );
  };

  const { errors, touched, handleSubmit, isSubmitting, isValid, validateForm, getFieldProps, setFieldValue, values } =
    formik;

  useEffect(() => {
    ref.current = {
      errors,
      touched,
      handleSubmit,
      isSubmitting,

      validateForm,
      getFieldProps,
      setFieldValue,
      values,
    };
  }, []);

  return (
    <Content
      withoutPadding
      style={{ paddingBottom: 24, background: '#fff' }}
    >
      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
        >
          <Input
            hidden
            accept="image/*"
            type="file"
            id="bannerImage"
            onChange={(e) => {
              dispatch(updateFeedback({ loading: true }));
              handleuploadImage(e).then((res) => {
                setFieldValue('BannerImage', res.data.Location);
                dispatch(updateFeedback({ loading: false }));
              });
            }}
            cropShape={'rect'}
            aspect={1.5}
          />
          <br />
          <br />
          <Stack
            spacing={3}
            sx={{ width: '100%', px: 2 }}
          >
            <LabeledInput
              fullWidth
              placeholder="Example: Muscle build"
              maxLength={50}
              clabel="Program title"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              inputProps={{
                maxLength: 50,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {(formik.values.title + '').length + '/50'}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <BoxStyle>
              <Box width="100%">
                <Typography
                  variant="subtitle1"
                  mb={1}
                >
                  Duration
                </Typography>{' '}
                <DurationPopover
                  selectedDuration={selectedDuration}
                  setSelectedDuration={handleSelectDuration}
                ></DurationPopover>
              </Box>{' '}
              &nbsp;&nbsp;
              <Box width="100%">
                <Typography
                  variant="subtitle1"
                  mx={1}
                  mb={1}
                >
                  Calendar format
                </Typography>{' '}
                <WorkoutIntensityPopOver
                  setSelectedType={handleSelectType}
                  selectedType={values.calendarType}
                ></WorkoutIntensityPopOver>
              </Box>
            </BoxStyle>
            {/* <BoxStyle display={'flex'} alignItems={'center'}>
                            <Box width="50%">
                                <Box
                                    display="flex"
                                    alignItems={'center'}
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Maximum client’s
                                    </Typography>{' '}
                                </Box>
                                <MaximumClientPopover
                                    selectedSubscriptionType={
                                        values.maximumClient
                                    }
                                    setSubscriptionType={handleMaximumClient}
                                ></MaximumClientPopover>
                            </Box>
                            &nbsp;&nbsp;
                            <Box width="50%">
                                <Box
                                    display="flex"
                                    alignItems={'center'}
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography
                                        variant="h6"
                                        color={
                                            values.maximumClient == 'Unlimited'
                                                ? 'grey.400'
                                                : 'text.primary'
                                        }
                                    >
                                        Total clients
                                    </Typography>{' '}
                                </Box>

                                <MaskedInput
                                    fullWidth
                                    {...getFieldProps('totalClients')}
                                    value={
                                        values.maximumClient == 'Unlimited'
                                            ? 0
                                            : getFieldProps('totalClients')
                                                  .value
                                    }
                                    disabled={
                                        values.maximumClient == 'Unlimited'
                                    }
                                    error={Boolean(
                                        touched.totalClients &&
                                            errors.totalClients
                                    )}
                                    inputProps={{
                                        sx: {
                                            textAlign: 'center',
                                        },
                                    }}
                                    helperText={
                                        touched.totalClients &&
                                        errors.totalClients
                                    }
                                />
                            </Box>{' '}
                        </BoxStyle>

                        <BoxStyle display={'flex'} alignItems={'center'}>
                            <Box width="50%">
                                <Box
                                    display="flex"
                                    alignItems={'center'}
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Payment model
                                    </Typography>{' '}
                                </Box>
                                <SubscriptionTypePopover
                                    selectedSubscriptionType={
                                        values.PaymentType
                                    }
                                    setSubscriptionType={handleSubscriptionType}
                                ></SubscriptionTypePopover>
                            </Box>
                            &nbsp;&nbsp;
                            <Box width="50%">
                                <Box
                                    display="flex"
                                    alignItems={'center'}
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography
                                        variant="h6"
                                        color={
                                            values.PaymentType == 'Free'
                                                ? 'grey.400'
                                                : 'text.primary'
                                        }
                                    >
                                        Price
                                    </Typography>{' '}
                                </Box>

                                {
                                    <MaskedInput
                                        prefix={'$'}
                                        fullWidth
                                        {...getFieldProps('price')}
                                        value={
                                            values.PaymentType == 'Free'
                                                ? '0'
                                                : getFieldProps('price').value
                                        }
                                        disabled={values.PaymentType == 'Free'}
                                        error={Boolean(
                                            touched.price && errors.price
                                        )}
                                        helperText={
                                            touched.price && errors.price
                                        }
                                        inputProps={{
                                            sx: {
                                                textAlign: 'center',
                                            },
                                        }}
                                        InputProps={{
                                            sx: {
                                                textAlign: 'center',
                                            },
                                            startAdornment: (
                                                <InputAdornment position="end">
                                                    <Iconify
                                                        icon={'uil:dollar-alt'}
                                                        color={'inherit'}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                }
                            </Box>{' '}
                        </BoxStyle>
                        <BoxStyle display={'flex'} alignItems={'center'}>
                            <Box width="50%">
                                <Box
                                    display="flex"
                                    alignItems={'center'}
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Program type
                                    </Typography>{' '}
                                </Box>
                                <ProgramTypePopover
                                    selectedProgramType={
                                        values.ProgramType
                                    }
                                    setProgramType={handleProgramType}
                                ></ProgramTypePopover>
                            </Box>
              
                        </BoxStyle> */}
            <ProgramDescriptionModal
              headerTitle="Create program"
              headerSubTitle="About"
              fullWidth
              placeholder="Write about your progam...."
              clabel="Program description"
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
              multiline
              minRows={6}
              inputProps={{
                maxLength: 1000,
              }}
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{ height: '100%', pt: 4 }}
                >
                  <Box
                    position={'absolute'}
                    bottom={12}
                    right={16}
                    height={'100%'}
                    display={'flex'}
                    flexDirection="column"
                    justifyContent={'flex-end'}
                    // marginTop={10}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {(formik.values.description + '').length + '/1000'}
                    </Typography>
                  </Box>
                </InputAdornment>
              }
              // InputProps={{

              // }}
            >
              <LabeledInput
                fullWidth
                placeholder="Write about your progam.... "
                clabel="About"
                {...getFieldProps('description')}
                error={Boolean(touched.description && errors.description)}
                helperText={
                  (touched.description && errors.description) ||
                  'Describe your program for athletes so they know what to expect'
                }
                multiline
                minRows={8}
                inputProps={{
                  maxLength: 1000,
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{ height: '100%', pt: 2 }}
                    >
                      <Box
                        position={'absolute'}
                        bottom={12}
                        right={16}
                        height={'100%'}
                        display={'flex'}
                        flexDirection="column"
                        justifyContent={'flex-end'}
                        // marginTop={10}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {(formik.values.description + '').length + '/1000'}
                        </Typography>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </ProgramDescriptionModal>
          </Stack>{' '}
        </Form>
      </FormikProvider>
    </Content>
  );
});
