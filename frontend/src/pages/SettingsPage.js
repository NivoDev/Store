import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiTrash2, FiShield, FiAlertTriangle, FiCheck, FiEdit3, FiMapPin, FiSave, FiX } from 'react-icons/fi';
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[4]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[4]};
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  color: ${theme.colors.dark[200]};
  font-weight: ${theme.typography.weights.medium};
  margin-bottom: ${theme.spacing[2]};
  font-size: ${theme.typography.sizes.sm};
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
`;

const Select = styled.select`
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
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  color: #22c55e;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  color: #ef4444;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
`;

const SettingsPage = () => {
  const { user, logout, refreshUserData } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    street_address: '',
    street_address_2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: 'US',
    vat_number: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        company: user.company || '',
        street_address: user.billing_address?.street_address || '',
        street_address_2: user.billing_address?.street_address_2 || '',
        city: user.billing_address?.city || '',
        state_province: user.billing_address?.state_province || '',
        postal_code: user.billing_address?.postal_code || '',
        country: user.billing_address?.country || 'US',
        vat_number: user.vat_number || ''
      });
    }
  }, [user]);

  const handleProfileInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear messages when user starts typing
    if (profileMessage) setProfileMessage('');
    if (profileError) setProfileError('');
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileError('');
    setProfileMessage('');

    try {
      const result = await apiService.updateUserProfile(profileData);
      
      if (result.success) {
        setProfileMessage('Profile updated successfully!');
        setIsEditingProfile(false);
        // Refresh user data to show updated information
        await refreshUserData();
      } else {
        setProfileError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('An unexpected error occurred');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset profile data to current user data
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        company: user.company || '',
        street_address: user.billing_address?.street_address || '',
        street_address_2: user.billing_address?.street_address_2 || '',
        city: user.billing_address?.city || '',
        state_province: user.billing_address?.state_province || '',
        postal_code: user.billing_address?.postal_code || '',
        country: user.billing_address?.country || 'US',
        vat_number: user.vat_number || ''
      });
    }
    setIsEditingProfile(false);
    setProfileError('');
    setProfileMessage('');
  };

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

        {/* Profile & Billing Information */}
        <SettingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <SettingHeader>
            <SettingIcon>
              <FiMapPin size={24} />
            </SettingIcon>
            <SettingTitle>Profile & Billing Information</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            Manage your personal details and billing address
          </SettingDescription>
          
          {profileMessage && <SuccessMessage>{profileMessage}</SuccessMessage>}
          {profileError && <ErrorMessage>{profileError}</ErrorMessage>}
          
          {!isEditingProfile ? (
            <div>
              <div style={{ marginBottom: theme.spacing[4] }}>
                <p><strong>First Name:</strong> {user?.first_name || 'Not set'}</p>
                <p><strong>Last Name:</strong> {user?.last_name || 'Not set'}</p>
                <p><strong>Phone:</strong> {user?.phone || 'Not set'}</p>
                <p><strong>Company:</strong> {user?.company || 'Not set'}</p>
                <p><strong>VAT Number:</strong> {user?.vat_number || 'Not set'}</p>
              </div>
              
              {user?.billing_address && (
                <div style={{ marginBottom: theme.spacing[4] }}>
                  <h4 style={{ color: theme.colors.dark[200], marginBottom: theme.spacing[2] }}>Billing Address:</h4>
                  <p><strong>Address:</strong> {user.billing_address.street_address || 'Not set'}</p>
                  {user.billing_address.street_address_2 && (
                    <p><strong>Address 2:</strong> {user.billing_address.street_address_2}</p>
                  )}
                  <p><strong>City:</strong> {user.billing_address.city || 'Not set'}</p>
                  <p><strong>State/Province:</strong> {user.billing_address.state_province || 'Not set'}</p>
                  <p><strong>Postal Code:</strong> {user.billing_address.postal_code || 'Not set'}</p>
                  <p><strong>Country:</strong> {user.billing_address.country || 'Not set'}</p>
                </div>
              )}
              
              <Button 
                variant="secondary" 
                onClick={() => setIsEditingProfile(true)}
                style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}
              >
                <FiEdit3 size={16} />
                Edit Profile
              </Button>
            </div>
          ) : (
            <div>
              <FormGrid>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Company</Label>
                  <Input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleProfileInputChange('company', e.target.value)}
                    placeholder="Enter your company name"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>VAT Number</Label>
                  <Input
                    type="text"
                    value={profileData.vat_number}
                    onChange={(e) => handleProfileInputChange('vat_number', e.target.value)}
                    placeholder="Enter your VAT number"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Country</Label>
                  <Select
                    value={profileData.country}
                    onChange={(e) => handleProfileInputChange('country', e.target.value)}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="AU">Australia</option>
                    <option value="JP">Japan</option>
                    <option value="OTHER">Other</option>
                  </Select>
                </FormGroup>
                
                <FormGroup className="full-width">
                  <Label>Street Address</Label>
                  <Input
                    type="text"
                    value={profileData.street_address}
                    onChange={(e) => handleProfileInputChange('street_address', e.target.value)}
                    placeholder="Enter your street address"
                  />
                </FormGroup>
                
                <FormGroup className="full-width">
                  <Label>Street Address 2 (Optional)</Label>
                  <Input
                    type="text"
                    value={profileData.street_address_2}
                    onChange={(e) => handleProfileInputChange('street_address_2', e.target.value)}
                    placeholder="Apartment, suite, unit, etc. (optional)"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>City</Label>
                  <Input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => handleProfileInputChange('city', e.target.value)}
                    placeholder="Enter your city"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>State/Province</Label>
                  <Input
                    type="text"
                    value={profileData.state_province}
                    onChange={(e) => handleProfileInputChange('state_province', e.target.value)}
                    placeholder="Enter your state or province"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Postal Code</Label>
                  <Input
                    type="text"
                    value={profileData.postal_code}
                    onChange={(e) => handleProfileInputChange('postal_code', e.target.value)}
                    placeholder="Enter your postal code"
                  />
                </FormGroup>
              </FormGrid>
              
              <ButtonGroup style={{ marginTop: theme.spacing[6] }}>
                <Button 
                  variant="ghost" 
                  onClick={handleCancelEdit}
                  disabled={isSavingProfile}
                >
                  <FiX size={16} />
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? (
                    <>
                      <FiCheck size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      Save Changes
                    </>
                  )}
                </Button>
              </ButtonGroup>
            </div>
          )}
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
