import * as React from 'react'
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 32,
    height: 32,
    mr: 1,
    border: `2px solid ${theme.palette.background.paper}`,
}))

export default function BadgeAvatars({ src }) {
    return (
        // <StyledBadge
        //     overlap="circular"
        //     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        //     variant="dot"
        // >
        <SmallAvatar sizes="small" alt="Remy Sharp" src={src} />
        // </StyledBadge>
    )
}
