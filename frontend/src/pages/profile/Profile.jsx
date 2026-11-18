import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import apiLink from '../../api/apiLink';
import { updateUserData } from '../../features/authSlice';

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentUser, role, userData } = useSelector((s) => s.auth);

  const [profileForm, setProfileForm] = useState({
    name: userData?.name || currentUser?.user?.username || '',
    email: userData?.email || currentUser?.user?.email || '',
    phone: userData?.phone || currentUser?.user?.phone || '',
    address: userData?.address || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const res = await apiLink.put('/auth/update-profile', profileForm);
      if (res.data?.success) {
        toast.success(t('profile_updated_successfully', 'Profile updated successfully!'));
        dispatch(updateUserData(res.data.data));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('passwords_do_not_match', 'New passwords do not match'));
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError(t('password_too_short', 'Password must be at least 6 characters'));
      return;
    }

    setLoadingPassword(true);
    try {
      const res = await apiLink.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.data?.success) {
        toast.success(t('password_changed_successfully', 'Password changed successfully!'));
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('user_profile', 'User Profile')}</h4>
          <p className="text-muted small mb-0">{t('manage_account_settings', 'Manage your account details and password')}</p>
        </div>
        <Badge bg="primary" className="px-3 py-2 text-uppercase fs-6">
          {role || 'User'}
        </Badge>
      </div>

      <Row className="g-4">
        {/* Profile Card */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm text-center p-4 h-100">
            <Card.Body>
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                style={{ width: '90px', height: '90px', fontSize: '36px', fontWeight: 'bold' }}
              >
                {(profileForm.name || 'U').charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold mb-1">{profileForm.name || 'ISP Operator'}</h5>
              <p className="text-muted small mb-2">{currentUser?.user?.username}</p>
              <Badge bg="info" className="mb-3 px-3 py-1">
                {role}
              </Badge>

              <hr />

              <div className="text-start mt-3">
                <p className="mb-2 text-muted small">
                  <strong>{t('email', 'Email')}:</strong> {profileForm.email || 'N/A'}
                </p>
                <p className="mb-2 text-muted small">
                  <strong>{t('phone', 'Phone')}:</strong> {profileForm.phone || 'N/A'}
                </p>
                {profileForm.address && (
                  <p className="mb-2 text-muted small">
                    <strong>{t('address', 'Address')}:</strong> {profileForm.address}
                  </p>
                )}
                {userData?.balance !== undefined && (
                  <p className="mb-0 text-muted small">
                    <strong>{t('balance', 'Balance')}:</strong> ৳{userData.balance}
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Edit Details & Password */}
        <Col lg={8}>
          <Row className="g-4">
            {/* Account Info Form */}
            <Col xs={12}>
              <Card className="border-0 shadow-sm p-3">
                <Card.Body>
                  <h5 className="fw-bold mb-3">{t('edit_profile', 'Edit Profile Details')}</h5>
                  <Form onSubmit={handleUpdateProfile}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>{t('full_name', 'Full Name')}</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>{t('email', 'Email Address')}</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>{t('phone', 'Phone Number')}</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>{t('address', 'Address')}</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={profileForm.address}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button variant="primary" type="submit" disabled={loadingProfile}>
                        {loadingProfile ? t('saving', 'Saving...') : t('save_changes', 'Save Changes')}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Change Password Form */}
            <Col xs={12}>
              <Card className="border-0 shadow-sm p-3">
                <Card.Body>
                  <h5 className="fw-bold mb-3">{t('change_password', 'Change Password')}</h5>
                  {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                  <Form onSubmit={handleChangePassword}>
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('current_password', 'Current Password')}</Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('new_password', 'New Password')}</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>{t('confirm_new_password', 'Confirm Password')}</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button variant="outline-primary" type="submit" disabled={loadingPassword}>
                        {loadingPassword ? t('updating', 'Updating...') : t('update_password', 'Update Password')}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
