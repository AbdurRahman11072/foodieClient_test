// users-table.tsx
'use client';

import { UpdateUserAction } from '@/actions/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  Ban,
  Calendar,
  CheckCircle,
  Mail,
  Shield,
  Store,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination-custom';

// User type based on actual API response
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  restaurantId: string | null;
  restaurant: {
    name: string;
  } | null;
}

export interface UsersTableProps {
  users: User[] | null;
  totalItems: number;
  currentPage: number;
  limit: number;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onBan?: (user: User) => void;
  onUnban?: (user: User) => void;
  onView?: (user: User) => void;
  onRoleChange?: (user: User, role: string) => void;
}

export function UsersTable({
  users,
  totalItems,
  currentPage,
  limit,
  onEdit,
  onDelete,
  onBan,
  onUnban,
  onView,
  onRoleChange,
}: UsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalItems / limit);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const banUser = async (id: string, data: any) => {
    const toastId = toast.loading('Updating user info......');
    const result = await UpdateUserAction(id, data);

    if (!result.success) {
      toast.error(result.message, { id: toastId });
    }
    toast.success(result.message, { id: toastId });
  };

  // Get role badge colors and icon
  const getRoleBadge = (role: string) => {
    const roles: Record<string, { color: string; icon: any; label: string }> = {
      admin: {
        color:
          'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
        icon: <Shield className="h-3 w-3 mr-1" />,
        label: 'Admin',
      },
      provider: {
        color:
          'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        icon: <Store className="h-3 w-3 mr-1" />,
        label: 'Provider',
      },
      user: {
        color:
          'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        icon: <UserCheck className="h-3 w-3 mr-1" />,
        label: 'User',
      },
    };
    return roles[role.toLowerCase()] || roles.user;
  };

  // Get status badge
  const getStatusBadge = (banned: boolean, banExpires: string | null) => {
    if (!banned) {
      return {
        color:
          'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        text: 'Active',
      };
    }
    if (banExpires && new Date(banExpires) > new Date()) {
      return {
        color:
          'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        icon: <Ban className="h-3 w-3 mr-1" />,
        text: 'Temporarily Banned',
      };
    }
    return {
      color:
        'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      icon: <Ban className="h-3 w-3 mr-1" />,
      text: 'Permanently Banned',
    };
  };

  // Format date
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="w-full">
        <div className="rounded-md border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[60px] font-medium text-foreground">
                  Avatar
                </TableHead>
                <TableHead className="font-medium text-foreground">
                  User Info
                </TableHead>
                <TableHead className="font-medium text-foreground">
                  Contact
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Role
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Email Verified
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Restaurant
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Joined Date
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users?.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const statusBadge = getStatusBadge(
                    user.banned,
                    user.banExpires
                  );

                  return (
                    <TableRow
                      key={user.id}
                      className={cn(
                        'border-b border-border transition-colors',
                        hoveredRow === user.id && 'bg-muted/50'
                      )}
                      onMouseEnter={() => setHoveredRow(user.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Avatar */}
                      <TableCell>
                        <Avatar className="h-12 w-12 rounded-lg border border-border">
                          <AvatarImage
                            src={user.image || undefined}
                            alt={user.name}
                          />
                          <AvatarFallback className="rounded-lg bg-muted text-xs text-muted-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>

                      {/* User Info */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground">
                            {user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-foreground">
                          <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[200px]">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            'px-2 py-0 text-[11px] font-medium capitalize inline-flex items-center',
                            roleBadge.color
                          )}
                        >
                          {roleBadge.icon}
                          {roleBadge.label}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            'px-2 py-0 text-[11px] font-medium inline-flex items-center',
                            statusBadge.color
                          )}
                        >
                          {statusBadge.icon}
                          {statusBadge.text}
                        </Badge>
                      </TableCell>

                      {/* Email Verified */}
                      <TableCell className="text-center">
                        {user.emailVerified ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                        ) : (
                          <UserX className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>

                      {/* Restaurant */}
                      <TableCell className="text-center">
                        {user.restaurant ? (
                          <div className="flex items-center justify-center gap-1">
                            <Store className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {user.restaurant.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          {user.banned ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                banUser(user.id, { banned: false })
                              }
                              className="h-8 w-8 p-0 text-muted-foreground hover:bg-emerald-100 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                              title="Unban User"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => banUser(user.id, { banned: true })}
                              className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              title="Ban User"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Details Sheet */}
      {/* <UserDetailsSheet
        user={selectedUser}
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        onEdit={(user) => {
          setDetailsSheetOpen(false);
          handleEditClick(user);
        }}
        onBan={onBan}
        onUnban={onUnban}
        onRoleChange={onRoleChange}
      /> */}

      {/* Edit Sheet */}
      {/* <UpdateUserSheet
        user={selectedUser}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        onSuccess={handleEditSuccess}
        onRoleChange={onRoleChange}
      /> */}
    </>
  );
}
