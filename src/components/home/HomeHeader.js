// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import DashboardDrawer from "../dashboard/DashboardDrawer";
import { Badge } from "@mui/material";
import MessageIcon from "../../assets/IconSet/Message";
import BellIcon from "../../assets/IconSet/Notification";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(() => ({
  height: "100%",
}));

const BoxStyle = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 16px",
  //marginBottom: 24,
  zIndex: 100,
  background: "#fff",
  boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
  borderRadius: "0px 0px 8px 8px",
}));

const InsideBoxStyle = styled(Box)(() => ({
  position: "absolute",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  paddingTop: 52,
  paddingBottom: 24,
  zIndex: 100,
  top: 0,
}));

// ----------------------------------------------------------------------

export default function InstructorHeader({ title, client, instructor }) {
  const navigate = useNavigate();
  const Profile = useSelector((state) => state.Profile);
  const count = useSelector((state) => state.Notifications.count);
  return (
    <BoxStyle>
      <Stack direction={"row"} spacing={1} alignItems="center">
        <DashboardDrawer client={client} instructor={instructor}>
          <Avatar
            src={Profile.profilePic}
            sx={{ mr: 1 }}
            width={39}
            height={39}
          />
        </DashboardDrawer>
        <Typography variant="body2" color="text.disabled">
          Welcome back 👋
          <Typography
            variant="h6"
            color="text.primary"
            sx={{ textTransform: "capitalize", marginBlockStart: -0.5 }}
          >
            {title}
          </Typography>
        </Typography>
      </Stack>
      <Stack direction={"row"} spacing={2}>
        {/* <IconButton
          size="small"
          onClick={() => navigate("/messages")}
          sx={{ color: "text.primary" }}
        >
          <MessageIcon sx={{ fontSize: 24, color: "red" }} />
        </IconButton> */}
        <IconButton
          size="small"
          onClick={() => navigate("/iNotifications")}
          sx={{ color: "text.primary" }}
        >
          <Badge badgeContent={count} color="primary">
            <BellIcon style={{ fontSize: 24 }} color="text.primary" />
          </Badge>
        </IconButton>
      </Stack>
    </BoxStyle>
  );
}
