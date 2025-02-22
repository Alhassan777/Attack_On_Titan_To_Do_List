import { VStack, Heading, SimpleGrid, Box, Text, Image, Select } from '@chakra-ui/react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import StatusCard from './StatusCard';

type StatusIcon = {
  status: 'free' | 'not_started' | 'in_progress' | 'finished';
  label: string;
  description: string;
};

type Logo = {
  id: string;
  label: string;
  icon: string;
};

const STATUS_OPTIONS: StatusIcon[] = [
  { 
    status: 'free', 
    label: 'Off Duty', 
    description: 'No orders today. But a soldier’s duty never truly ends'
  },
  { 
    status: 'not_started', 
    label: 'Mission Pending', 
    description: "Tasks assigned but not started yet. Shinzou wo Sasageyo!!"
  },
  { 
    status: 'in_progress', 
    label: 'Battle Underway', 
    description: 'Some tasks completed, but work remains. Susume!'
  },
  { 
    status: 'finished', 
    label: 'Mission Accomplished', 
    description: 'All tasks completed. You gave everything for this mission!!'
  }
];

const AVAILABLE_LOGOS: Logo[] = [
  {
    id: 'survey_corps',
    label: 'Survey Corps',
    icon: '/src/assets/survey_corps.png'
  },
  {
    id: 'military_police',
    label: 'Military Police',
    icon: '/src/assets/police.png'
  },
  {
    id: 'garrison',
    label: 'Garrison Regiment',
    icon: '/src/assets/garrison.png'
  },
  {
    id: 'training',
    label: 'Training Corps',
    icon: '/src/assets/training_corps.png'
  }
];

const CompletionStatusSection = () => {
  const [statusLogoMap, setStatusLogoMap] = useState<Record<string, string>>({});
  const toast = useToast();

  const handleLogoChange = (statusId: string, logoId: string) => {
    if (logoId === '') {
      setStatusLogoMap(prev => {
        const newMap = { ...prev };
        delete newMap[statusId];
        return newMap;
      });
      return;
    }

    setStatusLogoMap(prev => {
      const newMap = { ...prev };
      // Find if the logo is used by another status
      const existingStatusWithLogo = Object.entries(newMap).find(
        ([currentStatus, currentLogo]) => currentLogo === logoId && currentStatus !== statusId
      );

      // If logo is used, remove it from the previous status
      if (existingStatusWithLogo) {
        delete newMap[existingStatusWithLogo[0]];
      }

      // Assign the logo to the new status
      newMap[statusId] = logoId;
      return newMap;
    });
  };

  const getSelectedLogo = (statusId: string) => {
    const logoId = statusLogoMap[statusId];
    return AVAILABLE_LOGOS.find(logo => logo.id === logoId);
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md" color="white">Daily Task Progress</Heading>
      
      <SimpleGrid columns={4} spacing={4} alignItems="flex-start">
        {STATUS_OPTIONS.map((status) => (
          <StatusCard
            key={status.status}
            status={status}
            selectedLogo={getSelectedLogo(status.status)}
            onLogoChange={handleLogoChange}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default CompletionStatusSection;