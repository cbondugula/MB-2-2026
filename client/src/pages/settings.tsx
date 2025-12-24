import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Shield, Bell, Key, Globe, Moon, Sun, Save, Check } from "lucide-react";
import { Link } from "wouter";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    security: true,
    updates: false,
    marketing: false,
  });
  
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="hover:bg-gray-800" data-testid="back-button">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-400">Manage your account preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-800" data-testid="tab-profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-800" data-testid="tab-security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-800" data-testid="tab-notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-gray-800" data-testid="tab-preferences">
              <Globe className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-200">First Name</Label>
                    <Input 
                      id="firstName" 
                      defaultValue={user?.firstName || ""} 
                      className="bg-gray-800 border-gray-700 text-white"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-200">Last Name</Label>
                    <Input 
                      id="lastName" 
                      defaultValue={user?.lastName || ""} 
                      className="bg-gray-800 border-gray-700 text-white"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || ""} 
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-gray-200">Organization</Label>
                  <Input 
                    id="organization" 
                    placeholder="Your healthcare organization" 
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-organization"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-200">Role</Label>
                  <Input 
                    id="role" 
                    placeholder="e.g., Healthcare Developer, IT Administrator" 
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-role"
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  className="bg-[#76B900] hover:bg-[#8CC63F]"
                  data-testid="save-profile-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Key className="w-5 h-5 text-[#76B900]" />
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Switch 
                    checked={twoFactor} 
                    onCheckedChange={setTwoFactor}
                    data-testid="switch-2fa"
                  />
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-4">
                  <h3 className="font-medium text-white">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-200">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      className="bg-gray-800 border-gray-700 text-white"
                      data-testid="input-current-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-200">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      className="bg-gray-800 border-gray-700 text-white"
                      data-testid="input-new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-200">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      className="bg-gray-800 border-gray-700 text-white"
                      data-testid="input-confirm-password"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-white hover:bg-gray-800"
                    data-testid="update-password-button"
                  >
                    Update Password
                  </Button>
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-4">
                  <h3 className="font-medium text-white">Active Sessions</h3>
                  <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-white">Current Session</p>
                      <p className="text-sm text-gray-400">Last active: Just now</p>
                    </div>
                    <Badge className="bg-[#76B900]/20 text-[#76B900]">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose how you want to be notified about updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates about your projects via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    data-testid="switch-email-notifications"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Security Alerts</p>
                    <p className="text-sm text-gray-400">Get notified about security issues and compliance updates</p>
                  </div>
                  <Switch 
                    checked={notifications.security} 
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, security: checked }))}
                    data-testid="switch-security-notifications"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Product Updates</p>
                    <p className="text-sm text-gray-400">Learn about new features and improvements</p>
                  </div>
                  <Switch 
                    checked={notifications.updates} 
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, updates: checked }))}
                    data-testid="switch-updates-notifications"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Marketing Communications</p>
                    <p className="text-sm text-gray-400">Receive tips, offers, and healthcare industry insights</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing} 
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                    data-testid="switch-marketing-notifications"
                  />
                </div>

                <Button 
                  onClick={handleSaveNotifications} 
                  className="bg-[#76B900] hover:bg-[#8CC63F] mt-4"
                  data-testid="save-notifications-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Application Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  Customize your MedBuilder experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    {darkMode ? <Moon className="w-5 h-5 text-[#76B900]" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                    <div>
                      <p className="font-medium text-white">Dark Mode</p>
                      <p className="text-sm text-gray-400">Use dark theme for better visibility</p>
                    </div>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode}
                    data-testid="switch-dark-mode"
                  />
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-4">
                  <h3 className="font-medium text-white">HIPAA Compliance Settings</h3>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-[#76B900]" />
                      <p className="font-medium text-white">Compliance Mode</p>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      All projects are created with HIPAA compliance features enabled by default.
                      This includes audit logging, encryption, and PHI detection.
                    </p>
                    <Badge className="bg-[#76B900]/20 text-[#76B900]">
                      <Check className="w-3 h-3 mr-1" />
                      HIPAA Compliance Active
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-4">
                  <h3 className="font-medium text-white">Data & Privacy</h3>
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-white hover:bg-gray-800"
                    data-testid="download-data-button"
                  >
                    Download My Data
                  </Button>
                  <p className="text-sm text-gray-400">
                    Request a copy of all your data stored in MedBuilder
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
