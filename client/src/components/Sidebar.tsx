import { VStack, Box, Icon, Text, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaTasks, FaHashtag, FaChartPie } from 'react-icons/fa';
import ProfileDropdown from './ProfileDropdown';
import { useState } from 'react';
import attackingTitanIcon from '../assets/attacking_titan.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAotMode, setIsAotMode] = useState(false);

  const navItems = [
    {
      label: "Today's Tasks",
      icon: FaTasks,
      path: '/daily-tasks'
    },
    {
      label: 'Calendar View',
      icon: CalendarIcon,
      path: '/calendar'
    },
    {
      label: 'Performance Dashboard',
      icon: FaChartPie,
      path: '/dashboard'
    },
    {
      label: 'Tags',
      icon: FaHashtag,
      path: '/tags'
    }
  ];

  const handleThemeToggle = () => {
    // If we're already in AOT mode, just disable it immediately
    if (isAotMode) {
        setIsAotMode(false);
        return;
    }

    // Clean up any existing audio elements
    const existingAudio = document.querySelector('audio[data-aot-audio]');
    if (existingAudio instanceof HTMLAudioElement) {
        existingAudio.pause();
        existingAudio.remove();
        return;
    }

    const button = document.querySelector('[aria-label="Toggle Theme"]');
    const audio = new Audio('/src/assets/audio/eren_scream.mp3');
    audio.setAttribute('data-aot-audio', 'true');
    const mainContent = document.querySelector('#root');
    
    // Start earthquake animation immediately
    mainContent?.classList.add('shake-container');
    button?.classList.add('shake-animation');
    
    // Play audio
    audio.play();
    
    // Remove animations and toggle theme when audio ends
    audio.onended = () => {
        setTimeout(() => {
            button?.classList.remove('shake-animation');
            mainContent?.classList.remove('shake-container');
            setIsAotMode(true);
        }, 1500); // Keep the delay for smooth transition
    };
};

  return (
    <Box
      position="fixed"
      left={0}
      w={isCollapsed ? "80px" : "250px"}
      h="100vh"
      bg="gray.800"
      borderRight="1px"
      borderColor="gray.700"
      py={8}
      transition="width 0.3s ease"
      sx={{
        '& + *': {
          marginLeft: isCollapsed ? "80px" : "250px",
          transition: "margin-left 0.3s ease"
        }
      }}
    >
      <IconButton
        aria-label="Toggle Sidebar"
        icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        position="absolute"
        right="-12px"
        bottom="20px"
        transform="none"
        onClick={() => setIsCollapsed(!isCollapsed)}
        bg="gray.700"
        color="white"
        _hover={{ bg: 'gray.600' }}
        size="sm"
        zIndex={2}
      />
      <VStack spacing={6} align="stretch">
        <Box px={isCollapsed ? 4 : 8} mb={2}>
          <ProfileDropdown isCollapsed={isCollapsed} />
        </Box>

        <Box px={isCollapsed ? 4 : 8}>
          <Flex justify="center" align="center">
            <Tooltip
              label={isAotMode ? "Disable Attack on Titan Theme" : "Enable Attack on Titan Theme"}
              placement="right"
              hasArrow
            >
              <IconButton
                aria-label="Toggle Theme"
                icon={<img src={attackingTitanIcon} alt="Attack Titan" width="32" height="32" />}
                onClick={handleThemeToggle}
                bg={isAotMode ? 'red.600' : 'gray.700'}
                color={isAotMode ? 'white' : 'gray.400'}
                borderRadius="full"
                w="50px"
                h="50px"
                _hover={{ 
                  transform: 'rotateY(180deg)',
                  bg: isAotMode ? 'red.700' : 'gray.600'
                }}
                transition="all 0.6s"
                style={{ transformStyle: 'preserve-3d' }}
                position="relative"
              />
            </Tooltip>
          </Flex>
        </Box>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Flex
              key={item.path}
              align="center"
              px={isCollapsed ? 4 : 8}
              py={3}
              cursor="pointer"
              bg={isActive ? 'gray.700' : 'transparent'}
              color={isActive ? 'white' : 'gray.400'}
              _hover={{
                bg: 'gray.700',
                color: 'white'
              }}
              onClick={() => navigate(item.path)}
              justifyContent={isCollapsed ? "center" : "flex-start"}
            >
              <Icon
                as={item.icon}
                boxSize={5}
                mr={isCollapsed ? 0 : 4}
              />
              {!isCollapsed && <Text fontSize="md">{item.label}</Text>}
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;