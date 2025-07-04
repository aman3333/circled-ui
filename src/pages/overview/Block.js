import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Paper, CardHeader, Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

Block.propTypes = {
  children: PropTypes.any.isRequired,
  sx: PropTypes.object,
  title: PropTypes.string,
};

export function Block({ title, sx, children }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        
      }}
    >
      {title && <CardHeader title={title} />}
      <Box
        sx={{
          p: 5,
          minHeight: 180,
          ...sx,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

// ----------------------------------------------------------------------

Label.propTypes = {
  title: PropTypes.string.isRequired,
};

export function Label({ title }) {
  return (
    <Typography variant="overline" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
      {title}
    </Typography>
  );
}
