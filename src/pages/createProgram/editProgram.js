// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
// components
import Page from '../../components/Page';
// sections
import { Box, Button, Typography, Stack, Avatar, ButtonBase, IconButton, InputAdornment } from '@mui/material';

import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';
//import { updateProgram } from "src/redux/actions/createProgram";
import { updateOnboarding } from '../../redux/actions/Onboarding';
import LinearProgress from '@mui/material/LinearProgress';
import Iconify from '../../components/Iconify';
import LabeledInput from '../../components/core/LabeledInput';
import FooterBase from '../../components/Layout/Footer';
import NewProgramForm from 'src/components/instructor/newProgramForm';
import Progress from 'src/components/progress';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Footer from 'src/components/onboarding/footer';
import { handleuploadImage } from 'src/utils/uploader';
import axios from 'axios';
import api from 'src/utils/api';
import Input from 'src/components/Labs/Cropper';
import { createProgram, saveProgram, getAllPrograms } from 'src/redux/actions/createProgram';
import { updateFeedback } from 'src/redux/actions/feedback';

import { useOutletContext } from 'react-router-dom';
import Start from './start';
import Calendar from './workoutCalendar';
import Diet from './dietPlan';
import Publish from './publishProgram';
import PublishDraft from './publishCreateProgram';
import { dispatch } from 'src/redux/store';
import { useConfirmationModalContext } from 'src/utils/Modal';

import { checkIsDraft, getEmptyWeekNumber } from 'src/utils/getProgramStatus';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
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
  padding: '20px 0',
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

export default function CreateProgramPage({}) {
  const [Program, updateProgram, mode] = useOutletContext();
  const { state } = useLocation();

  const [selectedTab, setSelectedTab] = useState(state?.tab || 0);
  const dispatch = useDispatch();
  const sref = useRef(null);
  const { showConfirmationModal } = useConfirmationModalContext();
  const navigate = useNavigate();

  const handleTabChange = (newValue) => {
    if (!sref.current?.validateForm) {
      setSelectedTab(newValue);

      dispatch({
        type: 'UPDATE_PROGRAM',
        payload: {
          ScreenStats: {
            CurrentScreen: newValue == 0 ? 'start' : newValue == 1 ? 'workouts' : 'publish',
          },
        },
      });
      return;
    }
    sref.current.validateForm().then((validated) => {
      if (Object.keys(validated).length == 0) {
        if (selectedTab !== (Program.IsDraft ? 3 : 2)) sref.current.handleSubmit();
        navigate(`/editProgram/${Program._id}/publishProgram`, {
          replace: true,
          state: { tab: newValue },
        });

        dispatch({
          type: 'UPDATE_PROGRAM',
          payload: {
            ScreenStats: {
              CurrentScreen: newValue == 0 ? 'start' : newValue == 1 ? 'workouts' : 'publish',
            },
          },
        });
        setSelectedTab(newValue);
      } else {
        sref.current.handleSubmit();
      }
    });
  };

  const handelNext = () => {
    // sref.current.handleSubmit()
    if (!sref.current.validateForm) {
      setSelectedTab(selectedTab + 1);
      return;
    }
    sref.current.validateForm().then((validated) => {
      if (Object.keys(validated).length == 0) {
        sref.current.handleSubmit();
        if (selectedTab !== 3) {
          setSelectedTab(selectedTab + 1);
          navigate(`/editProgram/${Program._id}`, {
            replace: true,
            state: { tab: selectedTab + 1 },
          });
          dispatch({
            type: 'UPDATE_PROGRAM',
            payload: {
              ScreenStats: {
                CurrentScreen: selectedTab == 0 ? 'start' : selectedTab == 1 ? 'workouts' : 'publish',
              },
            },
          });
        }
      } else {
        sref.current.handleSubmit();
      }
    });
  };
  const handlePublish = () => {
    if (!sref.current.validateForm) {
      setSelectedTab(selectedTab + 1);
      return;
    }
    sref.current.validateForm().then((validated) => {
      if (Object.keys(validated).length == 0) {
        sref.current.handelNext();
      } else {
        sref.current.handelNext();
      }
    });
  };

  const handleBack = () => {
    setSelectedTab(selectedTab - 1);
  };

  const handleSave = () => {
    if (checkIsDraft(Program)) {
      showConfirmationModal(
        'Save as draft?',
        `Your week ${getEmptyWeekNumber(
          Program,
        )} is currently empty. Please add at least one workout or delete the week to proceed with publishing the program`,
        'Continue',
        'Save as draft',
      ).then((res) => {
        if (!res) {
          dispatch(updateFeedback({ loading: true }));
          sref.current?.handleSubmit && sref.current?.handleSubmit(mode);
          dispatch(
            updateProgram({
              ...Program,
              IsDraft: checkIsDraft(Program),
            }),
          );
          setTimeout(() => {
            dispatch(
              saveProgram({
                ...Program,
                IsDraft: checkIsDraft(Program),
              }),
            ).then((res) => {
              setTimeout(() => {
                navigate('/instructor');
              }, 500);

              dispatch(
                updateFeedback({
                  loading: false,
                  snackbar: true,
                  message: 'Program saved successfully',
                  severity: 'success',
                }),
              );
            });
          }, 500);
        } else {
          handleBack();
        }
      });
    } else {
      if (!sref.current.validateForm) {
        sref.current?.handleSubmit && sref.current?.handleSubmit(mode);

        dispatch(updateFeedback({ loading: true }));

        dispatch(
          updateProgram({
            ...Program,
            IsDraft: checkIsDraft(Program),
          }),
        );
        setTimeout(() => {
          dispatch(
            saveProgram({
              ...Program,
              IsDraft: checkIsDraft(Program),
            }),
          ).then((res) => {
            setTimeout(() => {
              navigate('/instructor');
            }, 500);
            dispatch(getAllPrograms());
            dispatch(
              updateFeedback({
                loading: false,
                snackbar: true,
                message: 'Program saved successfully',
                severity: 'success',
              }),
            );
          });
        }, 1000);
        return;
      }
      sref.current.validateForm().then((validated) => {
        if (Object.keys(validated).length == 0) {
          sref.current.handleSubmit();
          dispatch(updateFeedback({ loading: true }));
          sref.current?.handleSubmit && sref.current?.handleSubmit(mode);
          // dispatch(
          //   updateProgram({ ...Program, IsDraft: checkIsDraft(Program) })
          // );
          setTimeout(() => {
            dispatch(
              saveProgram({
                ...Program,
                IsDraft: checkIsDraft(Program),
              }),
            ).then((res) => {
              setTimeout(() => {
                navigate('/instructor');
              }, 500);
              dispatch(getAllPrograms());
              dispatch(
                updateFeedback({
                  loading: false,
                  snackbar: true,
                  message: 'Program saved successfully',
                  severity: 'success',
                }),
              );
            });
          }, 1000);
        } else {
          sref.current.handleSubmit();
        }
      });
    }
  };
  const renderButton = () => {
    if (mode == 'edit' && !Program.IsDraft) {
      return (
        <Button
          sx={{ fontSize: 16, paddingRight: 0 }}
          onClick={handleSave}
        >
          Save
        </Button>
      );
    }
    switch (selectedTab) {
      case 2:
        return (
          <Button
            sx={{ fontSize: 16, paddingRight: 0 }}
            onClick={handleSave}
          >
            {mode == 'edit' ? (Program.IsDraft ? 'Publish' : 'Save') : 'Publish'}
          </Button>
        );
      // case 2:
      //     return (
      //         <Button
      //             sx={{ fontSize: 16, paddingRight: 0 }}
      //             onClick={handelNext}
      //         >
      //             {!Program.DietPlan.Title &&
      //             !Program.DietPlan?.Description
      //                 ? 'Skip'
      //                 : 'Next'}
      //         </Button>
      //     )
      case 1:
        return (
          <Button
            sx={{ fontSize: 16, paddingRight: 0 }}
            onClick={handelNext}
          >
            Next
          </Button>
        );

      case 0:
        return (
          <Button
            sx={{ fontSize: 16, paddingRight: 0 }}
            onClick={handelNext}
          >
            Next
          </Button>
        );

      default:
        return (
          <Button
            sx={{ fontSize: 16, paddingRight: 0 }}
            onClick={handelNext}
          >
            Next
          </Button>
        );
    }
  };

  useEffect(() => {
    if (!Program.IsDraft) {
      return;
    }

    if (Program?.ScreenStats?.CurrentScreen == 'workoutDay' && state?.type !== 'inside') {
      setTimeout(() => {
        navigate(`/editProgram/${Program._id}`, {
          replace: true,
          state: { tab: 1, type: 'inside' },
        });
        navigate(`/editProgram/${Program._id}/workoutDay`, {
          state: { tab: 1, week: Program?.ScreenStats?.Week, day: Program?.ScreenStats?.Day },
        });
      }, 100);
    }
    if (Program?.ScreenStats?.CurrentScreen == 'start' && state?.type !== 'inside') {
      setTimeout(() => {
        setSelectedTab(0);
        navigate(`/editProgram/${Program._id}`, {
          replace: true,
          state: { tab: 0, type: 'inside' },
        });
      }, 100);
    }
    if (Program?.ScreenStats?.CurrentScreen == 'workouts' && state?.type !== 'inside') {
      setTimeout(() => {
        setSelectedTab(1);
        navigate(`/editProgram/${Program._id}`, {
          replace: true,
          state: { tab: 1, type: 'inside' },
        });
      }, 100);
    }
    if (Program?.ScreenStats?.CurrentScreen == 'publish' && state?.type !== 'inside') {
      setTimeout(() => {
        setSelectedTab(2);
        navigate(`/editProgram/${Program._id}`, {
          replace: true,
          state: { tab: 2, type: 'inside' },
        });
      }, 100);
    }
  }, [Program]);
  return (
    <Page title=" Simplified Online Fitness Training ">
      <Container>
        <Header
          style={{
            borderRadius: '0px 0px 8px 8px',
            backgroundColor: 'white',
            boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
            overflow: 'hidden',
          }}
          reducedHeight={16}
        >
          <Box
            pt={2}
            borderRadius={4}
            overflow={'hidden'}
          >
            <Box
              width={'100%'}
              display={'flex'}
              px={2}
              mb={1}
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
                  variant="body1"
                  color="text.primary"
                >
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                  >
                    {/* {mode == "edit"
                      ? "Program Overview"
                      : mode === "customize"
                      ? "Client Profile"
                      : "Home"}
                    &nbsp;&gt;&nbsp; */}
                    <Typography
                      variant={'subtitle1'}
                      color="text.primary"
                    >
                      {' '}
                      {mode == 'edit'
                        ? Program.IsDraft
                          ? 'Draft'
                          : `Edit program`
                        : mode === 'customize'
                        ? 'Workout'
                        : 'Create program'}
                    </Typography>
                  </Box>
                </Typography>{' '}
              </Box>{' '}
              {renderButton()}
            </Box>
            <Box
              px={2}
              pb={2}
            >
              <Progress
                setSelectedTab={handleTabChange}
                noClose={true}
                mode={mode}
                stepper={Program.IsDraft}
                Program={Program}
                selectedTab={selectedTab}
                route={mode == 'edit' && !Program.IsDraft ? [0, 2] : [0, 2]}
                label={
                  mode == 'edit' && !Program.IsDraft
                    ? ['Workouts', 'Overview']
                    : [
                        'Start',
                        'Workouts',
                        //   'Diet',
                        'Publish',
                      ]
                }
                steps={mode == 'edit' && !Program.IsDraft ? 2 : 3}
                active={mode == 'edit' && !Program.IsDraft ? 1 : 1}
                handleClose={() => navigate('/', { replace: true })}
              />
            </Box>
          </Box>
        </Header>

        {Program.IsDraft ? (
          <>
            {selectedTab === 0 && <Start ref={sref} />}
            {selectedTab == 1 && <Calendar ref={sref} />}
            {selectedTab == 2 && <PublishDraft ref={sref} />}

            {/* {selectedTab == 3 && <PublishDraft ref={sref} />} */}
          </>
        ) : (
          <>
            {selectedTab == 0 && <Calendar ref={sref} />}
            {/* {selectedTab == 1 && <Diet ref={sref} />} */}
            {selectedTab == 2 && <Publish ref={sref} />}
          </>
        )}

        {/* <FooterBase height={selectedTab == 3 ? undefined : 0}>
          <FotterButtons />
        </FooterBase> */}
        {/* <FooterBase height={selectedTab == 1 ? undefined : 0}>
          {selectedTab == 1 && <Box py={3}></Box>}
        </FooterBase> */}
      </Container>
    </Page>
  );
}
