import React from 'react';
import {
  User as UserIcon,
  Plus as PlusIcon,
  ChevronDown as ChevronDownIcon,
  UserCircle as UserCircleIcon,
  LogOut as LogOutIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useMiniRouter } from '@context/router-context';

interface HeaderProps {
  userName: string;
  showUserMenu: boolean;
  onToggleUserMenu: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
  onCreateNote: () => void;
  userMenuRef: React.RefObject<HTMLDivElement>;
  styles: { [key: string]: React.CSSProperties };
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  showUserMenu,
  onToggleUserMenu,
  onProfile,
  onSettings,
  onLogout,
  onCreateNote,
  userMenuRef,
  styles,
}) => {
  const { navigate } = useMiniRouter();

  return (
    <div style={styles.header}>
      <div style={styles.userSectionWrapper} ref={userMenuRef}>
        <div
          style={{
            ...styles.userSection,
            ...(showUserMenu ? styles.userSectionHover : {}),
          }}
          onClick={onToggleUserMenu}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              styles.userSectionHover.backgroundColor || '#f8fafc';
            e.currentTarget.style.borderColor = styles.userSectionHover.borderColor || '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <UserIcon size={20} style={styles.userIcon} />
          <span style={styles.userName}>{userName}</span>
          <ChevronDownIcon
            size={14}
            style={{
              ...styles.chevronIcon,
              transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>

        {/* User dropdown menu */}
        {showUserMenu && (
          <div style={styles.userMenu}>
            <div
              style={styles.menuItem}
              onClick={onProfile}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  styles.menuItemHover.backgroundColor || '#f8fafc';
                e.currentTarget.style.color = styles.menuItemHover.color || '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = styles.menuItem.color || '#374151';
              }}
            >
              <UserCircleIcon size={16} />
              <span>Profile</span>
            </div>
            {/* TODO: Hide settings */}
            {/* <div
              style={styles.menuItem}
              onClick={onSettings}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  styles.menuItemHover.backgroundColor || '#f8fafc';
                e.currentTarget.style.color = styles.menuItemHover.color || '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = styles.menuItem.color || '#374151';
              }}
            >
              <SettingsIcon size={16} />
              <span>Settings</span>
            </div> */}
            <div
              style={styles.menuItem}
              onClick={onLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  styles.menuItemHover.backgroundColor || '#f8fafc';
                e.currentTarget.style.color = styles.menuItemHover.color || '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = styles.menuItem.color || '#374151';
              }}
            >
              <LogOutIcon size={16} />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>

      <button
        style={{
          ...styles.createButton,
        }}
        onClick={onCreateNote}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            styles.createButtonHover.backgroundColor || '#4f46e5';
          e.currentTarget.style.boxShadow =
            styles.createButtonHover.boxShadow || '0 6px 16px rgba(99, 102, 241, 0.4)';
          e.currentTarget.style.transform =
            styles.createButtonHover.transform || 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = styles.createButton.backgroundColor || '#6366f1';
          e.currentTarget.style.boxShadow =
            styles.createButton.boxShadow || '0 4px 12px rgba(99, 102, 241, 0.3)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <PlusIcon size={16} />
        Create Note
      </button>
    </div>
  );
};
