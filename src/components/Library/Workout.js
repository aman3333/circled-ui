import { Box, Divider, IconButton, Stack, Typography, ButtonBase, Radio, Checkbox } from '@mui/material';
import Dumbell from 'src/assets/IconSet/Dumbell';
import React, { useMemo } from 'react';
import Iconify from '../Iconify';
import More from 'src/assets/IconSet/More';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from 'src/assets/IconSet/edit';
import Duplicate from 'src/assets/IconSet/Duplicate';
import { useConfirmationModalContext } from 'src/utils/Modal';
import RemoveIcon from 'src/assets/IconSet/Delete';
import ObjectID from 'bson-objectid';
import BottomAction from 'src/components/common/BottomAction';
import { addWorkout, deleteworkout } from 'src/redux/actions/figgsLibrary';
import { updateFeedback } from 'src/redux/actions/feedback';
import ShareIcon from 'src/assets/IconSet/Share';
import CopyIcon from 'src/assets/IconSet/CopyLink';
import moment from 'moment';
import { searchItemByKey } from 'src/utils/search.js';
export default function Workout(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workouts = useSelector((s) => s.Library.workouts);
  const workoutsList = useMemo(() => {
    if (props.searchKey == '') {
      return workouts;
    }
    return searchItemByKey(workouts, ['Title'], props.searchKey);
  }, [props.searchKey, workouts]);
  const { showConfirmationModal } = useConfirmationModalContext();
  const onChangeSelection = (workout) => {
    let existIndex = props?.selectedWorkout?.findIndex((i) => i._id == workout._id);
    let arr = [...props.selectedWorkout];
    if (existIndex > -1) {
      arr.splice(existIndex, 1);
    } else arr = [workout];

    props.setSelectedWorkout(arr);
  };

  const onDuplicate = (data) => {
    dispatch(
      addWorkout({
        ...data,

        _id: ObjectID().toString(),
      }),
    ).then(() => {
      dispatch(
        updateFeedback({
          snackbar: true,
          message: 'Duplicate workout created',
          severity: 'info',
        }),
      );
    });
  };

  const onDeleteWorkout = (id) => {
    showConfirmationModal('Are you sure?', `You are going to delete this workout`, 'Delete').then((res) => {
      if (res) {
        dispatch(deleteworkout(id));
      }
    });
  };
  return (
    <Box
      height={workoutsList.length == 0 ? '100%' : 'auto'}
      display={workoutsList.length == 0 ? 'flex' : 'block'}
      flexDirection={'column'}
      alignItems={'flex-start'}
    >
      {!props.slectionMode ? (
        <ButtonBase
          variant="text"
          color="primary"
          onClick={() => {
            navigate('/library/addworkout');
            props.setWorkoutData({
              Title: '',
              Exercise: [],
            });
          }}
          sx={{
            fontSize: 18,
            color: 'primary.main',
            my: 1,
          }}
        >
          {/* <Iconify icon="mingcute:add-fill" />
                    &nbsp;{' '} */}
          <Typography
            sx={{
              fontSize: 18,
              color: 'primary.main',
            }}
          >
            Create workout
          </Typography>
        </ButtonBase>
      ) : null}
      {/* {} */}

      {workoutsList.length == 0 ? (
        <Box
          flexGrow={1}
          width={'100%'}
          flexDirection={'column'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography
            align="center"
            color={'grey.600'}
          >
            No workouts saved.
            <br />
            Add from programs or create new.
          </Typography>
        </Box>
      ) : (
        workoutsList.map((workout, index) => (
          <VideoCard
            {...workout}
            onClick={() => {
              if (props?.slectionMode) return;
              props.setWorkoutData(workout);
              navigate(`/library/addworkout`);
            }}
            onDuplicate={() => onDuplicate(workout)}
            onChangeSelection={() => onChangeSelection(workout)}
            checked={props?.selectedWorkout?.find((i) => i._id == workout._id) ? true : false}
            onShare={() => {
              if (navigator.share) {
                navigator.share({
                  title: workout.Title,
                  url: `shared/workout/${workout._id}`,
                });
              }
            }}
            onDeleteWorkout={() => onDeleteWorkout(workout._id)}
            slectionMode={props?.slectionMode}
            selectedWorkout={props?.selectedWorkout}
            setSelectedWorkout={props?.setSelectedWorkout}
          />
        ))
      )}
    </Box>
  );
}

const VideoCard = ({
  _id,
  Title,
  createdAt,
  updatedAt,
  onClick,
  onDuplicate,
  onShare,
  slectionMode,
  Exercise,
  onDeleteWorkout,
  checked,
  Program,
  onChangeSelection,
}) => {
  const dispatch = useDispatch();
  const copy = () => {
    if (navigator && navigator.clipboard != undefined) {
      navigator.clipboard.writeText(`${window.location.origin}/shared/workout/${_id}`);
    }
    dispatch(
      updateFeedback({
        snackbar: true,
        severity: 'success',
        message: 'Link copied to clipboard',
      }),
    );
  };
  return (
    <>
      <Box
        py={2.5}
        onClick={onClick}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <Typography sx={{ textTransform: 'capitalize', fontWeight: 500, mb: 0.5 }}>{Title}</Typography>
            <Typography
              color={'text.secondary'}
              variant="body2"
              sx={{ textTransform: 'capitalize' }}
            >
              {updatedAt == createdAt
                ? `Added. ${moment(createdAt).format('DD MMM YYYY')}`
                : `Updated. ${moment(updatedAt).format('DD MMM YYYY')}`}
            </Typography>
            {/* {Program ? (
                        <Typography
                            variant="body2"
                            color={'text.secondary'}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {Program}
                        </Typography>
                    ) : (
                        ''
                    )} */}
          </Box>
          {slectionMode ? (
            <Checkbox
              color="primary"
              checked={checked}
              onChange={onChangeSelection}
            />
          ) : (
            <Box
              display={'flex'}
              alignItems={'center'}
            >
              <small>{Exercise.length}</small>&nbsp;&nbsp; <Dumbell />
              &nbsp;
              <Box onClick={(e) => e.stopPropagation()}>
                <BottomAction
                  items={[
                    {
                      title: 'Copy link',
                      icon: <CopyIcon sx={{ mr: 2 }} />,
                      onClick: copy,
                    },
                    {
                      title: 'Share',
                      icon: <ShareIcon sx={{ mr: 2 }} />,
                      onClick: onShare,
                    },
                    {
                      title: 'Edit workout',
                      icon: <EditIcon sx={{ mr: 2 }} />,
                      onClick: onClick,
                    },
                    {
                      title: 'Duplicate workout',
                      icon: <Duplicate sx={{ mr: 2 }} />,
                      onClick: onDuplicate,
                    },
                    {
                      title: 'Remove',
                      icon: (
                        <RemoveIcon
                          sx={{
                            mr: 2,
                            color: 'error.main',
                          }}
                        />
                      ),
                      onClick: onDeleteWorkout,
                      isError: true,
                    },
                  ]}
                  title={Title}
                >
                  <IconButton>
                    <More
                      sx={{
                        fontSize: 32,
                        color: 'text.primary',
                      }}
                    />
                  </IconButton>
                </BottomAction>
              </Box>
            </Box>
          )}
        </Stack>
      </Box>
      <Divider sx={{ borderColor: 'rgba(231, 238, 248, 1)' }} />
    </>
  );
};
