// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// sections
import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  Button,
  BottomNavigation,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import axios from '../../utils/axios';
import api from '../../utils/api';
import Footer from '../../components/onboarding/footer';
import { useNavigate, useLocation } from 'react-router';
import { searchItemByKey } from 'src/utils/search.js';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboarding } from '../../redux/actions/Onboarding';
import Stepper from '../../components/progress';
import Image from '../../components/Image';
import Preview1 from '../../assets/onboarding/overview.svg';
import Preview2 from '../../assets/onboarding/overview2.svg';
import Preview3 from '../../assets/onboarding/overview3.svg';
import Iconify from '../../components/Iconify';
import Container from '../../components/Layout/Container';
import FooterBase from '../../components/Layout/Footer';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import InstructorHeader from 'src/components/home/HomeHeader';
import { useState, useEffect } from 'react';
import InstructorPrograms from 'src/components/instructor/instructorPrograms';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import DraftedProgramBottomDrawer from 'src/components/instructor/DraftedProgramBottomDrawer';
import ProgramIcon from 'src/assets/IconSet/Program';
import ClientIcon from 'src/assets/IconSet/Client';
import AddIcon from 'src/assets/IconSet/Add';
import DbIcon from 'src/assets/IconSet/DB';
import { updateProgram, getAllPrograms, deleteProgram } from 'src/redux/actions/createProgram';
import { createStyles } from '@mui/styles';
import { orderBy } from 'lodash';
import VideoDialog from '../../components/instructor/VideoDialog';
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
  padding: '16px 16px',
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
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: '0 20px',
  justifyContent: 'center',
}));

const BottomNavigationAction = styled(MuiBottomNavigationAction)({
  ' &.Mui-selected': {
    fontWeight: 600,
  },
});

// ----------------------------------------------------------------------

export default function InstructorPage() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { state } = useLocation();
  const ProgramList = useSelector((s) => s.ProgramList);
  const Profile = useSelector((s) => s.Profile);
  const query = new URLSearchParams(search);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('desc');
  const [tabValue, setTabValue] = useState('programs');
  const [searchKey, setSearchKey] = useState('');
  const [current, setCurrent] = useState('Published');
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const handleTabChange = (event, newValue) => {
    console.log(newValue);
    if (newValue == 0) {
      setCurrent('Published');
    } else {
      setCurrent('Draft');
    }
  };
  useEffect(() => {
    dispatch(getAllPrograms());
    console.log(ProgramList.Programs);
  }, []);
  let programs =
    ProgramList?.Programs.filter((item) => {
      if (current == 'Published') {
        return item.IsDraft == false && item.IsDeleted == false && item.IsArchived == false;
      }
      if (current == 'Draft') {
        return item.IsDraft == true && item.IsDeleted == false;
      }
    }) || [];
  programs = searchKey ? searchItemByKey(programs, ['Title'], searchKey) : programs;
  const handleCreateProgram = () => {
    const shouldShowVideo = localStorage.getItem('showCreateProgramVideo');
    if (shouldShowVideo !== 'false') {
      setVideoDialogOpen(true);
    } else {
      dispatch({
        type: 'INIT_NEW_PROGRAM',
        payload: {},
      });
      navigate('/createProgram');
    }
  };
  return (
    <Page title=" Simplified Online Fitness Training ">
      <Container>
        <Header>
          <InstructorHeader title={Profile.profileName || Profile.name} />
          {programs.length == 0 && !searchKey ? (
            ''
          ) : (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder={'Search by program'}
                onChange={(e) => setSearchKey(e.target.value)}
                InputProps={{
                  sx: { height: 48 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <Iconify
                          icon={'eva:search-fill'}
                          width={24}
                          height={24}
                          color="text.secondary"
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ px: 2 }}
              />
              <BoxStyle
                sx={{ pt: 3, px: 2 }}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <ButtonBase
                  variant="text"
                  color="primary"
                  onClick={handleCreateProgram}
                  sx={{
                    color: 'primary.main',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 18,
                      color: 'primary.main',
                    }}
                  >
                    Create program
                  </Typography>
                </ButtonBase>
                <Box
                  display="flex"
                  alignItems="center"
                  onClick={() => setSortOrder(sortOrder == 'desc' ? 'asc' : 'desc')}
                >
                  <Iconify
                    icon="ic:round-sort"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  &nbsp;
                  <Typography variant="body1">
                    Sort:
                    {sortOrder == 'desc' ? 'Newest' : 'oldest'}
                  </Typography>
                </Box>
              </BoxStyle>
            </Box>
          )}
        </Header>
        <Content style={{ paddingTop: 0, position: 'relative' }}>
          {programs.length == 0 && !searchKey ? (
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              px={2}
              width={'100%'}
              height={'100%'}
              pb={8}
            >
              <Box
                width={'100%'}
                display={'flex'}
                flexDirection="column"
                alignItems={'center'}
              >
                {current != 'Draft' && (
                  <img
                    src={'/images/instructor/instructorNoProgram.png'}
                    style={{
                      alignSelf: 'center',
                      width: 120,
                      height: 120,
                    }}
                  />
                )}
                <Box mt={current == 'Draft' ? -4 : 1}>
                  <Typography
                    variant="body1"
                    align={'center'}
                    sx={{ fontWeight: 550 }}
                    color="text.secondary"
                  >
                    {current == 'Draft' ? 'No drafts' : ''}
                  </Typography>
                  <Typography
                    variant="body1"
                    align={'center'}
                    sx={{ maxWidth: 280 }}
                    color="text.secondary"
                  >
                    {current == 'Draft' ? '' : 'No available programs, create or unarchive.'}
                  </Typography>
                </Box>
                {current !== 'Draft' && programs.length == 0 && (
                  <Button
                    variant="text"
                    sx={{
                      display: 'flex',

                      justifyContent: 'space-between',
                    }}
                    onClick={handleCreateProgram}
                  >
                    Create program
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box
              position="relative"
              paddingBottom={16}
            >
              <InstructorPrograms programs={orderBy(programs, (i) => new Date(i.createdAt), [sortOrder])} />
            </Box>
          )}
          {programs.length ? (
            <Box
              py={4}
              height={'100%'}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'flex-end'}
            >
              <Typography
                color={'text.secondary'}
                align="center"
              >
                {programs.length} Total programs
              </Typography>
            </Box>
          ) : (
            ''
          )}
        </Content>
        <FooterBase>
          <BottomNavigation
            sx={{
              borderTop: '1px solid #E1E7F0',
              borderRadius: '24px 24px 0px 0px',
              paddingTop: '12px',
              paddingBottom: '12px',
              height: 'auto',
            }}
            showLabels
            value={tabValue}
            onChange={(event, newValue) => {
              setTabValue(newValue);
              if (newValue == 'program') {
                navigate('/instructor', { replace: true });
              } else if (newValue == 'library') {
                navigate('/library', { replace: true });
              } else {
                navigate('/clientView', { replace: true });
              }
            }}
          >
            <BottomNavigationAction
              label="Programs"
              value="programs"
              sx={[
                {
                  '&.MuiBottomNavigationAction-root': {
                    color: (theme) => theme.palette.primary.main,
                  },

                  '&.Mui-selected': {
                    color: (theme) => theme.palette.primary.main,
                  },
                },
              ]}
              icon={<ProgramIcon />}
            />
            <BottomNavigationAction
              label="Clients"
              value="clients"
              sx={[
                {
                  '&.MuiBottomNavigationAction-root': {
                    color: (theme) => theme.palette.text.secondary,
                  },
                  '&.Mui-selected': {
                    color: (theme) => theme.palette.primary.main,
                  },
                },
              ]}
              icon={<ClientIcon sx={{ fontSize: 28 }} />}
            />

            <BottomNavigationAction
              label="Library"
              value="library"
              sx={[
                {
                  '&.MuiBottomNavigationAction-root': {
                    color: (theme) => theme.palette.text.secondary,
                  },
                  '&.Mui-selected': {
                    color: (theme) => theme.palette.primary.main,
                  },
                },
              ]}
              icon={<DbIcon sx={{ fontSize: 24 }} />}
            />
          </BottomNavigation>
        </FooterBase>
      </Container>
      <VideoDialog
        open={videoDialogOpen}
        onClose={() => {
          setVideoDialogOpen(false);
          dispatch({
            type: 'INIT_NEW_PROGRAM',
            payload: {},
          });
          navigate('/createProgram');
        }}
      />
    </Page>
  );
}

const PopupVideo = () => {
  return (
    <Box>
      <Typography>PopupVideo</Typography>
    </Box>
  );
};
