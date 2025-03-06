import React, { ReactNode } from 'react';
import { SwipeableDrawer, Box } from '@mui/material';
import { useTheme } from 'next-themes';

type BottomSheetComponentProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
  open,
  onClose,
  children,
}) => {
  const {resolvedTheme} = useTheme();
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => { }}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: resolvedTheme === 'light' ? '#ffffff' :'#151820', 
        }
      }}
    >
      <Box
        className='dark:bg-dark-gray bg-white'
        sx={{
          height: 500,
          padding: 2,
          textAlign: 'center',
        }}
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
};

export default BottomSheetComponent;
