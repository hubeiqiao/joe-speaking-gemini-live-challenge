'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface ChallengeUserMenuProps {
  isLocalMode?: boolean;
  onLocalClear?: () => Promise<void> | void;
}

export function ChallengeUserMenu({
  isLocalMode = false,
  onLocalClear,
}: ChallengeUserMenuProps) {
  const { user, loading, signInWithGoogle, signOut, isConfigured } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    if (!isConfigured || busy) {
      return;
    }

    setBusy(true);
    try {
      await signInWithGoogle();
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (busy) {
      return;
    }

    setBusy(true);
    try {
      if (user) {
        await signOut();
        return;
      }

      await onLocalClear?.();
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="h-7 w-7 rounded-full bg-default" />;
  }

  if (!user) {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            as="button"
            className="cursor-pointer bg-default h-7 w-7 transition-transform"
            icon={<User className="text-muted" size={16} />}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User menu actions" variant="flat">
          {isConfigured ? (
            <DropdownItem
              key="signin"
              className="h-14 gap-2"
              isDisabled={busy}
              onPress={() => void handleSignIn()}
              textValue="Sign in with Google"
            >
              <div>
                <p className="font-semibold">Sign in with Google</p>
                <p className="text-xs text-muted">Backup and sync your data</p>
              </div>
            </DropdownItem>
          ) : (
            <DropdownItem key="local" className="h-14 gap-2" textValue="Local demo mode">
              <div>
                <p className="font-semibold">Local demo mode</p>
                <p className="text-xs text-muted">Challenge-safe public demo path</p>
              </div>
            </DropdownItem>
          )}
          <DropdownItem
            key="settings"
            as={Link}
            href="/sign-in"
            startContent={<Settings size={18} />}
            textValue="Build notes"
          >
            Build Notes
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="!h-7 !w-7 cursor-pointer transition-transform"
          name={user.user_metadata.full_name || user.email || 'User'}
          size="sm"
          src={user.user_metadata.avatar_url}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
          <p className="font-semibold">{user.user_metadata.full_name || 'User'}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </DropdownItem>
        <DropdownItem
          key="settings"
          as={Link}
          href="/sign-in"
          startContent={<Settings size={18} />}
          textValue="Build notes"
        >
          Build Notes
        </DropdownItem>
        <DropdownItem
          key="signout"
          color="danger"
          isDisabled={busy}
          onPress={() => void handleSignOut()}
          startContent={<LogOut size={18} />}
          textValue="Sign out"
        >
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
