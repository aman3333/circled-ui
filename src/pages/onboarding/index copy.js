// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../../components/Page'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
// sections
import { Box, Typography, Stack, Button, Divider } from '@mui/material'
import axios from '../../utils/axios'
import api from '../../utils/api'
import Footer from '../../components/onboarding/footer'
import { useNavigate, useLocation } from 'react-router'
import TextField from '../../components/core/LabeledInput'
import PasswordField from '../../components/core/PasswordInput'
// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import Container from '../../components/Layout/Container'
import FooterBase from '../../components/Layout/Footer'
import Content from '../../components/Layout/Content'
import HeaderBase from '../../components/Layout/Header'
import GoogleLogin from 'react-google-login'
import Iconify from '../../components/Iconify'
import { initProfile } from 'src/redux/actions/Profile'
import { useConfirmationModalContext } from '../../utils/Modal'
const RootStyle = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
    height: '100vh',
}))

const BoxStyle = styled(Box)(() => ({
    position: 'relative',
}))

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
}))
const SocialButton = styled(Button)(({ theme }) => ({
    height: 52,
    alignItems: 'center',
    borderRadius: 40,
    background: '#fff',
    border: '1.5px solid #C3CBD9',
    borderColor: '#C3CBD9',
    boxShadow: '0px 4px 4px rgba(43, 64, 87, 0.1)',
    fontFamily: 'Proxima Nova',
    paddingLeft: '12px',
    /* Dark primary / 50% */
    color: '#172A44',
    fontSize: 16,
    fontWeight: 'bold',

    marginBottom: 8,
    border: '1.5px solid ',
}))

// ----------------------------------------------------------------------

export default function HomePage({ mode }) {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

    const RegisterSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email must be a valid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')

            .matches(
                rePass,
                'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number'
            ),

        confirmPass: Yup.string()
            .required('confirm password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    })

    const formik = useFormik({
        initialValues: {
            email: state?.email || '',
            password: '',
            confirmPass: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            setSubmitting(true)
            dispatch(
                updateFeedback({
                    loading: true,
                })
            )

            if (!state?.email)
                axios
                    .post(
                        `${api.protocol}${api.baseUrl}${api.SendVerifyMail}`,
                        {
                            email: values.email,
                        }
                    )
                    .then((response) => {
                        dispatch(
                            updateOnboarding({
                                authType: '1',
                                email: values.email,
                                password: values.password,
                            })
                        )

                        {
                            !state?.email &&
                                dispatch(
                                    updateFeedback({
                                        loading: false,
                                        snackbar: true,
                                        message:
                                            'Verification mail sent to your email!',
                                        severity: 'success',
                                    })
                                )
                        }
                        navigate(
                            `/onboarding/${mode == 'client' ? 'client/' : ''}${
                                state?.email ? 'info' : 'verification'
                            }`,
                            { state }
                        )
                    })
                    .catch((error) => {
                        if (error.response.status === 406)
                            return dispatch(
                                updateFeedback({
                                    loading: false,
                                    snackbar: true,
                                    message:
                                        'Acccount with give email address already exists!',
                                    severity: 'error',
                                })
                            )
                        else
                            return dispatch(
                                updateFeedback({
                                    loading: false,
                                    snackbar: true,
                                    message:
                                        'Oops caught some error! Please try again',
                                    severity: 'error',
                                })
                            )
                    })
            else {
                dispatch(
                    updateFeedback({
                        loading: false,
                    })
                )
                dispatch(
                    updateOnboarding({
                        authType: 1,
                        email: values.email,
                        password: values.password,
                        token: state?.token,
                    })
                )
                navigate(
                    `/onboarding/${mode == 'client' ? 'client/' : ''}${
                        state?.email ? 'info' : 'verification'
                    }`,
                    { state }
                )
            }
        },
    })
    const modalContext = useConfirmationModalContext()
    const responseGoogleSignIn = (res) => {
        dispatch(
            updateFeedback({
                loading: true,
            })
        )
        axios
            .post(`${api.protocol}${api.baseUrl}${api.userLogin}`, {
                email: res?.profileObj.email,
                authType: 'gmail',
                phone: '',
            })
            .then((response) => {
                dispatch(
                    updateFeedback({
                        loading: false,
                        snackbar: true,
                        message: 'Login successfuly',
                        severity: 'success',
                    })
                )
                let {
                    _id,
                    category,
                    name,
                    bio,
                    type,
                    DOB,
                    privatePlan,
                    profilePic,
                    location,
                    links,
                    email,
                    phone,
                } = response.data.userData
                // if (props.location.state && props.location.state.return) {
                //   setTimeout(() => {
                //     props.history.push(props.location.state.return);
                //     console.log(props.location.state.return);
                //   }, 1000);
                // }

                axios.defaults.headers.common['Authorization'] =
                    response.data.token
                localStorage.setItem('token', response.data.token)

                dispatch(
                    initProfile({
                        _id,
                        category,
                        name,
                        bio,
                        type,
                        authType: 'gmail',
                        DOB,
                        privatePlan,
                        profilePic,
                        location,
                        links,
                        email,
                        token: response.data.token,
                        phone,
                        password: '',
                        ...response.data.userData,
                    })
                )
                if (state.redirect) {
                    navigate(state.redirect)
                }
                // else
                // props.history.push(
                //   response.data.userData == "Athlete" ? "/athlete" : "/instructor"
                // );
            })
            .catch((error) => {
                if (error.response && error.response.status === 404)
                    return dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message:
                                "User with provided email or phone doesn't exist",
                            severity: 'error',
                        })
                    )
                if (error.response && error.response.status === 409)
                    return dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message: 'Invalid Password',
                            severity: 'error',
                        })
                    )
                if (error.response && error.response.status === 408) {
                    dispatch(
                        updateFeedback({
                            loading: false,
                        })
                    )
                    modalContext
                        .showConfirmationModal(
                            'Alert!',
                            'This email is already registered with other auth provide , would you like to link gmail with this account?',
                            'Yes',
                            'No'
                        )
                        .then((result) => {
                            if (result) {
                                dispatch(
                                    updateFeedback({
                                        loading: true,
                                    })
                                )
                                axios
                                    .patch(
                                        `${api.protocol}${api.baseUrl}${api.updateAuth}`,
                                        {
                                            email: res?.profileObj.email,
                                            authType: 'gmail',
                                        }
                                    )
                                    .then((response) => {
                                        dispatch(
                                            updateFeedback({
                                                loading: false,
                                                snackbar: true,
                                                message:
                                                    'Account linked with gmail , login to continue',
                                                severity: 'success',
                                            })
                                        )
                                    })
                            }
                        })
                }
            })
    }
    const responseGoogle = (res) => {
        dispatch(
            updateFeedback({
                loading: true,
            })
        )
        axios
            .get(
                `${api.protocol}${api.baseUrl}${api.checkUserExistence}email=${res?.profileObj.email}`
            )
            .then((response) => {
                dispatch(
                    updateFeedback({
                        loading: false,
                    })
                )
                if (response.data.authType.includes('gmail')) {
                    responseGoogleSignIn(res)
                } else {
                    modalContext
                        .showConfirmationModal(
                            'Alert!',
                            'This email is already registered with other auth provide , would you like to link gmail with this account?',
                            'Yes',
                            'No'
                        )
                        .then((result) => {
                            if (result) {
                                dispatch(
                                    updateFeedback({
                                        loading: true,
                                    })
                                )
                                axios
                                    .patch(
                                        `${api.protocol}${api.baseUrl}${api.updateAuth}`,
                                        {
                                            email: response.data.email,
                                            authType: 'gmail',
                                        }
                                    )
                                    .then((response) => {
                                        updateFeedback({
                                            loading: false,
                                            snackbar: true,
                                            message:
                                                'Account linked with gmail , login to continue',
                                            severity: 'success',
                                        })
                                    })
                            } else {
                            }
                        })
                }
            })
            .catch((error) => {
                dispatch(
                    updateFeedback({
                        loading: false,
                    })
                )
                if (error.response.status === 404) {
                    dispatch(
                        updateOnboarding({
                            name: res?.profileObj.name,
                            email: res?.profileObj.email,
                            profilePic: res?.profileObj.imageUrl,
                            token: res.tokenId,
                            authType: 'gmail',
                        })
                    )
                    navigate(
                        `/onboarding/${
                            mode == 'client' ? 'client/info' : 'preview'
                        }`
                    )
                }
            })
    }

    const navigate = useNavigate()
    const {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        values,
    } = formik
    return (
        <Page title=" Simplified Online Fitness Training ">
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Container>
                        <HeaderBase>
                            {' '}
                            <Header
                                title={'Create account'}
                                onClose={() => navigate('/', { state })}
                            />
                        </HeaderBase>
                        <Content>
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                alignItems={'center'}
                                flexGrow={'1'}
                            >
                                <Typography
                                    align="center"
                                    component={'span'}
                                    sx={{ my: 4 }}
                                >
                                    Already have an account?&nbsp;&nbsp;
                                    <Typography
                                        color={'primary.main'}
                                        component={'span'}
                                        sx={{ fontWeight: 'bold' }}
                                        onClick={() => navigate('/login')}
                                    >
                                        Log in
                                    </Typography>
                                </Typography>
                                <Stack spacing={2} sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        disabled={state?.email}
                                        placeholder=""
                                        clabel={
                                            <Typography variant="subtitle1">
                                                Your email address
                                            </Typography>
                                        }
                                        {...getFieldProps('email')}
                                        error={Boolean(
                                            touched.email && errors.email
                                        )}
                                        helperText={
                                            touched.email && errors.email
                                        }
                                    />
                                    <PasswordField
                                        clabel={
                                            <Typography variant="subtitle1">
                                                Password
                                            </Typography>
                                        }
                                        fullWidth
                                        placeholder=""
                                        {...getFieldProps('password')}
                                        error={Boolean(
                                            touched.password && errors.password
                                        )}
                                        helperText={
                                            touched.password && errors.password
                                        }
                                    />
                                    <PasswordField
                                        clabel={
                                            <Typography variant="subtitle1">
                                                Confirm Password
                                            </Typography>
                                        }
                                        fullWidth
                                        placeholder=""
                                        {...getFieldProps('confirmPass')}
                                        error={Boolean(
                                            touched.confirmPass &&
                                                errors.confirmPass
                                        )}
                                        helperText={
                                            touched.confirmPass &&
                                            errors.confirmPass
                                        }
                                    />
                                </Stack>
                                <Box width={'100%'} my={2}>
                                    {' '}
                                    <Divider>
                                        <Typography
                                            color={'text.secondary'}
                                            sx={{ px: 1 }}
                                        >
                                            OR
                                        </Typography>
                                    </Divider>
                                </Box>
                                <Box mt={1} mb={4} width={'100%'}>
                                    <GoogleLogin
                                        clientId="20299471486-m23pkgk770a4vq3dgjh8uc9k180cpc98.apps.googleusercontent.com"
                                        render={(renderProps) => (
                                            <SocialButton
                                                onClick={renderProps.onClick}
                                                disabled={renderProps.disabled}
                                                fullWidth
                                            >
                                                <Iconify
                                                    icon={
                                                        'flat-color-icons:google'
                                                    }
                                                    width={24}
                                                    height={24}
                                                />
                                                &nbsp;&nbsp;
                                                {/* <img src={GoogleIcon} style={{ marginRight: 8 }} /> */}
                                                <Typography
                                                    variant="h6"
                                                    color="text.primary"
                                                >
                                                    Continue with Google
                                                </Typography>
                                            </SocialButton>
                                        )}
                                        buttonText="Login"
                                        onSuccess={responseGoogle}
                                        onFailure={(res) => {
                                            console.log(res)
                                        }}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                </Box>
                            </Box>
                        </Content>
                        <FooterBase>
                            <Footer next />
                        </FooterBase>
                    </Container>
                </Form>
            </FormikProvider>
        </Page>
    )
}
