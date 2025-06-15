import { Box, Typography, Avatar, Grid, IconButton } from '@mui/material';
import moment from 'moment';
import Iconify from '../Iconify';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { deleteLog } from 'src/redux/actions/ProgressLogs';
import { useSelector } from 'react-redux';
import CircularStatic from '../progress/Circular';
import _ from 'lodash';
import { getFileFormat } from 'src/utils/getFileFormat';
import { getThumbnailOfLogs } from 'src/utils/convertToLink';
import { useNavigate } from 'react-router';
import ImageWithFallback from '../Labs/ImageWithFallback';
const MessageCard = ({
  name,
  profilePic,
  createdAt,
  message,
  media,
  createdBy,
  type,
  pendingSync,
  _id,
  fetchAllLogs,
  onDeleteLog,
}) => {
  const navigate = useNavigate();
  const { showConfirmationModal } = useConfirmationModalContext();
  const Profile = useSelector((s) => s.Profile);
  const deleteLogItem = (id) => {
    showConfirmationModal('Are you sure?', `You are going to delete this log message`, 'Delete').then((res) => {
      if (res) {
        onDeleteLog && onDeleteLog(id);
        deleteLog(id).then((response) => {});
      }
    });
  };

  return (
    <Box
      width={'100%'}
      mb={2}
      sx={{
        border: type == 'Instructor' ? '1px solid #6D7B8F' : '1px solid #FB8500',
        p: 2,
        borderRadius: 1,
        borderColor: type == 'Instructor' ? '#6D7B8F' : '#FB8500',
        borderLeftWidth: 6,
      }}
    >
      <Box>
        <Box
          width={'100%'}
          pr={1}
          display={'flex'}
          flexDirection={'column'}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            {/* {Profile._id == createdBy && (
                            <Iconify
                                onClick={() => deleteLogItem(_id)}
                                icon={'fluent:delete-12-regular'}
                                sx={{ color: 'error.main', fontSize: 18 }}
                            />
                        )} */}
            <Box
              display={'flex'}
              alignItems={'center'}
            >
              <Avatar
                sx={{
                  height: 40,
                  width: 40,
                  mr: 1,
                }}
                src={profilePic}
              />

              <Typography
                sx={{
                  fontWeight: '500',
                  textTransform: 'capitalize',
                }}
                variant="body1"
              >
                {name}
              </Typography>
            </Box>
            {/* <Box
              bgcolor={type == !'Instructor' ? '#FFAB4C66' : '#F5F7FA'}
              p={0.5}
              fontSize={'14px'}
              fontWeight={'bold'}
              color={type == !'Instructor' ? '#FB8500' : '#6D7B8F'}
              border={`1px solid ${type == '!Instructor' ? '#FB8500' : '#6D7B8F'}`}
              px={2}
              borderRadius={1}
            >
              {type == !'Instructor' ? 'Client' : 'Trainer'}
            </Box> */}
          </Box>
          <Typography sx={{ mt: 1.5 }}>{message}</Typography>

          {media?.length || pendingSync?.length ? (
            <Box
              my={2}
              borderRadius={1}
              overflow={'hidden'}
            >
              <Grid
                container
                spacing={0.5}
              >
                {(media?.length > 4 ? media.slice(0, 3) : media).map((i, index) => (
                  <Grid
                    item
                    xs={getGridValue(media?.length, index)}
                  >
                    <Box
                      bgcolor={'#f0f0f0'}
                      width={'100%'}
                      paddingBottom={'66%'}
                      position={'relative'}
                      justifyContent={'center'}
                      onClick={() =>
                        navigate('/media/view', {
                          state: {
                            file: media,
                            index: index,
                            comment: message,
                          },
                        })
                      }
                    >
                      <ImageWithFallback
                        src={getFileFormat(i) == 'video' ? getThumbnailOfLogs(i) : i}
                        style={{ position: 'absolute', width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                      {getFileFormat(i) == 'video' ? (
                        <IconButton sx={{ position: 'absolute', top: 'calc(50% - 24px)', left: 'calc(50% - 24px)' }}>
                          <Iconify
                            icon={'carbon:play-filled'}
                            style={{ fontSize: 48 }}
                          />
                        </IconButton>
                      ) : (
                        ''
                      )}
                    </Box>
                  </Grid>
                ))}
                {media?.length > 4 ? (
                  <Grid
                    item
                    xs={6}
                  >
                    <Box
                      bgcolor={'#f0f0f0'}
                      width={'100%'}
                      paddingBottom={'66%'}
                      position={'relative'}
                    >
                      <Box
                        position={'absolute'}
                        width={'100%'}
                        height={'100%'}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        onClick={() =>
                          navigate('/media/view', {
                            state: {
                              file: media,
                              index: 0,
                              comment: message,
                            },
                          })
                        }
                      >
                        <Typography variant="subtitle1">+{media?.length - 3} media</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ) : (
                  ''
                )}

                {pendingSync?.length ? (
                  <Grid
                    item
                    xs={12}
                  >
                    <Box
                      bgcolor={'#f0f0f0'}
                      width={'100%'}
                      height={150}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      flexDirection={'column'}
                    >
                      <CircularStatic
                        value={(_.sumBy(pendingSync, 'progress') || 1) / pendingSync?.length}
                        size={60}
                      />
                      <Typography sx={{ mt: 1 }}>Upload {pendingSync?.length} media</Typography>
                    </Box>
                  </Grid>
                ) : (
                  ''
                )}

                {/* <Grid item xs={6}>
                             <Box bgcolor={"red"} width={"100%"} height={100}></Box>
                            </Grid>
                            <Grid item xs={6}>
                             <Box bgcolor={"red"} width={"100%"} height={100}></Box>
                            </Grid> */}
              </Grid>
            </Box>
          ) : (
            ''
          )}
          <Box
            width={'100%'}
            display={'flex'}
            mt={1}
          >
            <Typography
              color={'text.secondary'}
              variant="body2"
            >
              {moment(createdAt).format('hh:mm a | DD MMM YYYY')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const getGridValue = (lenght, index) => {
  console.log(lenght, index);
  if (lenght == 1) {
    return 12;
  } else if (lenght == 2) {
    return 6;
  } else if (lenght == 3 && index == 2) {
    return 12;
  } else return 6;
};
export default MessageCard;
