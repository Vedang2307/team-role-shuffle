
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  CheckCircle2,
  X
} from 'lucide-react';
import { TeamMember } from './TeamMemberList';
import { Role } from './RoleList';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SavedTeam {
  id: string;
  name: string;
  teamMembers: TeamMember[];
  roles: Role[];
  date: string;
}

interface SavedTeamsProps {
  currentTeamMembers: TeamMember[];
  currentRoles: Role[];
  loadTeam: (members: TeamMember[], roles: Role[]) => void;
}

const SavedTeams = ({ 
  currentTeamMembers, 
  currentRoles,
  loadTeam 
}: SavedTeamsProps) => {
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>(() => {
    const saved = localStorage.getItem('savedTeams');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTeamName, setNewTeamName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const saveCurrentTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this team configuration",
        variant: "destructive"
      });
      return;
    }

    if (currentTeamMembers.length === 0 || currentRoles.length === 0) {
      toast({
        title: "Empty configuration",
        description: "Add team members and roles before saving",
        variant: "destructive"
      });
      return;
    }

    const newTeam: SavedTeam = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
      teamMembers: currentTeamMembers,
      roles: currentRoles,
      date: new Date().toLocaleDateString()
    };

    const updatedTeams = [...savedTeams, newTeam];
    setSavedTeams(updatedTeams);
    localStorage.setItem('savedTeams', JSON.stringify(updatedTeams));
    setNewTeamName('');
    
    toast({
      title: "Team saved!",
      description: `"${newTeamName.trim()}" has been saved successfully.`,
    });
  };

  const deleteTeam = (id: string) => {
    const updatedTeams = savedTeams.filter(team => team.id !== id);
    setSavedTeams(updatedTeams);
    localStorage.setItem('savedTeams', JSON.stringify(updatedTeams));
    
    toast({
      title: "Team deleted",
      description: "The team configuration has been removed",
    });
  };

  const handleLoadTeam = (team: SavedTeam) => {
    loadTeam(team.teamMembers, team.roles);
    setIsDialogOpen(false);
    
    toast({
      title: "Team loaded",
      description: `"${team.name}" has been loaded successfully`,
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      <div className="flex gap-2 flex-1 w-full">
        <Input
          placeholder="Save current team as..."
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && saveCurrentTeam()}
        />
        <Button 
          onClick={saveCurrentTeam} 
          className="bg-team-teal hover:bg-team-teal/80 text-white"
        >
          <Save size={18} className="mr-1" /> Save
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">
            <FolderOpen size={18} className="mr-1 text-team-purple" /> 
            Load Saved Team
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Saved Teams</DialogTitle>
            <DialogDescription>
              Select a team configuration to load
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 py-2 pr-1">
            {savedTeams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved teams yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedTeams.map((team) => (
                  <div 
                    key={team.id} 
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{team.name}</h3>
                      <span className="text-xs text-muted-foreground">{team.date}</span>
                    </div>
                    
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>{team.teamMembers.length} members, {team.roles.length} roles</p>
                    </div>
                    
                    <div className="flex justify-between mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleLoadTeam(team)}
                      >
                        <CheckCircle2 size={16} className="mr-1 text-team-teal" /> 
                        Load
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteTeam(team.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t pt-3 mt-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setIsDialogOpen(false)}
            >
              <X size={16} className="mr-1" /> Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedTeams;
