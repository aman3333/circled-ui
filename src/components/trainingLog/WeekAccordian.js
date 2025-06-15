import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import _, { transform } from 'lodash';
import { Box, Stack } from '@mui/material';
import TrackVisibility from 'react-visibility-sensor';
import MessageCard from 'src/components/client/MessageCard';
const WeekAccordian = ({ weekLogs, week, fetchAllLogs, Profile, ClientData, Plan, navigate, markLogasread }) => {
  const [expanded, setExpanded] = useState(false);
  const groupedByDay = _.groupBy(weekLogs, (i) => i.day);
  return (
    <Accordion
      sx={{
        'border': '1.5px solid #C3CBD9',
        'borderRadius': 1,
        'overflow': 'hidden',
        'mb': 2,
        '&.Mui-expanded': {
          margin: 0,
          mb: 2,
        },
      }}
    >
      <AccordionSummary
        onClick={() => setExpanded(!expanded)}
        sx={{
          'pl': 1,
          'pb': 0,
          'minHeight': 40,
          '&.Mui-expanded': {
            minHeight: 62,
            maxHeight: 62,
            mb: 0,
            pb: 0,
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          <Typography variant="subtitle1">Week {Number(week) + 1}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pl: 2, pr: 0, pt: 0, mt: -2 }}>
        <Stack
          direction="column"
          spacing={0}
        >
          {Object.keys(groupedByDay).map((item) => {
            return (
              <DayAccordian
                dayLogs={groupedByDay[item]}
                day={item}
                fetchAllLogs={fetchAllLogs}
                Profile={Profile}
                ClientData={ClientData}
                Plan={Plan}
                navigate={navigate}
                markLogasread={markLogasread}
              />
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default WeekAccordian;

const DayAccordian = ({ dayLogs, day, fetchAllLogs, Profile, ClientData, Plan, navigate, markLogasread }) => {
  const [expanded, setExpanded] = useState(false);
  const sortedByExercise = _.sortBy(dayLogs, (i) => i.exercise);
  console.log(sortedByExercise);
  return (
    <Accordion
      sx={{
        'boxShadow': 'none',
        'borderBottom': 0,
        'mt': -1,
        '&.Mui-expanded': {
          boxShadow: 'none',
        },
        '&::before': {
          height: '0px',
          backgroundColor: 'transparent',
        },
      }}
    >
      <AccordionSummary
        onClick={() => setExpanded(!expanded)}
        sx={{
          'pl': 0,
          'margin': 0,
          'padding': 0,

          'maxHeight': 40,
          'borderBottom': '0',

          '&.Mui-expanded': {
            maxHeight: 40,
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          <Typography variant="subtitle1">Day {Number(day) + 1}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ mt: -2 }}>
        {sortedByExercise.map((item) => {
          return (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  onClick={() => {
                    Profile.type == 'Instructor'
                      ? navigate(`/clientProfile/${ClientData.Program._id}/workoutDay`, {
                          state: {
                            open: true,
                            week: item.week,
                            day: item.day,
                            exercise: item.exercise,
                          },
                        })
                      : navigate(`/myWorkoutCalendar/workoutDay`, {
                          state: {
                            open: true,
                            week: item.week,
                            day: item.day,
                            exercise: item.exercise,
                          },
                        });
                  }}
                  sx={{
                    fontWeight: '600',
                  }}
                >
                  Exercise {Number(item.exercise) + 1} : {item.logs[0].title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  onClick={() => {
                    Profile.type == 'Instructor'
                      ? navigate(`/clientProfile/${ClientData.Program._id}/workoutDay`, {
                          state: {
                            open: true,
                            week: item.week,
                            day: item.day,
                            exercise: item.exercise,
                          },
                        })
                      : navigate(`/myWorkoutCalendar/workoutDay`, {
                          state: {
                            open: true,
                            week: item.week,
                            day: item.day,
                            exercise: item.exercise,
                          },
                        });
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  View{' '}
                  <Iconify
                    sx={{ transform: 'rotate(90deg)' }}
                    icon={'material-symbols:arrow-insert-rounded'}
                  />
                </Typography>
              </Box>
              <Stack
                direction="column"
                spacing={2}
                mt={2}
              >
                {item.logs.map((l) => (
                  <TrackVisibility onChange={() => !l.IsRead && markLogasread(l._id)}>
                    <Box>
                      {Profile.type == 'Instructor' ? (
                        <MessageCard
                          {...l}
                          {...item}
                          fetchAllLogs={fetchAllLogs}
                          name={
                            ClientData.UserId._id == l.createdBy
                              ? ClientData.UserId?.name
                              : Profile.profileName || Profile.name
                          }
                          profilePic={
                            ClientData.UserId._id == l.createdBy ? ClientData.UserId?.profilePic : Profile.profilePic
                          }
                        />
                      ) : (
                        <MessageCard
                          orderId={Profile.type == 'Instructor' ? ClientData._id : Plan.currentPlan}
                          {...l}
                          {...item}
                          fetchAllLogs={fetchAllLogs}
                          name={
                            Plan.Instructor._id == l.createdBy
                              ? Plan.Instructor?.name
                              : Profile.name || Profile.profileName || Profile.name
                          }
                          profilePic={
                            Plan.Instructor._id == l.createdBy ? Plan.Instructor?.profilePic : Profile.profilePic
                          }
                        />
                      )}
                    </Box>
                  </TrackVisibility>
                ))}
              </Stack>
            </>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
