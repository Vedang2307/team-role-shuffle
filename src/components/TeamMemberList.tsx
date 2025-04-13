
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export type TeamMember = {
  id: string;
  name: string;
  assignedRole?: string;
};

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

const TeamMemberList = ({ teamMembers, setTeamMembers }: TeamMemberListProps) => {
  const [newMemberName, setNewMemberName] = useState('');
  const { toast } = useToast();

  const addTeamMember = () => {
    if (!newMemberName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a team member name",
        variant: "destructive"
      });
      return;
    }

    if (teamMembers.some(member => member.name.toLowerCase() === newMemberName.trim().toLowerCase())) {
      toast({
        title: "Duplicate name",
        description: "This team member already exists",
        variant: "destructive"
      });
      return;
    }

    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now().toString(),
        name: newMemberName.trim()
      }
    ]);
    setNewMemberName('');
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTeamMember();
    }
  };

  return (
    <div className="team-card">
      <h2 className="text-xl font-semibold mb-4 text-team-purple">Team Members</h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add team member..."
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={addTeamMember} className="bg-team-purple hover:bg-team-purple/90">
          <PlusCircle size={18} className="mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {teamMembers.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No team members added yet</p>
          </div>
        ) : (
          teamMembers.map(member => (
            <div key={member.id} className="team-member group">
              <div className="bg-team-purple/10 p-2 rounded-full">
                <User size={18} className="text-team-purple" />
              </div>
              <span className="flex-1 font-medium">{member.name}</span>
              {member.assignedRole && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {member.assignedRole}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTeamMember(member.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamMemberList;
