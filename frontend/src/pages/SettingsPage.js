import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiTrash2, FiShield, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Modal from '../components/modals/Modal';
import apiService from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[20]} ${theme.spacing[6]} ${theme.spacing[6]};
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const Title = styled.h1`
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
  background: ${theme.colors.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.dark[300]};
  line-height: 1.6;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: ${theme.spacing[6]};
`;

const SettingCard = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[8]};
  box-shadow: ${theme.shadows.lg};
`;

const SettingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const SettingIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.gradients.neon};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: ${theme.shadows.neon};
`;

const SettingTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin: 0;
`;

const SettingDescription = styled.p`
  color: ${theme.colors.dark[300]};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[6]};
`;

const DangerZone = styled(SettingCard)`
  border-color: ${theme.colors.error};
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%);
`;

const DangerIcon = styled(SettingIcon)`
  background: ${theme.colors.error};
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
`;

const DangerTitle = styled(SettingTitle)`
  color: ${theme.colors.error};
`;

const DangerDescription = styled(SettingDescription)`
  color: ${theme.colors.dark[200]};
`;

const ConfirmationText = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const ConfirmationTitle = styled.h4`
  color: ${theme.colors.error};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const ConfirmationList = styled.ul`
  color: ${theme.colors.dark[200]};
  margin: 0;
  padding-left: ${theme.spacing[6]};
  line-height: 1.6;
`;

const ConfirmationItem = styled.li`
  margin-bottom: ${theme.spacing[2]};
`;

const InputGroup = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const Label = styled.label`
  display: block;
  color: ${theme.colors.dark[200]};
  font-weight: ${theme.typography.weights.medium};
  margin-bottom: ${theme.spacing[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: flex-end;
`;

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      setDeleteError('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const result = await apiService.deleteAccount();
      if (result.success) {
        // Logout user after successful deletion
        await logout();
        // Redirect to home page
        window.location.href = '/';
      } else {
        setDeleteError(result.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Account Settings</Title>
        <Subtitle>Manage your account preferences and security settings</Subtitle>
      </Header>

      <SettingsGrid>
        {/* Account Information */}
        <SettingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SettingHeader>
            <SettingIcon>
              <FiUser size={24} />
            </SettingIcon>
            <SettingTitle>Account Information</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            View and manage your account details
          </SettingDescription>
          <div>
            <p><strong>Name:</strong> {user?.name || 'Not set'}</p>
            <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
            <p><strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
          </div>
        </SettingCard>

        {/* Security Settings */}
        {/* Security Section - Only show for email users */}
        {user?.provider === 'email' && (
          <SettingCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SettingHeader>
              <SettingIcon>
                <FiShield size={24} />
              </SettingIcon>
              <SettingTitle>Security</SettingTitle>
            </SettingHeader>
            <SettingDescription>
              Manage your account security settings
            </SettingDescription>
            <Button variant="secondary">
              Change Password
            </Button>
          </SettingCard>
        )}

        {/* Danger Zone */}
        <DangerZone
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SettingHeader>
            <DangerIcon>
              <FiTrash2 size={24} />
            </DangerIcon>
            <DangerTitle>Danger Zone</DangerTitle>
          </SettingHeader>
          <DangerDescription>
            Permanently deactivate your account. This action cannot be undone.
          </DangerDescription>
          
          <ConfirmationText>
            <ConfirmationTitle>
              <FiAlertTriangle size={20} />
              What happens when you delete your account:
            </ConfirmationTitle>
            <ConfirmationList>
              <ConfirmationItem>Your account will be deactivated immediately</ConfirmationItem>
              <ConfirmationItem>You will be logged out of all devices</ConfirmationItem>
              <ConfirmationItem>Your liked products will be removed</ConfirmationItem>
              <ConfirmationItem>Your purchase history will be preserved for legal purposes</ConfirmationItem>
              <ConfirmationItem>Account reactivation is not currently available</ConfirmationItem>
            </ConfirmationList>
          </ConfirmationText>

          <InputGroup>
            <Label htmlFor="confirmation">
              Type <strong>DELETE</strong> to confirm account deletion:
            </Label>
            <Input
              id="confirmation"
              type="text"
              placeholder="Type DELETE here"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                setDeleteError('');
              }}
            />
            {deleteError && (
              <p style={{ color: theme.colors.error, marginTop: theme.spacing[2] }}>
                {deleteError}
              </p>
            )}
          </InputGroup>

          <ButtonGroup>
            <Button 
              variant="ghost" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal(true)}
              disabled={confirmationText !== 'DELETE'}
            >
              <FiTrash2 size={16} />
              Delete Account
            </Button>
          </ButtonGroup>
        </DangerZone>
      </SettingsGrid>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Deletion"
      >
        <div style={{ textAlign: 'center', padding: theme.spacing[6] }}>
          <div style={{ fontSize: '48px', marginBottom: theme.spacing[4], color: theme.colors.error }}>
            <FiAlertTriangle />
          </div>
          <h3 style={{ 
            color: theme.colors.dark[50], 
            marginBottom: theme.spacing[3],
            fontSize: theme.typography.sizes.xl
          }}>
            Are you absolutely sure?
          </h3>
          <p style={{ 
            color: theme.colors.dark[300], 
            marginBottom: theme.spacing[6],
            lineHeight: 1.6
          }}>
            This action cannot be undone. Your account will be deactivated immediately and you will be logged out.
          </p>
          <div style={{ display: 'flex', gap: theme.spacing[3], justifyContent: 'center' }}>
            <Button 
              variant="ghost" 
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <FiCheck size={16} />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 size={16} />
                  Yes, Delete My Account
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default SettingsPage;
