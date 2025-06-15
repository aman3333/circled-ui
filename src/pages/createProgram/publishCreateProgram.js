// @mui
import { styled } from '@mui/material/styles'
import { useEffect, useState, forwardRef } from 'react'
// components
import Page from '../../components/Page'
// sections
import {
    Box,
    Button,
    Typography,
    Stack,
    Avatar,
    ButtonBase,
    InputAdornment,
    ListItemButton,
    IconButton,
    Divider,
    Alert,
    Badge,
} from '@mui/material'
import Image from 'src/components/Image'
import Input from 'src/components/Labs/Cropper'
import { handleuploadImage } from 'src/utils/uploader'
import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch, useSelector } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import LinearProgress from '@mui/material/LinearProgress'
import Iconify from '../../components/Iconify'
import ImageFill from 'src/assets/createProgram/ImageFill'
import LabeledInput from '../../components/core/LabeledInput'
import FooterBase from '../../components/Layout/Footer'
import Progress from 'src/components/progress'
import Dialog from '@mui/material/Dialog'
import { IconButtonAnimate } from 'src/components/animate'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import Footer from 'src/components/onboarding/footer'
import axios from 'axios'
import api from 'src/utils/api'
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader'
import WorkoutWeek from 'src/components/instructor/workoutWeek'
import Label from 'src/components/Label'
import SendProgramEmails from 'src/components/instructor/sendProgramEmails'
import SubscriptionTypePopover from 'src/components/instructor/subscriptionTypePopover'
import { computePath } from 'src/utils/routepath'
import { checkIsDraft ,getEmptyWeekNumber} from 'src/utils/getProgramStatus'
import { createProgram, saveProgram } from 'src/redux/actions/createProgram'
import UpdateProgramForm from 'src/components/instructor/updateProgramForm'
import { useOutletContext } from 'react-router-dom'
import moment from 'moment'
import { Grid } from '@mui/material'
import ProgramTypePopover from 'src/components/instructor/ProgramTypePopover'
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal'
import Icon_AddProgramImg from 'src/assets/createProgram/Icon_AddProgram2'
import TextMaxLine from 'src/components/TextMaxLine'
import { useConfirmationModalContext } from 'src/utils/Modal'
import ReactReadMoreReadLess from 'react-read-more-read-less'
import Lottie from "lottie-react";
import animationData from "src/assets/lottie/lf30_editor_iaocbu1z.json";

const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    height: '100%',
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
}))

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    padding: '20px 10px',
    maxWidth: 'xs',
    zIndex: 100,
    borderRadius: '0px 0px 8px 8px',
}))

// ----------------------------------------------------------------------

export default forwardRef((props, ref) => {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const { showConfirmationModal } = useConfirmationModalContext()
    const { search } = useLocation()
   const {handleBack} = props
    const query = new URLSearchParams(search)
    const [Program, updateProgram, mode] = useOutletContext()
   const [successModal,setSuccessModal]=useState(false)
    const navigate = useNavigate()
 
    const handelNext = () => {
        // navigate("/");

        setFieldValue(
            'SendTo',
            values.SendTo.filter((i) => i)
        )

        handleSubmit()
    }
 

    const RegisterSchema = Yup.object().shape({
        message: Yup.string(),
        SendTo: Yup.array().of(Yup.string().email()),
    })

    const [filePicked, setFilePicked] = useState(null)
    const formik = useFormik({
        initialValues: {
            price: Program.Price,
            BannerImage: Program.BannerImage,
            title: Program.Title,
            description: Program.Description,
            ProgramType:Program.ProgramType||"Public",
            message: '',
            // BannerImage: Program.BannerImage,
            PaymentType: Program.PaymentType || 'Free',
            SendTo: Program.SendTo.length
                ? Program.SendTo.map((i) => i.toLowerCase())
                : [''],
        },
        validationSchema: RegisterSchema,
        // validateOnBlur: true,
        // validateOnChange: false,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            // dispatch(
            //   updateProgram({
            //     Price: values.price,
            //     BannerImage: values.BannerImage,
            //     Title: values.title,
            //     Description: values.description,
            //     PaymentType: values.PaymentType,

            //   })
            // );

            if (mode == 'create') {
                if (
                    formik.values.message &&
                    !formik.values.SendTo.filter((i) => i).length
                ) {
                    showConfirmationModal(
                        '',
                        `You wrote a message but did not include 
            the client's email addresses.
            `,
                        'Add email',
                        'Skip and publish'
                    ).then((res) => {
                        if (res) {
                            document.getElementById('addmore').click()
                        } else {
                            if (checkIsDraft(Program)) {
                                showConfirmationModal(
                                    'Save as draft?',
                                    `Your week ${getEmptyWeekNumber(Program)} is currently empty. Please add at least one workout or delete the week to proceed with publishing the program`,
                                    'Continue',
                                    'Save as draft'
                                ).then((res) => {
                                    if (!res) {
                                        dispatch(
                                            updateFeedback({
                                                loading: true,
                                                sAnimate: false,
                                                message:
                                                    'Program created successfully',
                                                severity: 'success',
                                            })
                                        )
                                        dispatch(
                                            saveProgram({
                                                ...Program,
                                                Price: values.price,
                                                BannerImage: values.BannerImage,
                                                Title: values.title,
                                                Description: values.description,
                                                PaymentType: values.PaymentType,
                                                SendTo: checkIsDraft(Program)
                                                    ? []
                                                    : values.SendTo.map((i) =>
                                                          i.toLowerCase()
                                                      ),
                                                IsDraft: checkIsDraft(Program),
                                                IsPublished:
                                                    !checkIsDraft(Program),
                                                Price: values.price,
                                                BannerImage: values.BannerImage,
                                                Title: values.title,
                                                Description: values.description,
                                                PaymentType: values.PaymentType,
                                                GreetingMessage: values.message,
                                            })
                                        ).then((program) => {
                                            if (checkIsDraft(Program))
                                                dispatch(
                                                    updateFeedback({
                                                        loading: false,
                                                        sAnimate: true,
                                                        snackbar: false,
                                                        message:
                                                            'Program saved as draft',
                                                        severity: 'success',
                                                    })
                                                )
                                            else {
                                                dispatch(
                                                    updateFeedback({
                                                        loading: false,
                                                        sAnimate: true,
                                                        snackbar: false,
                                                        message:
                                                            'Program created successfully',
                                                        severity: 'success',
                                                    })
                                                )
                                            }

                                            navigate('/instructor')
                                        })
                                    } else {
                                        handleBack()
                                    }
                                })
                            } else {
                                dispatch(
                                    updateFeedback({
                                        loading: true,
                                        sAnimate: false,
                                        message: 'Program created successfully',
                                        severity: 'success',
                                    })
                                )
                                dispatch(
                                    saveProgram({
                                        ...Program,
                                        Price: values.price,
                                        BannerImage: values.BannerImage,
                                        Title: values.title,
                                        Description: values.description,
                                        PaymentType: values.PaymentType,
                                        SendTo: checkIsDraft(Program)
                                            ? []
                                            : values.SendTo.map((i) =>
                                                  i.toLowerCase()
                                              ),
                                        IsDraft: checkIsDraft(Program),
                                        IsPublished: !checkIsDraft(Program),
                                        Price: values.price,
                                        BannerImage: values.BannerImage,
                                        Title: values.title,
                                        Description: values.description,
                                        PaymentType: values.PaymentType,
                                        GreetingMessage: values.message,
                                    })
                                ).then((program) => {
                                    
                                    setSuccessModal(true)
                                    // if (checkIsDraft(Program))
                                    //     dispatch(
                                    //         updateFeedback({
                                    //             loading: false,
                                    //             sAnimate: true,
                                    //             snackbar: false,
                                    //             message:
                                    //                 'Program saved as draft',
                                    //             severity: 'success',
                                    //         })
                                    //     )
                                    // else {
                                    //     dispatch(
                                    //         updateFeedback({
                                    //             loading: false,
                                    //             sAnimate: true,
                                    //             snackbar: false,
                                    //             message:
                                    //                 'Program created successfully',
                                    //             severity: 'success',
                                    //         })
                                    //     )
                                    // }



                                   // navigate('/instructor')
                                })
                            }
                        }
                    })
                } else {
                    if (checkIsDraft(Program)) {
                        showConfirmationModal(
                            'Save as draft?',
                            `Your week ${getEmptyWeekNumber(Program)} is currently empty. Please add at least one workout or delete the week to proceed with publishing the program`,
                            'Continue',
                            'Save as draft'
                        ).then((res) => {
                            if (!res) {
                                dispatch(
                                    updateFeedback({
                                        loading: true,
                                        sAnimate: false,
                                        message: 'Program created successfully',
                                        severity: 'success',
                                    })
                                )
                                dispatch(
                                    saveProgram({
                                        ...Program,
                                        Price: values.price,
                                        BannerImage: values.BannerImage,
                                        Title: values.title,
                                        Description: values.description,
                                        PaymentType: values.PaymentType,
                                        SendTo: checkIsDraft(Program)
                                            ? []
                                            : values.SendTo.map((i) =>
                                                  i.toLowerCase()
                                              ),
                                        IsDraft: checkIsDraft(Program),
                                        IsPublished: !checkIsDraft(Program),
                                        Price: values.price,
                                        BannerImage: values.BannerImage,
                                        Title: values.title,
                                        Description: values.description,
                                        PaymentType: values.PaymentType,
                                        GreetingMessage: values.message,
                                    })
                                ).then((program) => {
                                    if (checkIsDraft(Program))
                                        dispatch(
                                            updateFeedback({
                                                loading: false,
                                                sAnimate: true,
                                                snackbar: false,
                                                message:
                                                    'Program saved as draft',
                                                severity: 'success',
                                            })
                                        )
                                    else {
                                        dispatch(
                                            updateFeedback({
                                                loading: false,
                                                sAnimate: true,
                                                snackbar: false,
                                                message:
                                                    'Program created successfully',
                                                severity: 'success',
                                            })
                                        )
                                    }

                                    navigate('/instructor')
                                })
                            } else {
                                handleBack()
                            }
                        })
                    } else {
                        dispatch(
                            updateFeedback({
                                loading: true,
                                sAnimate: false,
                                message: 'Program created successfully',
                                severity: 'success',
                            })
                        )
                        dispatch(
                            saveProgram({
                                ...Program,
                                Price: values.price,
                                BannerImage: values.BannerImage,
                                Title: values.title,
                                Description: values.description,
                                PaymentType: values.PaymentType,
                                SendTo: checkIsDraft(Program)
                                    ? []
                                    : values.SendTo.map((i) => i.toLowerCase()),
                                IsDraft: checkIsDraft(Program),
                                IsPublished: !checkIsDraft(Program),
                                Price: values.price,
                                BannerImage: values.BannerImage,
                                Title: values.title,
                                Description: values.description,
                                PaymentType: values.PaymentType,
                                GreetingMessage: values.message,
                            })
                        ).then((program) => {
                            if (checkIsDraft(Program))
                               { dispatch(
                                    updateFeedback({
                                        loading: false,
                                        sAnimate: true,
                                        snackbar: false,
                                        message: 'Program saved as draft',
                                        severity: 'success',
                                    })
                                )
                                navigate('/instructor')
                            }
                            else {
                               
                                setSuccessModal(true)
                            }

                         
                        })
                    }
                }
            }

            if (mode == 'edit') {
                dispatch(
                    updateProgram({
                        Price: values.price,
                        BannerImage: values.BannerImage,
                        Title: values.title,
                        Description: values.description,
                        PaymentType: values.PaymentType,
                        SendTo: checkIsDraft(Program)
                            ? []
                            : values.SendTo.map((i) => i.toLowerCase()),
                    })
                ).then((program) => {
                    navigate('/instructor')
                })

                //   dispatch(saveProgram({
                //     ...Program,
                // IsDraft:false,
                //     SendTo: [],
                //   }))
                //       .then((program) => {
                //        dispatch(updateFeedback({
                //           loading: false,
                //           sAnimate: true,
                //           message: "Program created succesfully",
                //           severity: "success",
                //         }));

                //       });
            }
        },
    })
    const {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        validateForm,
        values,
    } = formik

    useEffect(() => {
        if (!Program.Title) setFieldValue('title', null)
        if (!Program.Description) setFieldValue('description', null)
        if (!Program.BannerImage) setFieldValue('BannerImage', null)

        setFieldValue('title', Program.Title)

        setFieldValue('description', Program.Description)

        setFieldValue('BannerImage', Program.BannerImage)
        setFieldValue('price', Program.Price)
        setFieldValue('PaymentType', Program.PaymentType || 'Subscription')
    }, [Program])

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
        }
    }, [])
    const handleProgramType=(val)=>{
        setFieldValue('ProgramType', val)
       
    }
    return (
        <Content
            withoutPadding
            style={{ paddingBottom: 24, overflowY: 'auto' }}
        >
            <FormikProvider value={formik} validateOnBlur>
                <Form
                    autoComplete="off"
                    noValidate
                    onSubmit={handleSubmit}
                    validateOnBlur
                >
                    <Input
                        hidden
                        accept="image/*"
                        type="file"
                        id="bannerImage"
                        onChange={(e) => {
                            dispatch(updateFeedback({ loading: true }))
                            handleuploadImage(e).then((res) => {
                                setFieldValue('BannerImage', res.data.Location)
                                dispatch(updateFeedback({ loading: false }))
                            })
                        }}
                        cropShape={'rect'}
                        aspect={1.5}
                    />
                    <Box
                        position="relative"
                        width="100%"
                        height={values.BannerImage ? 'auto' : '248px'}
                        mt={-2}
                        borderRadius={1}
                        bgcolor={'#F5F7FA'}
                    >
                        {values.BannerImage && (
                            <img
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    backgroundColor: '#fff',
                                }}
                                onClick={(e) => {
                                    document
                                        ?.getElementById('bannerImage')
                                        ?.click()
                                }}
                                src={values.BannerImage}
                            />
                        )}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '0px',
                                right: '0px',
                                width: '100%',
                                height: '100%',
                                backgroundColor: values.BannerImage
                                    ? 'rgba(0,0,0,0.1)'
                                    : '#F5F7FA',
                                zIndex: 10,
                                display: 'flex',
                                paddingTop: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                            // onClick={(e) => {
                            //   document?.getElementById("bannerImage")?.click();
                            // }}
                        >
                            <Badge
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                badgeContent={
                                    <IconButtonAnimate
                                        size={'small'}
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            padding: 0,
                                            border: '2px solid #fff',
                                        }}
                                        // onClick={(e) => {
                                        //   e.stopPropagation();
                                        //   document?.getElementById("bannerImage")?.click();
                                        // }}
                                    >
                                        <Iconify
                                            icon={'fluent:add-24-filled'}
                                            width={16}
                                            height={16}
                                            color="common.white"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                document
                                                    ?.getElementById(
                                                        'bannerImage'
                                                    )
                                                    ?.click()
                                            }}
                                        />
                                    </IconButtonAnimate>
                                }
                            >
                                <ImageFill
                                    icon={'bi:image-fill'}
                                    sx={{ fontSize: 36 }}
                                    color="#95A3B8"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        document
                                            ?.getElementById('bannerImage')
                                            ?.click()
                                    }}
                                />
                            </Badge>
                            {/* {Profile.banner && (
                <IconButtonAnimate
                  onClick={(e) => {
                    removeBanner();
                  }}
                  sx={{
                    backgroundColor: "red",
                    padding: 0,
                    border: "2px solid #fff",
                    ml: 3,
                  }}
                  onChange={uploadBannerImage}
                >
                  <Iconify
                    icon={"iconoir:cancel"}
                    width={24}
                    height={24}
                    color="common.white"
                  />
                </IconButtonAnimate>
              )} */}

                            <Typography sx={{ mt: 1 }} color="text.secondary">
                                Background
                            </Typography>
                        </Box>
                    </Box>
                    <Box px={2}>
                        <Stack spacing={2}>
                            {checkIsDraft(Program) && (
                                <Alert
                                    alignItems={'center'}
                                    sx={{ color: 'text.primary', mt: 2 }}
                                    severity="info"
                                >
                                    You must have exercise in every week to
                                    publish your program.
                                </Alert>
                            )}
                            {/* <Box width={"50%"} mb={1}>
              <Avatar
                variant="rounded"
                style={{
                  borderRadius: 12,
                  width: "130px",
                  height: "112px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  border: "1px solid #E1E7F0",
                  boxShadow: values.BannerImage && "0px 0px 7px #cccccc",
                }}
              >
                {values.BannerImage ? (
                  <img
                    src={values.BannerImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Icon_AddProgramImg
                    sx={{ width: "130px", height: "112px" }}
                  />
                )}
              </Avatar>
            </Box> */}

                            <Box  pt={2}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    Program title
                                </Typography>
                                <Typography
                                    mt={0.5}
                                    variant="body1"
                                    color="textPrimary"
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    {Program.Title}
                                </Typography>
                            </Box>

                            <Box >
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    Description
                                </Typography>
                                <ReactReadMoreReadLess
                                    charLimit={120}
                                    readMoreText={'more'}
                                    readLessText={'less'}
                                    readMoreStyle={{
                                        fontWeight: 'bold',
                                        color: '#2B4057',
                                        marginLeft: 6,
                                    }}
                                    readLessStyle={{
                                        fontWeight: 'bold',
                                        color: '#2B4057',
                                        marginLeft: 6,
                                    }}
                                >
                                    {Program.Description ||
                                        'No description provided'}
                                </ReactReadMoreReadLess>
                            </Box>
<Divider/>
                            <Grid container sx={{ px: 1 }}>
                                {/* <Grid item xs={6}>
                                    <Stack mb={2}>
                                        <Typography
                                            variant="body1"
                                            color="textPrimary"
                                            fontWeight={600}
                                        >
                                            Program Type:&nbsp;
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            color="textPrimary"
                                        >
                                            {Program.Type}
                                        </Typography>
                                    </Stack>
                                </Grid> */}

                                {/* <Grid item xs={6}>
                                    <Stack>
                                        <Typography
                                            variant="body1"
                                            fontWeight={600}
                                        >
                                            Price:&nbsp;
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            ${Program.Price}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack>
                                        <Typography
                                            variant="body1"
                                            fontWeight={600}
                                        >
                                            Pricing Model:&nbsp;
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            color="text.primary"
                                        >
                                            {Program.PaymentType}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack mb={2} pt={1.5}>
                                        <Typography
                                            variant="body1"
                                            color="textPrimary"
                                            fontWeight={600}
                                        >
                                            Date Created:&nbsp;
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            color="textPrimary"
                                        >
                                        
                                            {moment(Program.createdAt).format(
                                                'yyyy/MM/DD'
                                            )}
                                        </Typography>
                                    </Stack>
                                </Grid> */}
                            </Grid>
                        </Stack>
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
                        {/* <Box marginTop={2}>
                            <ButtonBase>
                            
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                    sx={{ fontWeight: 600, display: 'flex' }}
                                >
                                    Send to &nbsp;
                                    <Typography color="text.secondary">
                                        optional
                                    </Typography>
                                </Typography>
                            </ButtonBase>
                            <SendProgramEmails
                                allRecievers={values.SendTo}
                                setAllRecievers={(arr) =>
                                    setFieldValue('SendTo', arr)
                                }
                                errors={errors.SendTo}
                                errorObj={{}}
                                modal
                                setErrorObj={() => console.log('')}
                            />
                        </Box> */}
                        {/* <Box my={3}>
                            <ProgramDescriptionModal
                                headerTitle="Create Program"
                                headerSubTitle="Message"
                                fullWidth
                                clabel={
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                        sx={{
                                            fontWeight: 600,
                                            display: 'flex',
                                        }}
                                    >
                                        Message &nbsp;
                                        <Typography color="text.secondary">
                                            optional
                                        </Typography>
                                    </Typography>
                                }
                                {...getFieldProps('message')}
                                placeholder="Write a message here"
                                error={Boolean(
                                    touched.message && errors.message
                                )}
                                helperText={touched.message && errors.message||"People who receive the program will see the message on their email."}
                                multiline
                                minRows={4}
                            >
                                <LabeledInput
                                    fullWidth
                                    clabel={
                                        <Typography
                                            variant="subtitle1"
                                            color="text.primary"
                                            sx={{
                                                fontWeight: 600,
                                                display: 'flex',
                                            }}
                                        >
                                            Message &nbsp;
                                            <Typography color="text.secondary">
                                                optional
                                            </Typography>
                                        </Typography>
                                    }
                                    {...getFieldProps('message')}
                                    placeholder="Write a message here"
                                    error={Boolean(
                                        touched.message && errors.message
                                    )}
                                    helperText={
                                        touched.message && errors.message||"People who receive the program will see the message on their email."
                                    }
                                    multiline
                                    minRows={4}
                                />
                            </ProgramDescriptionModal>
                        </Box> */}
                    </Box>
                </Form>
            </FormikProvider>
            <SuccessDialog programId={Program._id} dispatch={dispatch} navigate={navigate} open={successModal}/>
            {/* <SendProgramEmails /> */}
        </Content>
        // <FooterBase>
        //   <Footer
        //     confirm
        //     next
        //     back
        //     nextText={mode == "edit" ? "Save" : "Publish"}
        //     nextClick={handelNext}
        //     backClick={handleBack}
        //   />
        // </FooterBase>
    )
})





const SuccessDialog=({programId,dispatch, navigate,open})=>{
    const [openDialog,setOpenDialog]=useState(open)

    useEffect(()=>{
        setOpenDialog(open)
    },[open])

const onShare=()=>{

        if (navigator.share) {
            navigator
                .share({
                    title: ` shared a fitness program :`,
                    url: `/public/workout-program/${programId}`,
                })
                
        }
    
}
const onCopyLink=()=>{
 navigator.clipboard.writeText(`${window.location.origin}/public/workout-program/${programId}`)
 dispatch(updateFeedback({ snackbar: true, message: 'Copied to clipboard' }))
}
const onDone=()=>{
    navigate(`/`)
    setOpenDialog(false)

}

    return(
       <Dialog
       open={openDialog}
       fullWidth
       fullScreen
       onClose={()=>setOpenDialog(false)}
       >
        <Stack spacing={2} px={3} alignItems="center" justifyContent="center" height="100%">
                {openDialog && <Lottie
                autoplay
                animationData={
                  animationData
                }
                loop={true}
                height={100}
                width={100}
              />}
           
            
            <Typography variant="h3" align="center" color="text.primary">
                Program created successfully
            </Typography>
            <Typography variant="body1" align="center" color="text.primary">
                Your program has been created successfully. You can now share it with your clients.
            </Typography>
            <Button fullWidth variant="contained"  color="primary" onClick={onShare}>
            <Iconify icon="mdi:share" width={32} height={32}/>  &nbsp;  Share
            </Button>
            <Button fullWidth variant='outlined' color='primary' onClick={onCopyLink}>
            <Iconify icon="mdi:link" width={32} height={32}/>  &nbsp;  Copy link
            </Button>
            <Button fullWidth variant="outlined" color="primary" onClick={onDone}>
                Done
            </Button>
        </Stack>
       </Dialog>

    )
}