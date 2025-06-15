// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemButton,
  Stack,
  ButtonBase,
  Divider,
  Typography,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { IconButtonAnimate, varFade } from '../animate';
import Iconify from '../Iconify';
import Label from '../Label';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import LightboxModal from 'src/components/LightBoxContainer';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { useNavigate } from 'react-router';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import SocialLink from '../instructor/SocialLink';
import SeeMoreSeeLess from '../common/SeeMoreSeeLess';
import ShowMoreText from 'react-show-more-text';
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 10px',
  maxWidth: 'xs',
  zIndex: 100,
  borderRadius: '0px 0px 8px 8px',
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  //zIndex: 100,
  backgroundColor: '#fff',
  //boxShadow: "0px 4px 54px #E1E7F0",
  // borderRadius: "0px 0px 8px 8px",
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

// ----------------------------------------------------------------------

export default function ProfileHeader({ setHeaderDependency, myInstructor, clientMyprofile, Profile }) {
  const [mini, setMini] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const minimize = () => {
    setMini(!mini);
    setTimeout(() => {
      setHeaderDependency(!mini);
    }, 300);
  };

  return (
    <BoxHeader>
      {
        <Box position={'relative'}>
          {Profile.banner ? (
            <Box
              position="relative"
              width="100%"
              height={Profile.banner ? '118px' : 90}
              bgcolor={Profile.banner ? '#fafafa' : '#fff'}
              borderRadius={'0px 0px 8px 8px'}
            >
              {Profile.banner ? (
                <LightboxModal image={Profile.banner}>
                  <img
                    style={{
                      width: '100%',
                      height: '118px',
                      objectFit: 'cover',
                      backgroundColor: '#fff',
                      borderRadius: '0px 0px 8px 8px',
                    }}
                    src={Profile.banner || '/images/profile-banner.png'}
                  />
                </LightboxModal>
              ) : (
                ''
              )}
            </Box>
          ) : (
            ''
          )}

          <Box
            width="100%"
            margin={Profile.banner ? '-8px' : '32px 0px 0px'}
            paddingLeft={3}
            paddingRight={3}
          >
            <Box
              display="flex"
              justifyContent={'space-between'}
              alignItems={'center'}
              width="100%"
            >
              <Box>
                <Box
                  sx={{
                    mr: 2,
                    bottom: -38,
                    left: 16,
                    zIndex: 101,
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '4px solid #fff',
                  }}
                >
                  <LightboxModal image={Profile.profilePic || '/images/dummyUser.png'}>
                    <Avatar
                      sx={{
                        width: '100%',
                        height: '100%',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        border: '3px solid #fff',
                      }}
                      src={Profile.profilePic || '/images/dummyUser.png'}
                    />
                  </LightboxModal>
                </Box>
              </Box>
              <Stack width="100%">
                <Stack
                  direction={'row'}
                  alignItems={'flex-end'}
                  flexGrow={1}
                  width={'100%'}
                  justifyContent={'space-between'}
                >
                  <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {Profile.profileName || Profile.name}
                    {/* <Typography color={'text.secondary'}>
                                            #{Profile.figgsId}
                                        </Typography> */}
                  </Typography>
                </Stack>
                <Typography
                  variant="body"
                  color="text.secondary"
                >
                  {Profile.expertise}
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Box
            width={'100%'}
            display={'flex'}
            sx={{ px: 4, paddingBottom: 3 }}
            justifyContent={'flex-end'}
          >
            {myInstructor ? (
              <></>
            ) : (
              // <Button
              //     variant="contained"
              //     color="primary"
              //     sx={{ height: 40, px: 2 }}
              //     onClick={() =>
              //         navigate('/messages')
              //     }
              // >
              //     <Iconify
              //         icon="jam:messages-alt"
              //         width={24}
              //         height={24}
              //         color="common.white"
              //     />
              //     &nbsp;&nbsp;Message
              // </Button>
              <Button
                variant="outlined"
                size={'small'}
                fullWidth
                sx={{ px: 4, height: 36, fontSize: 16, mt: 3 }}
                color={clientMyprofile ? 'secondary' : 'primary'}
                onClick={() => navigate('/instructor/editProfile')}
              >
                Edit profile
              </Button>
            )}
          </Box>
          {Profile.bio ? (
            <>
              <Divider sx={{ borderTopWidth: 8, borderColor: '#F5F7FA', mb: 2 }} />
              <Box
                width={'100%'}
                sx={{ px: 3, mb: 2 }}
              >
                <Typography
                  variant="h5"
                  color="text.primary"
                >
                  About
                </Typography>
                <ShowMoreText
                  more={
                    <Box mt={2}>
                      <Typography
                        variant="subtitle1"
                        color="primary.main"
                      >
                        View more
                      </Typography>
                    </Box>
                  }
                  less={
                    <Box mt={2}>
                      <Typography
                        variant="subtitle1"
                        color="primary.main"
                      >
                        View less
                      </Typography>
                    </Box>
                  }
                >
                  <Typography color="text.primary">{Profile.bio || 'No bio found'}</Typography>
                </ShowMoreText>
              </Box>
            </>
          ) : (
            ''
          )}
        </Box>
      }
    </BoxHeader>
  );
}
