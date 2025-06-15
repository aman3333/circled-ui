// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
// components
import Page from '../../../components/Page';
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  Divider,
  ButtonBase,
  Badge,
  InputAdornment,
  Grid,
} from '@mui/material';

import Container from '../../../components/Layout/Container';
import Content from '../../../components/Layout/Content';
import Header from '../../../components/Layout/Header';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getClientsSpecific, saveTodo } from 'src/redux/actions/clientExercise';
import { IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import ProgramListView from 'src/components/instructor/ProgramListView';
import ClientProfileHeader from 'src/components/dashboard/client/ClientProfileHeader';
import IconWorkoutCalendar from 'src/assets/clientProfile/Icon_workoutCalendar';
import IconDietPlan from 'src/assets/clientProfile/Icon_DietPlan';
import IconNotes from 'src/assets/clientProfile/Icon_Notes';
import TodoList from 'src/pages/instructor/client/Todo';
import { updateFeedback } from 'src/redux/actions/feedback';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import IconSups from 'src/assets/clientProfile/Icon_Sups';
import IconBodySystem from 'src/assets/clientProfile/Icon_BodySystem';
import IconPhotos from 'src/assets/clientProfile/Icon_Photos';
import ClientTrainingLog from 'src/assets/IconSet/InstructorLogsIcon';
import CameraIcon from 'src/assets/IconSet/camera';
import { getLogUnreadCount } from 'src/redux/actions/common';
import BodyMetrix from 'src/components/client/BodyMetrix';
import HealthProfile from 'src/assets/IconSet/fitnessProfile/HealthProfile';
import PhotoWidget from 'src/components/client/UploadphotoWidget';
import Image from 'src/components/Image';
import { sendProgram } from 'src/redux/actions/createProgram';
import { deleteSentPrograms } from 'src/redux/actions/common';
import notificationEvents from 'src/utils/notificationEvents';
import PersonalDetailIcon from 'src/assets/IconSet/fitnessProfile/PersonalDetails';
import SelectProgram from 'src/components/instructor/SelectProgram';
import { getWeekProgress, getCurrentInProgressWeekNumber } from 'src/utils/calendar';
import useSocket from 'src/hooks/useSocket';

import { ObjectID } from 'bson';

const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
  height: '100%',
}));

const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
}));
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
// ----------------------------------------------------------------------

export default function ClientProfilePage() {
  const [headerDependency, setHeaderDependency] = useState(false);
  const [x, y, z, e, reload] = useOutletContext();
  const [logCount, setLogCount] = useState(0);
  const { search, state, pathname } = useLocation();
  const { id } = useParams();
  const query = new URLSearchParams(search);
  const ProgramList = useSelector((s) =>
    s.ProgramList.Programs.filter(
      (item) => item.IsDraft == false && item.IsDeleted == false && item.IsArchived == false,
    ),
  );
  const Profile = useSelector((p) => p.ProgramList.clientDetails);
  const sentProgram = useSelector((s) => s.ProgramList.sentProgram);
  const Program = useSelector((s) => s.ProgramList.clientData?.Program);
  const todoData = useSelector((s) => s.ProgramList.clientData?.todo);
  const CreatedAt = useSelector((s) => s.ProgramList.clientData?.createdAt);
  const currentweek = useSelector((s) => s.ProgramList.clientData?.currentWeek);
  const currentday = useSelector((s) => s.ProgramList.clientData?.currentDay);
  const clientStats = useSelector((s) => s.ProgramList.clientData?.stats);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [todo, setTodo] = useState([]);
  const [mini, setMini] = useState(true);
  const [mini2, setMini2] = useState(true);
  const [view, setView] = useState('program');
  const { isConnected, socket } = useSocket();
  const handelNext = () => {
    navigate('/createDietPlan');
  };
  useEffect(() => {
    getLogUnreadCount(id).then((res) => setLogCount(res?.data?.count));
    dispatch(getClientsSpecific(id));
  }, [id]);

  useEffect(() => {
    if (isConnected) {
      socket.on(notificationEvents.ACCEPT_PROGRAM, (data) => {
        console.log('accept order');
        dispatch(getClientsSpecific(id));
      });
    }
  }, [isConnected]);

  const handleBack = () => {
    if (query.get('stage') == 2) {
      return navigate('/createProgram');
    }
    navigate('/createProgram?stage=' + (Number(query.get('stage')) - 1));
  };

  const handleChange = (val, index) => {
    let newTodo = [...todo];
    newTodo[index].value = val;
    setTodo(newTodo);
  };
  const deleteTodo = (index) => {
    setTodo(todo.filter((item, i) => i != index));
    dispatch(
      saveTodo({
        todo: todo.filter((item, i) => i != index),
      }),
    );
  };
  const pushTodo = () => {
    const id = new ObjectID();
    setTodo([...todo, { value: '', isDone: false, edit: true, _id: id.toString() }]);
  };
  const handleSave = (index) => {
    let newTodo = [...todo];
    newTodo[index].edit = false;
    dispatch(
      saveTodo({
        todo: newTodo.filter((i) => i.value != ''),
      }),
    );
    setTodo(newTodo.filter((i) => i.value != ''));
  };
  const minimize = () => {
    setMini(!mini);
    setTimeout(() => {
      setHeaderDependency(mini);
    }, 300);
  };
  const minimize2 = () => {
    setMini2(!mini2);
  };
  const toggleedit = (index) => {
    let newTodo = [...todo];
    newTodo[index].edit = true;
    setTodo(newTodo);
  };

  const activityLevelOptions = {
    'Light': 'Light: 1-3 times a week',
    'Moderate': 'Moderate: 4-5 times a week',
    'Active': 'Active: intense 4-5 times a week',
    'Very active': 'Very active: intense 6-7 times a week',
  };
  useEffect(() => {
    if (todoData?.length) setTodo(todoData);
    else setTodo([]);
  }, [todoData]);

  const onSave = () => {
    dispatch(
      saveTodo({
        todo: todo.filter((i) => i.value != ''),
      }),
    ).then((res) => {
      dispatch(
        updateFeedback({
          snackbar: true,
          message: 'Todo Saved Successfully',
          severity: 'success',
        }),
      );
    });
  };

  const getOverallProgress = () => {
    let val = 0;
    Program.ExercisePlan.weeks.map((i, index) => {
      val = val + getWeekProgress(i, clientStats, index);
    });

    return val / Program?.ExercisePlan.weeks?.length;
  };

  const SendProgram = () => {
    dispatch(
      sendProgram({
        ProgramId: Program._id,
        ClientId: id,
      }),
    );
  };

  const deleteSentProgram = (id) => {
    deleteSentPrograms(id);
  };

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
        <Container>
          <Header
            style={{
              borderRadius: '0px 0px 8px 8px',
              boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
              overflow: 'hidden',
            }}
          >
            <BoxHeader
              px={2}
              py={2}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box
                display={'flex'}
                alignItems={'center'}
              >
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
                  Client profile
                </Typography>{' '}
              </Box>{' '}
              {/* <Button sx={{ py: 0 }} size={"small"} onClick={onSave}>
                Save
              </Button> */}
            </BoxHeader>
          </Header>
          <Content
            withoutPadding
            style={{ backgroundColor: '#F5F7FA' }}
          >
            <Box>
              <ClientProfileHeader
                setHeaderDependency={setHeaderDependency}
                Profile={Profile}
                Program={Program}
                CreatedAt={CreatedAt}
                view={state?.view || view}
                setView={(val) => {
                  navigate(pathname, {
                    state: { view: val },
                    replace: true,
                  });
                  setView(val);
                }}
              />
            </Box>
            {(state?.view || view) == 'about' ? (
              <>
                {/* <Box >
                                <BodyMetrix data={Profile.healthInfo} viewMode/>
                                </Box> */}
                <Box mt={1}>
                  <Box
                    px={3}
                    bgcolor={'#fff'}
                    py={3}
                  >
                    <Typography
                      variant="h5"
                      color="text.primary"
                      gutterBottom
                      display={'flex'}
                      alignItems={'center'}
                      sx={{ mb: 2 }}
                    >
                      {/* <PersonalDetailIcon style={{marginRight:12}} />    */}
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
                      {Profile.goals || 'N/A'}
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
                            {Profile.trainingExperience || 'N/A'}
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
                            {Profile.YearsOfTraining ? Profile.YearsOfTraining + ' years' : 'N/A'}
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
                            {activityLevelOptions?.[Profile.activityLevel] || 'N/A'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Collapse>

                    <Box display="flex">
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
                          sx={{ color: 'text.primary', mt: 1 }}
                          icon={mini ? 'ic:round-keyboard-arrow-down' : 'ic:round-keyboard-arrow-up'}
                          width="34px"
                          height="34px"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box mt={1}>
                  <Box
                    px={3}
                    bgcolor={'#fff'}
                    py={3}
                  >
                    <Typography
                      variant="h5"
                      color="text.primary"
                      gutterBottom
                      display={'flex'}
                      alignItems={'center'}
                      sx={{ mb: 2 }}
                    >
                      {/* <HealthProfile style={{marginRight:12}} />   */}
                      Health profile
                    </Typography>
                    <Stack
                      spacing={2}
                      direction={'row'}
                    >
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
                          {Profile?.healthInfo?.height?.toFixed(2) || 'N/A'} cm
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
                          {Profile?.healthInfo?.weight?.toFixed(2) || 'N/A'} kg
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
                            sx={{ mb: 0.5 }}
                            color="text.secondary"
                            flexWrap={'wrap'}
                          >
                            {Profile?.healthInfo?.medicalCondition || 'N/A'}
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
                            {Profile.healthInfo.medications || 'N/A'}
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
                            {Profile.healthInfo.injuries || 'N/A'}
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
                            {Profile.healthInfo.history || 'N/A'}
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
                            {Profile.healthInfo.allergiesAndReactions || 'N/A'}
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
                            {Profile.healthInfo.supplements || 'N/A'}
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
                            {Profile.healthInfo.medicalNotes || 'N/A'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Collapse>

                    <Box display="flex">
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
                          sx={{ color: 'text.primary', mt: 1 }}
                          icon={mini2 ? 'ic:round-keyboard-arrow-down' : 'ic:round-keyboard-arrow-up'}
                          width="34px"
                          height="34px"
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box mt={1}>
                    <Box
                      px={3}
                      bgcolor={'#fff'}
                      py={3}
                    >
                      <Typography
                        variant="h5"
                        color="text.primary"
                        gutterBottom
                        display={'flex'}
                        alignItems={'center'}
                        sx={{ mb: 2 }}
                      >
                        {/* <CameraIcon style={{marginRight:12}} mode="view"/>    */}
                        Body images
                      </Typography>
                      <PhotoWidget data={Profile.bodyImages} />
                    </Box>
                  </Box>
                </Box>
              </>
            ) : null}
            {(state?.view || view) == 'program' && Program?._id ? (
              <>
                {' '}
                <Box
                  mt={1}
                  bgcolor={'#fff'}
                >
                  <Box
                    alignItems={'center'}
                    px={3}
                    py={2}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',

                        backgroundSize: 'cover',
                        borderRadius: '4px 4px 4px 4px',
                        backgroundPosition: 'center',
                      }}
                      // style={{
                      //   backgroundImage: `src(${
                      //     Program?.BannerImage ||
                      //     "/images/instructor/programImage.png"
                      //   })`,
                      // }}
                    >
                      {Program?.BannerImage ? (
                        <Image
                          src={Program?.BannerImage || '/images/DefaultThumbnail.png'}
                          sx={{
                            width: 160,
                            height: 110,
                            backgroundPosition: 'center',
                            borderRadius: 1,
                          }}
                        />
                      ) : (
                        ''
                      )}

                      <Typography
                        sx={{
                          ml: Program?.BannerImage ? 2 : 0,
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                        }}
                      >
                        {Program?.Title}
                      </Typography>
                    </Box>
                    <Box>
                      <Stack
                        direction="row"
                        justifyContent={'space-between'}
                        px={2}
                        py={1}
                      >
                        {/* <Typography
                                            sx={{
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                            onClick={() =>
                                                navigate('progressLog')
                                            }
                                            color={'primary.main'}
                                        >
                                            View
                                        </Typography> */}
                      </Stack>
                      <Box>
                        <Box display={'flex'}>
                          <Box
                            display={'flex'}
                            flex={1}
                            width={'100%'}
                            height={18}
                            pr={0.5}
                          >
                            <Box
                              sx={{
                                width: '100%',
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={getOverallProgress() * 100}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          display={'flex'}
                          width={'100%'}
                          justifyContent={'flex-start'}
                        >
                          <Stack
                            direction="row"
                            justifyContent={'space-between'}
                            pb={3}
                          >
                            <Typography
                              sx={{
                                textTransform: 'capitalize',
                                fontWeight: 500,
                                display: 'flex',
                              }}
                            >
                              <Typography color={'text.secondary'}>In progress:</Typography>
                              &nbsp;
                              <Typography>
                                Week {getCurrentInProgressWeekNumber(Program.ExercisePlan.weeks, clientStats) + 1}
                                {/* {
                        Program?.ExercisePlan?.weeks?.[currentweek].days[
                          currentday
                        ].Title
                      } */}
                              </Typography>
                            </Typography>

                            {/* <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Week {currentweek + 1}/{Program?.Duration}
                  </Typography> */}
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Stack px={2}>
                    <Stack
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      direction={'row'}
                      onClick={() => navigate('workoutCalendar')}
                    >
                      <Stack
                        direction={'row'}
                        spacing={1}
                        alignItems="center"
                      >
                        <IconWorkoutCalendar style={{ fontSize: 54 }} />
                        <Typography
                          color="text.primary"
                          align="center"
                          flexWrap={'wrap'}
                        >
                          Workout
                        </Typography>
                      </Stack>
                      <Iconify icon={'ep:arrow-right-bold'} />
                    </Stack>
                    <Divider sx={{ my: 1.5 }} />
                  </Stack>
                  <Stack
                    px={2}
                    pb={3}
                  >
                    <Stack
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      direction={'row'}
                      onClick={() => navigate('trainingLog')}
                    >
                      <Stack
                        direction={'row'}
                        spacing={1}
                        alignItems="center"
                      >
                        {logCount ? (
                          <StyledBadge
                            badgeContent={logCount}
                            color="primary"
                          >
                            <ClientTrainingLog
                              sx={{
                                fontSize: 54,
                                p: 0.8,
                              }}
                            />
                          </StyledBadge>
                        ) : (
                          <ClientTrainingLog
                            sx={{
                              fontSize: 54,
                              p: 0.8,
                            }}
                          />
                        )}
                        <Typography
                          color="text.primary"
                          align="center"
                          flexWrap={'wrap'}
                        >
                          Training log
                        </Typography>
                      </Stack>
                      <Iconify icon={'ep:arrow-right-bold'} />
                    </Stack>
                  </Stack>

                  {/* <Grid
                                        container
                                        spacing={1}
                                        px={3}
                                        sx={{ background: '#fff' }}
                                    > */}
                  {/* <Grid item xs={12} sx={{ mb: 2 }}>
                <ProgramList
                  currentweek={currentweek}
                  programs={Program ? [Program] : []}
                  page="clientProfile"
                />
              </Grid> */}
                  {/* <Grid item xs={4}>
                                            <Stack
                                                spacing={1}
                                                mb={2}
                                                alignItems="center"
                                                onClick={() =>
                                                    navigate('workoutCalendar')
                                                }
                                            >
                                                <IconWorkoutCalendar
                                                    style={{ fontSize: 54 }}
                                                />
                                                <Typography
                                                    color="text.primary"
                                                    align="center"
                                                    flexWrap={'wrap'}
                                                    variant="body2"
                                                >
                                                    Workout
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack
                                                spacing={1}
                                                alignItems="center"
                                                onClick={() =>
                                                    navigate('dietPlan')
                                                }
                                            >
                                                <IconDietPlan
                                                    style={{ fontSize: 54 }}
                                                />
                                                <Typography
                                                    color="text.primary"
                                                    align="center"
                                                    flexWrap={'wrap'}
                                                    variant="body2"
                                                >
                                                    Diet Plan
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Stack
                                                spacing={1}
                                                alignItems="center"
                                                onClick={() =>
                                                    navigate('trainingLog')
                                                }
                                            >
                                                {logCount ? (
                                                    <StyledBadge
                                                        badgeContent={logCount}
                                                        color="primary"
                                                    >
                                                        <ClientTrainingLog
                                                            sx={{
                                                                fontSize: 54,
                                                                p: 0.8,
                                                            }}
                                                        />
                                                    </StyledBadge>
                                                ) : (
                                                    <ClientTrainingLog
                                                        sx={{
                                                            fontSize: 54,
                                                            p: 0.8,
                                                        }}
                                                    />
                                                )}
                                                <Typography
                                                    color="text.primary"
                                                    align="center"
                                                    flexWrap={'wrap'}
                                                    variant="body2"
                                                >
                                                    Training log
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Stack
                                                spacing={1}
                                                alignItems="center"
                                                onClick={() =>
                                                    navigate('notes')
                                                }
                                            >
                                                <IconNotes
                                                    style={{ fontSize: 54 }}
                                                />
                                                <Typography
                                                    color="text.primary"
                                                    align="center"
                                                    flexWrap={'wrap'}
                                                    variant="body2"
                                                    sx={{ pt: 0.1, pl: -0.5 }}
                                                >
                                                    Notes
                                                </Typography>
                                            </Stack>
                                        </Grid> */}

                  {/* <Grid item xs={12}>
                {" "}
                <Typography variant="subtitle1" color="text.primary">
                  Todo
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TodoList
                  todo={todo}
                  handleSave={handleSave}
                  handleChange={handleChange}
                  deleteTodo={deleteTodo}
                  pushTodo={pushTodo}
                  toggleedit={toggleedit}
                />
              </Grid> */}
                  {/* </Grid> */}
                </Box>
                <Box
                  mt={1.5}
                  px={3}
                  py={3}
                  backgroundColor={'#fff'}
                  height={'100%'}
                >
                  <Stack
                    direction="row"
                    justifyContent={'space-between'}
                    pb={1}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}
                    >
                      Todos
                    </Typography>
                    {/* 
                <Typography
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                  color={"primary.main"}
                >
                  View <Iconify icon={"eva:arrow-ios-forward-fill"} />
                </Typography> */}
                  </Stack>
                  <TodoList
                    todo={todo}
                    handleSave={handleSave}
                    handleChange={handleChange}
                    deleteTodo={deleteTodo}
                    pushTodo={pushTodo}
                    toggleedit={toggleedit}
                  />
                </Box>
              </>
            ) : (state?.view || view) == 'program' ? (
              <>
                <Box
                  mt={1}
                  bgcolor={'#fff'}
                  height={'100%'}
                  py={3}
                  px={2}
                >
                  {sentProgram ? (
                    <ProgramListView
                      programs={[{ ...sentProgram.Program, _id: sentProgram._id }]}
                      status={'Sent'}
                      onDelete={deleteSentProgram}
                    />
                  ) : (
                    <Box
                      height={'100%'}
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <center>
                        <Typography color={'text.secondary'}>This client currently has no active program</Typography>
                        <Button color="primary">
                          <SelectProgram
                            programs={ProgramList}
                            email={Profile.email}
                            reload={reload}
                          >
                            Add program
                          </SelectProgram>
                        </Button>
                      </center>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              ''
            )}
            {/* <ProgramList programs={[]} /> */}
          </Content>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
