import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// @mui
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
//
import Filled from './Filled';
import Standard from './Standard';
import Outlined from './Outlined';

// ----------------------------------------------------------------------

const TEXTFIELDS = [
  // { name: 'Filled', component: <Filled /> },
  // { name: 'Standard', component: <Standard /> },
  { name: 'Standard', component: <Outlined /> },
];

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15),
}));

export default function TextFieldComponent() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // ----------------------------------------------------------------------

  return (
    <Page title="Components: TextField">
      <RootStyle>
        <Box
          sx={{
            pt: 6,
            pb: 1,
            mb: 10,
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
          }}
        >
          <Container>
            <HeaderBreadcrumbs
              heading="TextField"
              links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'TextField' }]}
              moreLink="https://mui.com/components/text-fields"
            />
          </Container>
        </Box>

        <Container>
          <form noValidate autoComplete="off">
            <TabContext value={value}>
              <TabList onChange={handleChange}>
                {TEXTFIELDS.map((tab, index) => (
                  <Tab disableRipple key={tab.name} label={tab.name} value={String(index + 1)} />
                ))}
              </TabList>

              {TEXTFIELDS.map((tab, index) => (
                <TabPanel key={tab.name} value={String(index + 1)} sx={{ mt: 5 }}>
                  {tab.component}
                </TabPanel>
              ))}
            </TabContext>
          </form>
        </Container>
      </RootStyle>
    </Page>
  );
}
