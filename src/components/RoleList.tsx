
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

export type Role = {
  id: string;
  name: string;
};

interface RoleListProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const RoleList = ({ roles, setRoles }: RoleListProps) => {
  const [newRoleName, setNewRoleName] = useState('');
  const { toast } = useToast();

  const addRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Role name required",
        description: "Please enter a role name",
        variant: "destructive"
      });
      return;
    }

    if (roles.some(role => role.name.toLowerCase() === newRoleName.trim().toLowerCase())) {
      toast({
        title: "Duplicate role",
        description: "This role already exists",
        variant: "destructive"
      });
      return;
    }

    setRoles([
      ...roles,
      {
        id: Date.now().toString(),
        name: newRoleName.trim()
      }
    ]);
    setNewRoleName('');
  };

  const removeRole = (id: string) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addRole();
    }
  };

  // Role suggestions for quick addition
  const roleSuggestions = [
    'Team Lead', 'Developer', 'Designer', 'Tester', 'Product Owner', 'Scrum Master',
    'Frontend', 'Backend', 'DevOps', 'QA', 'UX Researcher'
  ];

  return (
    <div className="team-card">
      <h2 className="text-xl font-semibold mb-4 text-team-indigo">Roles</h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add role..."
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={addRole} className="bg-team-indigo hover:bg-team-indigo/90">
          <PlusCircle size={18} className="mr-1" /> Add
        </Button>
      </div>

      {roles.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {roleSuggestions.slice(0, 6).map((suggestion, index) => (
              <Badge 
                key={index} 
                className="cursor-pointer bg-team-indigo/10 text-team-indigo hover:bg-team-indigo hover:text-white"
                onClick={() => {
                  setNewRoleName(suggestion);
                  setTimeout(() => addRole(), 100);
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {roles.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No roles added yet</p>
          </div>
        ) : (
          roles.map(role => (
            <div key={role.id} className="role-item group">
              <div className="bg-team-indigo/10 p-2 rounded-full">
                <Tag size={18} className="text-team-indigo" />
              </div>
              <span className="flex-1 font-medium">{role.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRole(role.id)}
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

export default RoleList;
