import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography ,Box, Stack} from '@mui/material';
import Content from 'src/components/Layout/Content'
import Container from 'src/components/Layout/Container'
import Logo from 'src/assets/figgslogo.png'
import Athlete from 'src/assets/onboarding/Athlete';
import Instructor from 'src/assets/onboarding/Instructor';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router'
const ModeSelection = ({open,state}) => {


    const Onboarding=useSelector((state)=>state.Onboarding)
    const navigate = useNavigate();
    const handleClose = () => {
      
    };

    const handleSelection = (mode) => {
        if(Onboarding.authType=="gmail")
       { navigate(
        mode == 'Athlete'
                ? '/onboarding/client/info'
                : '/onboarding/preview',
            { state }
        )}
        else{
          navigate(
                                                mode == 'Athlete'
                                                    ? '/onboarding/client'
                                                    : '/onboarding',
                                                { state }
                                            )
        }
       
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
        >
<Container>
    <Content>
          
            <DialogContent>
            <Box display={'flex'} justifyContent="flex-start">
                                <img src={Logo} height={42} />
                            </Box>
                   <Stack spacing={4} sx={{ mt: 4 }}>         
                <Typography variant="h2" align='center' gutterBottom>
                    Create an account
                </Typography>

                <Box sx={{border:'2px solid rgba(195, 203, 217, 1)',borderRadius:1,p:4}}
                
                onClick={()=>handleSelection('Athlete')}
                >
<center>
                 

                    <Athlete />
                 
                    <Typography variant="h4" sx={{mt:2}} color={"text.secondary"} align='center' >
                        As athlete
                    </Typography>
                    </center>
                </Box>
                <Box sx={{border:'2px solid rgba(195, 203, 217, 1)',borderRadius:1,p:4}} 
                onClick={()=>handleSelection('Instructor')}
                >
<center>
                 

                    <Instructor />
                 
                    <Typography variant="h4" sx={{mt:2}} color={"text.secondary"} align='center' >
                        As trainer
                    </Typography>
                    </center>
                </Box>
                </Stack>
                
            </DialogContent>
            </Content>
            </Container>
        </Dialog>
    );
};

export default ModeSelection;