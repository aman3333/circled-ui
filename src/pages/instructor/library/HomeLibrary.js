// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect, useRef, useMemo } from 'react';
import { searchItemByKey } from 'src/utils/search.js';
// components
import Page from 'src/components/Page';
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
  BottomNavigation,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Iconify from 'src/components/Iconify';
import VideosElement from 'src/components/Library/Videos';
import WorkoutElement from 'src/components/Library/Workout';
import PublicVideosElement from 'src/components/Library/PublicVideos';
import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import Header from 'src/components/Layout/Header';
import FooterBase from 'src/components/Layout/Footer';
import ProgramIcon from 'src/assets/IconSet/Program';
import ClientIcon from 'src/assets/IconSet/Client';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import Footer from 'src/components/onboarding/footer';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useOutletContext } from 'react-router-dom';
import DbIcon from 'src/assets/IconSet/DB';

import ArrowLeft from 'src/assets/IconSet/ArrowLeft';

// ----------------------------------------------------------------------
const BottomNavigationAction = styled(MuiBottomNavigationAction)({
  ' &.Mui-selected': {
    fontWeight: 600,
  },
});

export default function CreateProgramPage({}) {
  const { state } = useLocation();
  const [tabValue, setTabValue] = useState('library');
  const [workoutData, setWorkoutData, currentTab, setCurrentTab] = useOutletContext();
  const navigate = useNavigate();

  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setSearchKey('');
  }, [currentTab]);
  return (
    <Page title=" Simplified Online Fitness Training ">
      <Container>
        <Header
          style={{
            borderRadius: '8px',
            backgroundColor: 'white',

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
              mb={2}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box
                display={'flex'}
                alignItems={'center'}
              >
                {' '}
                {/* <IconButton
                                    onClick={() => navigate('/')}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <ArrowLeft />
                                </IconButton> */}
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
                      color="text.primary"
                      sx={{
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}
                    >
                      Library
                    </Typography>
                  </Box>
                </Typography>{' '}
              </Box>{' '}
            </Box>
          </Box>
          <Box
            mt={0}
            px={2}
          >
            <TextField
              fullWidth
              placeholder={`Search by ${
                currentTab == 'videos' || currentTab == 'public' ? 'exercise name' : 'workout name'
              }`}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              InputProps={{
                sx: { height: 48 },
                endAdornment: (
                  <InputAdornment position="end">
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
            />
          </Box>
          <Box
            mt={2}
            px={2}
          >
            <Tabs
              value={currentTab}
              onChange={(e, v) => setCurrentTab(v)}
              aria-label="wrapped label tabs example"
              variant="fullWidth"
            >
              <Tab
                label={
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: currentTab == 'public' ? 'bold' : 300,
                    }}
                  >
                    {`Public`}
                  </Typography>
                }
                value="public"
              />
              <Tab
                label={
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: currentTab == 'videos' ? 'bold' : 300,
                    }}
                  >
                    {`Uploads`}
                  </Typography>
                }
                value="videos"
              />
              <Tab
                label={
                  <Typography
                    sx={{
                      fontWeight: currentTab == 'workouts' ? 'bold' : 300,
                      fontSize: 18,
                    }}
                  >
                    {`Workouts`}
                  </Typography>
                }
                value="workouts"
              />
            </Tabs>
          </Box>
          {/* <Box
                            width={'100%'}
                            height={8}
                            bgcolor={'#F5F7FA'}
                        ></Box> */}
        </Header>
        <Content withoutPadding={true}>
          <Box
            sx={{
              paddingTop: 2,
            }}
            height={'100%'}
          >
            <Box
              width={'100%'}
              bgcolor={'#000'}
              sx={{
                height: 8,
                background: '#F5F7FA',
              }}
            ></Box>
            <Box
              paddingLeft={2}
              paddingRight={2}
              pt={1}
              height={'100%'}
            >
              {currentTab == 'videos' ? (
                <VideosElement searchKey={searchKey} />
              ) : currentTab == 'public' ? (
                <PublicVideosElement searchKey={searchKey} />
              ) : (
                <WorkoutElement
                  searchKey={searchKey}
                  setWorkoutData={setWorkoutData}
                />
              )}
            </Box>
          </Box>
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
              if (newValue == 'programs') {
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
                    color: (theme) => theme.palette.text.secondary,
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
    </Page>
  );
}
