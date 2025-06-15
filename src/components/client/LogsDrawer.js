import {
  Avatar,
  Button,
  Box,
  Divider,
  SwipeableDrawer,
  TextField,
  Typography,
  IconButton,
  Badge,
  CircularProgress,
  ButtonBase,
} from '@mui/material';
import Send from 'src/assets/IconSet/Send';
import React, { useState, useEffect, forwardRef, useRef } from 'react';
import Log from 'src/assets/IconSet/LogFilled';
import InputBase from '@mui/material/InputBase';
import moment from 'moment';
import { addNewLog, fetchLogs, newUpload, deleteProgressLog } from 'src/redux/actions/ProgressLogs';

import MessageCard from './MessageCard';
import { useSelector } from 'react-redux';
import AddImage from 'src/assets/IconSet/AddImage';
import Iconify from '../Iconify';
import ObjectID from 'bson-objectid';

import useLocalStorage from 'src/hooks/useLocalStorage';
import { useNavigate } from 'react-router';
const days = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
function MuscleHighlighterDrawer(props, ref) {
  const [drawerOpen, setDrawerOpen] = useState(props.openLogs);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useLocalStorage(`logs-upload-${props.day}-${props.week}-${props.exerciseIndex}`, []);
  const [commentToUpload, setCommentToUpload] = useLocalStorage(`logs-upload-${props.orderId}`, []);
  const scrollRef = React.useRef(null);
  const Profile = useSelector((s) => s.Profile);
  const UploadableComments = useSelector((s) => s.ProgressLogs.logs);
  const Sync = useSelector((s) => s.Sync.media);
  let toBeUploaded = UploadableComments.filter(
    (i) =>
      i.isUploaded == false &&
      i.orderId == props.orderId &&
      i.day == props.day &&
      i.week == props.week &&
      i.exercise == props.exerciseIndex,
  );
  const toggleDrawer = (isOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (!isOpen && props.onClose) {
      props.onClose();
    }

    setDrawerOpen(isOpen);
  };
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  useEffect(() => {
    toBeUploaded.map((i) => {
      let pendingSync = Object.values(Sync).filter(
        (j) => j.orderId == i.orderId && i.day == j.day && i.week == j.week && j.exercise == i.exercise,
      );

      if (pendingSync.length) {
        return;
      }
      addNewLog({
        _id: i._id,
        exercise: i.exercise,
        orderId: i.orderId,
        message: i.message,
        day: i.day,
        week: i.week,
        media: i.media,
      }).then((res) => {
        deleteProgressLog(i._id);
        setComments([...comments, i]);
        props.setLatestLog && props.setLatestLog(res ? { ...res, createdBy: i.createdBy, media: i.media } : {});
        props.setLogCount && props.setLogCount(comments.length + 1);
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        // fetchLogs({
        //     id: i.orderId,
        //     week: i.week,
        //     day: i.day,
        //     exercise: i.exercise,
        // }).then((res) => {
        //     setComments(res)

        // })
      });
    });
  }, [UploadableComments]);

  const addLog = () => {
    //let newComments=[...commentToUpload]
    newUpload({
      _id: ObjectID().toString(),
      exercise: props.exerciseIndex,
      orderId: props.orderId,
      message: comment,
      day: props.day,
      week: props.week,
      name: Profile.name,
      profilePic: Profile.profilePic,
      type: Profile.type,
      createdBy: Profile,
      isUploaded: false,
    });
    //setCommentToUpload(newComments)
    setComment('');
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const onDeleteLog = (id) => {
    setComments(comments.filter((i) => i._id !== id));
  };

  const fetchAllLogs = () => {
    fetchLogs({
      id: props.orderId,
      week: props.week,
      day: props.day,
      exercise: props.exerciseIndex,
    })
      .then((res) => {
        props.setLatestLog(res.length ? res[res.length - 1] : {});
        setLoading(false);
        setComments(res);
        props.setLogCount && props.setLogCount(res.length);
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchAllLogs();
  }, [props.orderId, props.week, props.day, props.exerciseIndex]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current?.scrollHeight) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);
  }, [comments, drawerOpen, scrollRef]);

  useEffect(() => {
    setDrawerOpen(props.openLogs);
  }, [props.openLogs]);
  // useEffect(()=>{
  //     if(!drawerOpen&&props.onClose) {
  //         props.onClose()

  //     }
  // },[drawerOpen])

  return (
    <div>
      <SwipeableDrawer
        anchor={'bottom'}
        PaperProps={{
          style: {
            backgroundColor: '#F9FAFD',
            boxShadow: 'none',
            borderRadius: '8px 8px 0 0',
            padding: '20px',
            minHeight: '90vh',
            maxHeight: '90vh',
          },
        }}
        disableBackdropTransition
        open={drawerOpen}
        onClose={() => {
          toggleDrawer(false);
          props.onClose();
        }}
        onOpen={toggleDrawer(true)}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
        >
          <Log sx={{ fontSize: 20, mr: 0.5 }} />
          <Typography variant="h2">Training Log</Typography>
        </Box>
        <Box
          mt={2}
          ml={0}
        >
          <Typography
            component={'span'}
            sx={{ fontWeight: '500', textTransform: 'capitalize' }}
          >
            Exercise {props.exerciseIndex + 1}:{' '}
            <Typography
              component={'span'}
              color={'text.secondary'}
            >
              {props.Exercise?.[props.exerciseIndex]?.title || props?.title}
            </Typography>
            {/* Week {props.week + 1} : {days[props.day]} :{' '}
                        {
                            props?.Program?.ExercisePlan?.weeks[props.week]
                                ?.days[props.day]?.Title
                        }{' '}
                        | Exercise {props.exerciseIndex + 1} :{' '}
                        {props.Exercise?.[props.exerciseIndex]?.title ||
                            props?.title} */}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box
          height={'100%'}
          display={'flex'}
          flexDirection={'column'}
          flexGrow={1}
          overflow={'auto'}
          ref={scrollRef}
        >
          <Box
            display={'flex'}
            flexGrow={1}
            flexDirection={'column'}
          >
            {[...comments, ...toBeUploaded].length > 0 ? (
              [...comments, ...toBeUploaded].map((comment, index) => {
                let pendingSync = Object.values(Sync).filter(
                  (j) =>
                    j.orderId == props.orderId &&
                    props.day == j.day &&
                    props.week == j.week &&
                    j.exercise == props.exerciseIndex &&
                    j._id == comment._id,
                );
                return (
                  <MessageCard
                    fetchAllLogs={fetchAllLogs}
                    key={index}
                    _id={comment._id}
                    onDeleteLog={onDeleteLog}
                    name={comment.createdBy?.name}
                    profilePic={comment?.createdBy?.profilePic}
                    createdBy={comment.createdBy?._id}
                    createdAt={comment.createdAt}
                    message={comment.message}
                    media={comment.media}
                    type={comment.type}
                    pendingSync={pendingSync}
                  />
                );
              })
            ) : (
              <Box
                display={'flex'}
                flexGrow={1}
                justifyContent={'center'}
                alignItems={'center'}
              >
                {loading ? <CircularProgress /> : <Typography color={'text.secondary'}>No comments</Typography>}
              </Box>
            )}

            {/* <Box
              display={"flex"}
              flexGrow={1}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography color={"text.secondary"}>No comments</Typography>
            </Box> */}
          </Box>
        </Box>
        <Box
          display={'flex'}
          gap={1}
          alignItems={'center'}
          my={2}
        >
          <Avatar
            src={Profile.profilePic}
            sx={{ height: 32, width: 32 }}
            size={'large'}
          />

          <Typography
            variant="subtitle1"
            sx={{
              textTransform: 'capitalize',
            }}
          >
            {Profile.name}
          </Typography>
        </Box>
        <Box
          width={'100%'}
          sx={{
            border: '1.5px solid #C3CBD9',
            borderRadius: '8px',
            p: 2,
            backgroundColor: '#fff',
          }}
        >
          {/* <Avatar
                        src={Profile.profilePic}
                        sx={{ height: 40, width: 40 }}
                        size={'large'}
                    /> */}

          <Box>
            <InputBase
              multiline
              fullWidth
              minRows={3}
              maxRows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ width: '100%', border: 'none' }}
              placeholder="Write something"
            />
            <Box
              width={'100%'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'flex-end'}
            >
              <Iconify
                icon="fluent:image-add-20-regular"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                sx={{ fontSize: 28, color: 'text.primary' }}
              />
              <ButtonBase
                disabled={!comment}
                onClick={addLog}
                sx={{
                  ml: 2,
                  fontSize: 16,
                  color: !comment ? 'text.secondary' : 'primary.main',
                }}
              >
                Post
              </ButtonBase>
            </Box>
          </Box>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/* ,video/*"
            onChange={(e) =>
              navigate('/media/add', {
                state: {
                  file: e.target.files,
                  orderId: props.orderId,
                  Profile: Profile,
                  _id: ObjectID().toString(),
                  exercise: props.exerciseIndex,
                  day: props.day,
                  week: props.week,
                  comment: comment,
                  name: Profile.name,
                  profilePic: Profile.profilePic,
                  type: Profile.type,
                  createdBy: Profile,
                },
              })
            }
          />
        </Box>
      </SwipeableDrawer>
      <div
        onClick={() => {
          setDrawerOpen(true);
        }}
      >
        {' '}
        {props.children ? (
          props.children
        ) : (
          <IconButton
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={props.onClickLog || null}
          >
            <Badge
              badgeContent={comments.length}
              color="primary"
            >
              <Log sx={{ fontSize: 38, color: '#fff' }} />
            </Badge>
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                opacity: 1,
                fontSize: 14,
                mt: 0.5,
              }}
            >
              Training log
            </Typography>
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default forwardRef(MuscleHighlighterDrawer);
