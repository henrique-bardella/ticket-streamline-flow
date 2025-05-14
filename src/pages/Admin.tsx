
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import StyledButton from "@/components/StyledButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { User, UserRole } from "../types";
import { toast } from "sonner";

// Mock user data - in a real app this would come from an API
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Requester User',
    email: 'requester@example.com',
    role: 'requester',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Analyst User',
    email: 'analyst@example.com',
    role: 'analyst',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const Admin = () => {
  const { currentUser } = useAuth();
  const [users] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'requester' as UserRole
  });

  // Mock function to handle user edit
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  // Mock function to save user
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`User ${selectedUser?.name} updated`);
    setSelectedUser(null);
  };

  // Mock function to create user
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`User ${userForm.name} created`);
    setUserForm({
      name: '',
      email: '',
      role: 'requester'
    });
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Admin Panel" 
        description="Manage users and system settings"
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GlassCard>
            <h3 className="text-lg font-medium mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3">
                        <StyledButton 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </StyledButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard className="mb-6">
            <h3 className="text-lg font-medium mb-4">
              {selectedUser ? 'Edit User' : 'Create User'}
            </h3>
            <form onSubmit={selectedUser ? handleSaveUser : handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="Enter name"
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="Enter email"
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value) => setUserForm({ ...userForm, role: value as UserRole })}
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md">
                      <SelectItem value="requester">Requester</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2">
                  <StyledButton type="submit" fullWidth>
                    {selectedUser ? 'Save Changes' : 'Create User'}
                  </StyledButton>
                </div>
                {selectedUser && (
                  <div>
                    <StyledButton 
                      variant="outline" 
                      onClick={() => setSelectedUser(null)}
                      fullWidth
                    >
                      Cancel
                    </StyledButton>
                  </div>
                )}
              </div>
            </form>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-lg font-medium mb-4">System Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environment:</span>
                <span>Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current User:</span>
                <span>{currentUser?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="capitalize">{currentUser?.role}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
