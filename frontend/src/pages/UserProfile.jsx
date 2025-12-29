import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { Loader2, User, Mail, Shield, Activity, Lock, Info } from "lucide-react"

const UserProfile = () => {
  const { user, token, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName,
        email: user.email,
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!profileData.fullName || !profileData.email) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await axios.put(`${API_URL}/user/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(response.data.data.user)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    const { currentPassword, newPassword, confirmPassword } = passwordData

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setLoading(true)
    try {
      await axios.put(
        `${API_URL}/user/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Password changed successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account information and security preferences
        </p>
      </div>

      {/* Account Information Card */}
      <Card className="border-primary/10 shadow-lg shadow-primary/5">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Account Information</CardTitle>
              <CardDescription className="mt-1">Your current account details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Full Name
              </div>
              <p className="text-base font-semibold">{user?.fullName}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
              <p className="text-base font-semibold">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4" />
                Role
              </div>
              <Badge variant="secondary" className="capitalize font-semibold">
                {user?.role}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Activity className="h-4 w-4" />
                Account Status
              </div>
              <Badge
                variant={user?.status === "active" ? "default" : "destructive"}
                className="capitalize font-semibold"
              >
                {user?.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Edit your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={profileData.fullName}
                onChange={handleProfileChange}
                disabled={loading}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={profileData.email}
                onChange={handleProfileChange}
                disabled={loading}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 sm:w-auto">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Security / Change Password Card */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription className="mt-1">
                Keep your account secure with a strong password
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-semibold">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-semibold">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>Password must be at least 6 characters long</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 sm:w-auto">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserProfile
