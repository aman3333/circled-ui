// @mui
import { styled } from '@mui/material/styles'
import { useState } from 'react'
// components
import Page from '../../components/Page'
// sections
import {
    Box,
    Button,
    Typography,
    Stack,
    Divider,
    Avatar,
    ButtonBase,
    IconButton,
    InputAdornment,
    Grid,
} from '@mui/material'
import Iconify from 'src/components/Iconify'

import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import Collapse from '@mui/material/Collapse'
import MyProfileHeader from 'src/components/client/profileHeader'
import HealthProfile from 'src/assets/IconSet/fitnessProfile/HealthProfile'
import CameraIcon from 'src/assets/IconSet/camera'
import BodyComposition from 'src/assets/IconSet/fitnessProfile/BodyComposition'
import PersonalDetailIcon from 'src/assets/IconSet/fitnessProfile/PersonalDetails'
import { LinearProgress } from '@mui/material'
import IconSups from 'src/assets/clientProfile/Icon_Sups_Client'
import { useSelector } from 'react-redux'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import moment from 'moment'
import BodyMetrix from 'src/components/client/BodyMetrix'
import PhotoWidget from 'src/components/client/UploadphotoWidget'
import { dispatch } from 'src/redux/store'
import { updateProfile } from 'src/redux/actions/Profile'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,
    backgroundColor: '#fff',
}))
// ----------------------------------------------------------------------

export default function MyProfilePage() {
    const [headerDependency, setHeaderDependency] = useState(false)
    const { search, state, pathname } = useLocation()
    const [mini, setMini] = useState(true)
    const [mini2, setMini2] = useState(true)
    const [view, setView] = useState('about')
    const query = new URLSearchParams(search)
    const Profile = useSelector((s) => s.Profile)
    const AtheletePlan = useSelector((s) => s.AtheletePlan)
    const navigate = useNavigate()
    const minimize = () => {
        setMini(!mini)
    }
    const minimize2 = () => {
        setMini2(!mini2)
    }
    const activityLevelOptions = {
        Light: 'Light: 1-3 times a week',
        Moderate: 'Moderate: 4-5 times a week',
        Active: 'Active: intense 4-5 times a week',
        'Very active': 'Very active: intense 6-7 times a week',
    }
    const handelNext = () => {
        navigate('/createDietPlan')
    }
    const handleBack = () => {
        if (query.get('stage') == 2) {
            return navigate('/createProgram')
        }
        navigate('/createProgram?stage=' + (Number(query.get('stage')) - 1))
    }
    let currentProgram = AtheletePlan?.Exercises
    const currentday = AtheletePlan.currentDay
    const currentweek = AtheletePlan.currentWeek

    console.log(currentProgram, currentday, currentweek)
    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Content
                        withoutPadding
                        style={{ backgroundColor: '#F5F7FA', paddingTop: 64 }}
                    >
                        <Header
                            style={{
                                borderRadius: '0px 0px 8px 8px',
                                boxShadow:
                                    '0px 4px 54px rgba(225, 231, 240, 0.5)',
                                overflow: 'hidden',
                            }}
                            position="fixed"
                        >
                            <BoxHeader px={2} py={2}>
                                <Box display={'flex'} alignItems={'center'}>
                                    {' '}
                                    <IconButton
                                        onClick={() => navigate(-1)}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                    >
                                        My Profile
                                    </Typography>{' '}
                                </Box>{' '}
                            </BoxHeader>
                        </Header>

                        <MyProfileHeader
                            Profile={Profile}
                            clientMyprofile
                            setHeaderDependency={setHeaderDependency}
                            view={state?.view || view}
                            setView={(val) => {
                                navigate(pathname, {
                                    state: { view: val },
                                    replace: true,
                                })
                                setView(val)
                            }}
                        />
                        {(state?.view || view) == 'about' ? (
                            <>
                            {/* <Box >
                                <BodyMetrix data={Profile.healthInfo} viewMode/>
                                </Box> */}
                            <Box mt={1}>
                                <Box px={3} bgcolor={'#fff'} py={3}>
                                <Typography
                                variant="h5"
                                color="text.primary"
                                gutterBottom
                                display={"flex"}
                                alignItems={"center"}
                                sx={{mb:2}}
                            >
                             Personal fitness
                            </Typography>
                                    <Typography
                                        color="text.primary"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Goals
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ mb: mini ? 0 : 2 }}
                                        color="text.secondary"
                                        flexWrap={'wrap'}
                                    >
                                        {Profile.goals}
                                    </Typography>
                                    <Collapse in={!mini}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography
                                                    color="text.primary"
                                                    mb={0.5}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Training experience{' '}
                                                </Typography>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="body1"
                                                >
                                                    {Profile.trainingExperience ||
                                                        'N/A'}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography
                                                    color="text.primary"
                                                    mb={0.5}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Years of training{' '}
                                                </Typography>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="body1"
                                                >
                                                    {Profile.YearsOfTraining
                                                        ? Profile.YearsOfTraining +
                                                          ' years'
                                                        : 'N/A'}
                                                </Typography>
                                            </Box>
                                            {/* <Box>
                                                <Typography
                                                    color="text.primary"
                                                    mb={0.5}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Favourite cardio{' '}
                                                </Typography>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="body1"
                                                >
                                                    {Profile.faviroteCardio ||
                                                        'N/A'}
                                                </Typography>
                                            </Box> */}
                                            <Box>
                                                <Typography
                                                    color="text.primary"
                                                    mb={0.5}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Activity level{' '}
                                                </Typography>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="body1"
                                                >
                                                    {activityLevelOptions?.[
                                                        Profile.activityLevel
                                                    ] || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Collapse>

                                    <Box
                                        display="flex"
                                       
                                    >
                                         <Box
                                        component={ButtonBase}
                                        onClick={minimize}
                                        display="flex"
                                       alignItems={'center'}
                                       mt={1}
                                       
                                    >
                                        {
                                            <Typography
                                                variant="h6"
                                                color={'text.primary'}
                                                sx={{ mb: -1 }}
                                            >
                                                {mini ? 'Show more' : 'Show less'}
                                            </Typography>
                                        }
                                        <Iconify
                                            sx={{ color: 'text.primary',mt:1 }}
                                            icon={
                                                mini
                                                    ? 'ic:round-keyboard-arrow-down'
                                                    : 'ic:round-keyboard-arrow-up'
                                            }
                                            width="34px"
                                            height="34px"
                                        />
                                      
                                    </Box>
                                    </Box>
                                </Box>
                              
                            </Box>
                            <Box mt={1}>
                            <Box px={3} bgcolor={'#fff'} py={3}>
                            <Typography
                                variant="h5"
                                color="text.primary"
                                gutterBottom
                                display={"flex"}
                                alignItems={"center"}
                                sx={{mb:2}}
                            >
                              Health profile
                            </Typography>
                            <Stack spacing={3} direction={"row"}>
                                <Box>
                                <Typography
                                    color="text.primary"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Height
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: mini2 ? 0 : 2 }}
                                    color="text.secondary"
                                    flexWrap={'wrap'}
                                >
                                    {Profile?.healthInfo?.height?.toFixed(2)||"N/A"} cm
                                </Typography>
                                </Box>
                                <Box>
                                <Typography
                                    color="text.primary"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Weight
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: mini2 ? 0 : 2 }}
                                    color="text.secondary"
                                    flexWrap={'wrap'}
                                >
                                    {Profile?.healthInfo?.weight?.toFixed(2)||"N/A"} kg
                                </Typography>
                                </Box>
                                </Stack>
                                <Collapse in={!mini2}>
                                    <Stack spacing={2}>
                                        <Box>
                                        <Typography
                                    color="text.primary"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Medical condition
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mb:0.5}}
                                    color="text.secondary"
                                    flexWrap={'wrap'}
                                >
                                    {Profile.healthInfo?.medicalCondition||"N/A"}
                                </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                color="text.primary"
                                                mb={0.5}
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                               Medications
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="body1"
                                            >
                                                {Profile.healthInfo.medications ||
                                                    'N/A'}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                color="text.primary"
                                                mb={0.5}
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                               Injuries
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="body1"
                                            >
                                               {Profile.healthInfo.injuries ||"N/A"}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                color="text.primary"
                                                mb={0.5}
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                               Family health history
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="body1"
                                            >
                                               {
                                                    Profile.healthInfo.history ||"N/A"
                                               }
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                color="text.primary"
                                                mb={0.5}
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                              Allergies and reactions
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="body1"
                                            >
                                               {
                                                    Profile.healthInfo.allergiesAndReactions ||"N/A"
                                               }
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                color="text.primary"
                                                mb={0.5}
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                Supplements
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="body1"
                                            >
                                               {
                                                    Profile.healthInfo.supplements ||"N/A"
                                               }
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                color="text.primary"
                                                mb={0.5}
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                             Other
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="body1"
                                            >
                                               {
                                                    Profile.healthInfo.medicalNotes ||"N/A"
                                               }
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Collapse>

                                <Box
                                    display="flex"
                                    
                                >
                                    <Box
                                        component={ButtonBase}
                                        onClick={minimize2}
                                        display="flex"
                                       alignItems={'center'}
                                       mt={1}
                                       
                                    >
                                        {
                                            <Typography
                                                variant="h6"
                                                color={'text.primary'}
                                                sx={{ mb: -1 }}
                                            >
                                                {mini2 ? 'Show more' : 'Show less'}
                                            </Typography>
                                        }
                                        <Iconify
                                            sx={{ color: 'text.primary',mt:1 }}
                                            icon={
                                                mini2
                                                    ? 'ic:round-keyboard-arrow-down'
                                                    : 'ic:round-keyboard-arrow-up'
                                            }
                                            width="34px"
                                            height="34px"
                                        />
                                      
                                    </Box>
                                </Box>
                            </Box>
                            {/* <Grid
                                container
                                spacing={2}
                                px={3}
                                mt={2}
                                pb={2}
                                sx={{ backgroundColor: '#fff', mt: 1 }}
                            >
                                <Grid item xs={12}>
                                    {' '}
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        My Health profile
                                    </Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Stack
                                        spacing={1}
                                        alignItems="center"
                                        onClick={() =>
                                            navigate('bodySystem')
                                        }
                                    >
                                        <IconBodySystem />
                                        <Typography
                                            color="text.primary"
                                            align="center"
                                            flexWrap={'wrap'}
                                        >
                                            Body System
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={4}>
                                    <Stack
                                        spacing={1}
                                        alignItems="center"
                                        onClick={() => navigate('photos')}
                                    >
                                        <IconPhotos />
                                        <Typography
                                            color="text.primary"
                                            align="center"
                                            flexWrap={'wrap'}
                                        >
                                            Photos
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid item xs={4}>
                                    <Stack
                                        spacing={1}
                                        alignItems="center"
                                        onClick={() => navigate('supps')}
                                    >
                                        <IconSups
                                            style={{
                                                fontSize: 48,
                                                marginBottom: '4px',
                                            }}
                                        />
                                        <Typography
                                            color="text.primary"
                                            align="center"
                                            flexWrap={'wrap'}
                                        >
                                            Supplements
                                        </Typography>
                                    </Stack>
                                </Grid>
                             
                            </Grid> */}
                        </Box>
                        <Box mt={1}>
                            <Box px={3} bgcolor={'#fff'} py={3}>
                            <Typography
                                variant="h5"
                                color="text.primary"
                                gutterBottom
                                display={"flex"}
                                alignItems={"center"}
                                sx={{mb:2}}
                            >
                             {/* <CameraIcon style={{marginRight:12}} mode="view"/>    */}
                             Body images
                            </Typography>
                                <PhotoWidget data={Profile.bodyImages} setData={d=>dispatch(updateProfile({
                                    bodyImages:d
                                }))}/>
                                </Box>
                        </Box>
                        </>
                        ) : null}

                        {currentProgram?._id &&
                            (state?.view || view) == 'program' && (
                                <Box backgroundColor={'#fff'} mt={1}>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '137px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundImage: `url(${
                                                currentProgram?.BannerImage ||
                                                '/images/instructor/programImage.png'
                                            })`,
                                        }}
                                        // style={{
                                        //   backgroundImage: `src(${
                                        //     Program?.BannerImage ||
                                        //     "/images/instructor/programImage.png"
                                        //   })`,
                                        // }}
                                    ></Box>
                                    <Stack
                                        direction="row"
                                        justifyContent={'space-between'}
                                        px={3}
                                        py={3}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 'bold',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {currentProgram?.Title}
                                        </Typography>

                                        <Typography
                                            onClick={() =>
                                                navigate(
                                                    '/client/myWorkoutCalendar'
                                                )
                                            }
                                            sx={{
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                            color={'primary.main'}
                                        >
                                            View{' '}
                                            <Iconify
                                                icon={
                                                    'eva:arrow-ios-forward-fill'
                                                }
                                            />
                                        </Typography>
                                    </Stack>
                                    <Box px={3}>
                                        <Grid container spacing={0.5}>
                                            <Grid item xs={3}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={parseInt(
                                                        (currentweek == 0
                                                            ? 1
                                                            : 0) * 100
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={parseInt(
                                                        (currentweek == 1
                                                            ? 1
                                                            : 0) * 100
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={parseInt(
                                                        (currentweek == 2
                                                            ? 1
                                                            : 0) * 100
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={parseInt(
                                                        (currentweek == 3
                                                            ? 1
                                                            : 0) * 100
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                        {/* <LinearProgress variant="determinate" value={30} /> */}
                                        <Stack
                                            direction="row"
                                            justifyContent={'space-between'}
                                            py={1}
                                            pb={2}
                                        >
                                            <Typography
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    color: 'primary.main',
                                                    display: 'flex',
                                                }}
                                            >
                                                <Typography
                                                    color={'text.secondary'}
                                                >
                                                    In progress:
                                                </Typography>
                                                &nbsp; Week {currentweek + 1}
                                            </Typography>

                                            {/* <Typography
                                            sx={{
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontWeight: 500,
                                            }}
                                            color={'text.secondary'}
                                        >
                                            Week {currentweek + 1}/
                                            {AtheletePlan?.Exercises?.Duration}
                                        </Typography> */}
                                        </Stack>

                                        <Divider />
                                        <Grid container my={2}>
                                            <Grid item xs={6}>
                                                <Box>
                                                    <Typography
                                                        color="text.primary"
                                                        mb={0.5}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Program level
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body1"
                                                    >
                                                        {currentProgram?.Type}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box>
                                                    <Typography
                                                        color="text.primary"
                                                        mb={0.5}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Date created
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body1"
                                                    >
                                                        {moment(
                                                            currentProgram?.createdAt
                                                        ).format('ll')}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box my={2}>
                                                    <Typography
                                                        color="text.primary"
                                                        mb={0.5}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Duration
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body1"
                                                    >
                                                        {currentProgram?.Duration +
                                                            ' weeks'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box my={2}>
                                                    <Typography
                                                        color="text.primary"
                                                        mb={0.5}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Pricing model
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body1"
                                                    >
                                                        {
                                                            currentProgram?.PaymentType
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box>
                                                    <Typography
                                                        color="text.primary"
                                                        mb={0.5}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Started on
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body1"
                                                    >
                                                        {'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box>
                                                    <Typography
                                                        color="text.primary"
                                                        mb={0.5}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Ending at
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body1"
                                                    >
                                                        {'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                        >
                                            <Avatar
                                                src={
                                                    currentProgram?.createdBy
                                                        ?.profilePic
                                                }
                                            />
                                            <Box ml={2}>
                                                <Typography variant="subtitle1">
                                                    By{' '}
                                                    {
                                                        currentProgram
                                                            ?.createdBy?.name
                                                    }
                                                </Typography>
                                                <Typography
                                                    color={'text.secondary'}
                                                >
                                                    {currentProgram?.Title}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <br />
                                        <br />
                                    </Box>
                                </Box>
                            )}
                        {!currentProgram?._id && (
                            <Box backgroundColor={'#fff'} mt={1}>
                                <Stack
                                    direction="row"
                                    justifyContent={'center'}
                                    px={3}
                                    py={3}
                                >
                                    <Typography color={'text.secondary'}>
                                        No active programs
                                    </Typography>
                                </Stack>
                            </Box>
                        )}
                        {/* <Grid
              container
              spacing={2}
              px={3}
              mt={2}
              pb={2}
              sx={{ backgroundColor: "#fff", mt: 1 }}
            >
              <Grid item xs={12}>
                {" "}
                <Typography variant="subtitle1" color="text.primary">
                  Active program
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {AtheletePlan?.AllPrograms.filter(
                  (i) => i._id == AtheletePlan.currentPlan
                ).length ? (
                  <ProgramList
                    onClickItem={() => navigate("/client/my-program")}
                    programs={AtheletePlan?.AllPrograms.filter(
                      (i) => i._id == AtheletePlan.currentPlan
                    )}
                    page="clientProfile"
                  />
                ) : (
                  <Typography color={"text.secondary"}>
                    {" "}
                    You don't have an active program
                  </Typography>
                )}
              </Grid>
            </Grid> */}
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
