import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Users, Mail } from "lucide-react"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [confirmModal, setConfirmModal] = useState({ show: false, action: "", userId: "", userName: "" })
  const { token } = useAuth()

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchUsers()
  }, [page])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/admin/users?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data.data.users)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId, action) => {
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success(`User ${action}d successfully`)
      fetchUsers()
      setConfirmModal({ show: false, action: "", userId: "", userName: "" })
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} user`)
    }
  }

  const openConfirmModal = (action, userId, userName) => {
    setConfirmModal({ show: true, action, userId, userName })
  }

  if (loading && users.length === 0) {
    return (
      <div className="space-y-8 pb-12">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card className="shadow-md">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and access permissions
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{pagination.totalUsers || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Page</p>
                <p className="text-2xl font-bold">{pagination.currentPage || 1}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                of {pagination.totalPages || 1} pages
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Showing</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                users per page
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Card */}
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">All Users</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 divide-y divide-border rounded-lg border">
            {users.map((user, index) => (
              <div
                key={user._id}
                className={`flex flex-col gap-4 p-5 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center ${
                  index % 2 === 0 ? "bg-muted/20" : ""
                }`}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-foreground">{user.fullName}</p>
                    <Badge variant="secondary" className="capitalize text-xs font-semibold">
                      {user.role}
                    </Badge>
                    <Badge
                      variant={user.status === "active" ? "default" : "destructive"}
                      className="capitalize text-xs font-semibold"
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </p>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  {user.status === "active" ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openConfirmModal("deactivate", user._id, user.fullName)}
                      className="w-full sm:w-32"
                    >
                      <XCircle className="h-4 w-4" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openConfirmModal("activate", user._id, user.fullName)}
                      className="w-full sm:w-32"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Page <span className="font-semibold text-foreground">{pagination.currentPage}</span> of{" "}
              <span className="font-semibold text-foreground">{pagination.totalPages}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage || loading}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setConfirmModal({ show: false, action: "", userId: "", userName: "" })}
        >
          <div
            className="w-full max-w-md rounded-xl border bg-card p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold">Confirm Action</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Are you sure you want to <span className="font-semibold text-foreground">{confirmModal.action}</span>{" "}
              <span className="font-semibold text-foreground">{confirmModal.userName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmModal({ show: false, action: "", userId: "", userName: "" })}
              >
                Cancel
              </Button>
              <Button
                variant={confirmModal.action === "activate" ? "default" : "destructive"}
                onClick={() => handleStatusChange(confirmModal.userId, confirmModal.action)}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
