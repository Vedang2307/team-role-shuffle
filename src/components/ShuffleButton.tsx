
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import { TeamMember } from './TeamMemberList';
import { Role } from './RoleList';
import { useToast } from '@/components/ui/use-toast';

interface ShuffleButtonProps {
  teamMembers: TeamMember[];
  roles: Role[];
  onShuffle: (shuffledMembers: TeamMember[]) => void;
}

const ShuffleButton = ({ teamMembers, roles, onShuffle }: ShuffleButtonProps) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const { toast } = useToast();

  const shuffleRoles = () => {
    if (teamMembers.length === 0) {
      toast({
        title: "No team members",
        description: "Add team members before shuffling",
        variant: "destructive"
      });
      return;
    }

    if (roles.length === 0) {
      toast({
        title: "No roles",
        description: "Add roles before shuffling",
        variant: "destructive"
      });
      return;
    }

    setIsShuffling(true);

    // Create a copy of team members to work with
    let shuffledMembers = [...teamMembers];
    
    // Create a copy of roles and handle case where there are more members than roles
    let rolesToAssign = [...roles];
    
    // If we have more members than roles, duplicate roles until we have enough
    while (rolesToAssign.length < shuffledMembers.length) {
      rolesToAssign = [...rolesToAssign, ...roles];
    }
    
    // Shuffle the roles
    rolesToAssign = shuffleArray(rolesToAssign.slice(0, shuffledMembers.length));
    
    // Visual shuffling effect with delays
    let count = 0;
    const maxIterations = 5;
    const interval = setInterval(() => {
      count++;
      
      if (count < maxIterations) {
        // Random intermediate shuffles for animation effect
        const tempRoles = shuffleArray([...rolesToAssign]);
        const tempMembers = shuffledMembers.map((member, index) => ({
          ...member,
          assignedRole: tempRoles[index]?.name
        }));
        
        onShuffle(tempMembers);
      } else {
        // Final assignment
        const finalMembers = shuffledMembers.map((member, index) => ({
          ...member,
          assignedRole: rolesToAssign[index]?.name
        }));
        
        onShuffle(finalMembers);
        clearInterval(interval);
        setIsShuffling(false);
        
        toast({
          title: "Roles assigned!",
          description: "Team roles have been randomly allocated",
        });
      }
    }, 200);
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  return (
    <Button
      onClick={shuffleRoles}
      disabled={isShuffling}
      className="gradient-button w-full text-lg py-6 my-4"
    >
      <Shuffle size={24} className={`mr-2 ${isShuffling ? 'animate-spin-slow' : ''}`} />
      {isShuffling ? 'Shuffling...' : 'Shuffle & Assign Roles'}
    </Button>
  );
};

export default ShuffleButton;
