// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
// components
import Page from '../../components/Page';
// sections
import { Box, Typography, ButtonBase, IconButton, Divider } from '@mui/material';
import { Stack } from '@mui/material';
import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';

import { useNavigate, useLocation } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboarding } from '../../redux/actions/Onboarding';
import LinearProgress from '@mui/material/LinearProgress';
import Iconify from '../../components/Iconify';
import LabeledInput from '../../components/core/LabeledInput';
import FooterBase from '../../components/Layout/Footer';
import Progress from 'src/components/progress';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Footer from 'src/components/onboarding/footer';
import axios from 'axios';
import api from 'src/utils/api';
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader';
import WorkoutWeek from 'src/components/instructor/workoutWeek';
import ExerciseCard from 'src/components/instructor/exerciseCard';
import Label from 'src/components/Label';
import { TabContext, TabPanel } from '@mui/lab';
import SwitchCustom from 'src/components/SwitchCustom';
import ProgramOverviewStatus from 'src/components/program/programOverviewStatus';
import ClientList from 'src/components/dashboard/client/ClientList';
import ProgramOverviewPopover from 'src/components/program/programOverviewPopover';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WeekAccordian from 'src/components/trainingLog/WeekAccordian';
import TrackVisibility from 'react-visibility-sensor';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getAllLogs } from '../../redux/actions/ProgressLogs';
import { markLogasread } from '../../redux/actions/common';
import MessageCard from 'src/components/client/MessageCard';
import _ from 'lodash';
import useLocalStorage from 'src/hooks/useLocalStorage';
import moment from 'moment';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#F5F7FA',
  height: '100%',
}));

const BoxStyle = styled(Box)(() => ({
  position: 'relative',
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
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: 24,
  backgroundColor: 'rgba(255,255,255, 0.5)',
  backdropFilter: 'blur(12px)',
  display: 'flex',
  padding: '12px',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
// ----------------------------------------------------------------------
const days = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
export default function ClientWorkoutCalendar() {
  const dispatch = useDispatch();

  const { search } = useLocation();
  console.log(search);
  const query = new URLSearchParams(search);
  const exercises = [{}, {}];
  const navigate = useNavigate();
  const Plan = useSelector((s) => s.AtheletePlan);
  const ClientData = useSelector((s) => s.ProgramList?.clientData);
  const Profile = useSelector((s) => s.Profile);
  const [hasMore, setHasMore] = useState(true);
  const [Logs, setLogs] = useLocalStorage('logs', []);

  const fetchAllLogs = () => {
    getAllLogs({
      id: Profile.type == 'Instructor' ? ClientData._id : Plan.currentPlan,
    })
      .then((res) => {
        setLogs(_.orderBy(res, ['week', 'day', 'exercise']));
      })
      .catch((err) => {
        setLogs([]);
        setHasMore(false);
      });
  };

  useEffect(() => {
    fetchAllLogs();
  }, []);

  let groupedLogs = _.groupBy(Logs, (i) => i.week);

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
        <Container>
          <Header noColor>
            <BoxHeader
              px={2}
              py={2}
            >
              <Box
                width={'100%'}
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
                    Training log
                  </Typography>{' '}
                </Box>{' '}
              </Box>
            </BoxHeader>
          </Header>{' '}
          <Content
            style={{
              width: '100%',
              paddingTop: 24,
              paddingBottom: 24,
              overflowY: 'auto',
              backgroundColor: '#F9FAFD',

              //   overflowX: "auto",
            }}
          >
            <InfiniteScroll
              dataLength={Logs.length}
              next={() => {}}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <Box
                  display={'flex'}
                  height={'80vh'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flexGrow={1}
                  style={{ textAlign: 'center' }}
                >
                  <Typography color={'text.secondary'}>No records found</Typography>
                </Box>
              }
            >
              {Object.keys(groupedLogs).map((item) => {
                return (
                  <WeekAccordian
                    weekLogs={groupedLogs[item]}
                    week={item}
                    markLogasread={markLogasread}
                    Profile={Profile}
                    ClientData={ClientData}
                    Plan={Plan}
                    navigate={navigate}
                    fetchAllLogs={fetchAllLogs}
                    name={Profile.name || Profile.profileName}
                    profilePic={Profile.profilePic}
                    orderId={Profile.type == 'Instructor' ? ClientData._id : Plan.currentPlan}
                    type={Profile.type}
                    Instructor={Plan.Instructor}
                  />
                );
              })}

              {/* {Object.keys(groupedLogs).map((item) => {
                return (
                  <>
                    <Typography
                      variant="h2"
                      gutterBottom
                    >
                      {item}
                    </Typography>
                    <br />

                    {groupedLogs?.[item]?.map((log, i) => (
                      <Box>
                        <Typography
                          onClick={() => {
                            Profile.type == 'Instructor'
                              ? navigate(`/clientProfile/${ClientData.Program._id}/workoutDay`, {
                                  state: {
                                    open: true,
                                    week: log.week,
                                    day: log.day,
                                    exercise: log.exercise,
                                  },
                                })
                              : navigate(`/myWorkoutCalendar/workoutDay`, {
                                  state: {
                                    open: true,
                                    week: log.week,
                                    day: log.day,
                                    exercise: log.exercise,
                                  },
                                });
                          }}
                          sx={{
                            fontWeight: '500',
                            color: 'primary.main',

                            textTransform: 'capitalize',
                            mb: 2,
                          }}
                        >
                          {`[Week ${log.week + 1}] [Day ${log.day + 1}] [Exercise ${log.exercise + 1}: ${
                            log?.logs[0]?.title
                          }]`}
                        
                        </Typography>
                        {log.logs.map((l, i) => (
                          <TrackVisibility onChange={() => !l.IsRead && markLogasread(l._id)}>
                            <Box>
                              {Profile.type == 'Instructor' ? (
                                <MessageCard
                                  {...l}
                                  {...log}
                                  fetchAllLogs={fetchAllLogs}
                                  name={
                                    ClientData.UserId._id == l.createdBy
                                      ? ClientData.UserId?.name
                                      : Profile.profileName || Profile.name
                                  }
                                  profilePic={
                                    ClientData.UserId._id == l.createdBy
                                      ? ClientData.UserId?.profilePic
                                      : Profile.profilePic
                                  }
                                />
                              ) : (
                                <MessageCard
                                  orderId={Profile.type == 'Instructor' ? ClientData._id : Plan.currentPlan}
                                  {...l}
                                  {...log}
                                  fetchAllLogs={fetchAllLogs}
                                  name={
                                    Plan.Instructor._id == l.createdBy
                                      ? Plan.Instructor?.name
                                      : Profile.name || Profile.profileName || Profile.name
                                  }
                                  profilePic={
                                    Plan.Instructor._id == l.createdBy
                                      ? Plan.Instructor?.profilePic
                                      : Profile.profilePic
                                  }
                                />
                              )}
                            </Box>
                          </TrackVisibility>
                        ))}
                        <Box width={'100%'}>
                          {' '}
                          <Divider sx={{ my: 2 }} />
                        </Box>
                      </Box>
                    ))}
                  </>
                );
              })} */}
            </InfiniteScroll>
          </Content>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
