
import React, { useState, useEffect } from 'react';
import TeamMemberList, { TeamMember } from '@/components/TeamMemberList';
import RoleList, { Role } from '@/components/RoleList';
import ShuffleButton from '@/components/ShuffleButton';
import SavedTeams from '@/components/SavedTeams';
import { Shuffle, Users, ListTodo } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [hasShuffled, setHasShuffled] = useState(false);

  // Handle shuffled results
  const handleShuffle = (shuffledMembers: TeamMember[]) => {
    setTeamMembers(shuffledMembers);
    setHasShuffled(true);
  };

  // Load team data from saved configuration
  const loadTeam = (members: TeamMember[], savedRoles: Role[]) => {
    setTeamMembers(members);
    setRoles(savedRoles);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <header className="max-w-5xl mx-auto mb-10 text-center">
        <div className="flex justify-center items-center gap-2">
          <Shuffle className="text-team-purple" size={32} />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-team-purple to-team-indigo bg-clip-text text-transparent">
            Team Role Allocator
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Add team members and roles, then shuffle to randomly assign roles to your team.
        </p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TeamMemberList teamMembers={teamMembers} setTeamMembers={setTeamMembers} />
          <RoleList roles={roles} setRoles={setRoles} />
        </div>

        <ShuffleButton 
          teamMembers={teamMembers} 
          roles={roles} 
          onShuffle={handleShuffle} 
        />

        {hasShuffled && teamMembers.some(m => m.assignedRole) && (
          <div className="team-card mb-6">
            <h2 className="text-xl font-semibold mb-4 text-team-orange flex items-center">
              <ListTodo className="mr-2" /> Results
            </h2>
            <div className="space-y-2">
              {teamMembers.map(member => (
                <div key={member.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-team-purple/10 p-2 rounded-full">
                      <Users size={18} className="text-team-purple" />
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <div className="bg-team-orange/10 text-team-orange px-3 py-1 rounded-full font-medium">
                    {member.assignedRole || "Unassigned"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-6" />
        
        <div className="mb-4">
          <SavedTeams
            currentTeamMembers={teamMembers}
            currentRoles={roles}
            loadTeam={loadTeam}
          />
        </div>

        <footer className="text-center text-muted-foreground text-sm mt-12">
          <p>Use this app to randomly assign roles to team members for projects, games, or activities.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
