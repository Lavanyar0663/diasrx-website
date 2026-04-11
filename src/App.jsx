import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RequestAccessPage from './pages/RequestAccess';
import SuccessPage from './pages/Success';
import ForgotPasswordPage from './pages/ForgotPassword';
import VerifyOTPPage from './pages/VerifyOTP';
import ResetPasswordPage from './pages/ResetPassword';
import PasswordUpdatedPage from './pages/PasswordUpdated';
import AdminDashboardPage from './pages/AdminDashboard';
import AccessRequestsPage from './pages/AccessRequests';
import RequestDetailPage from './pages/RequestDetail';
import RequestStatusPage from './pages/RequestStatus';
import RejectionReasonPage from './pages/RejectionReason';
import ApplicantProfilePage from './pages/ApplicantProfile';
import ManageDoctorsPage from './pages/ManageDoctors';
import ManagePharmacistsPage from './pages/ManagePharmacists';
import RegisterStaffPage from './pages/RegisterStaff';
import RegistrationSuccessPage from './pages/RegistrationSuccess';
import ManagePatientsPage from './pages/ManagePatients';
import RegisterPatientPage from './pages/RegisterPatient';
import AdminProfilePage from './pages/AdminProfile';
import NotificationMasterPage from './pages/NotificationMaster';
import PatientDetailsPage from './pages/PatientDetails';
import SettingsUpdatedPage from './pages/SettingsUpdated';
import ChangePasswordPage from './pages/ChangePassword';
import PasswordUpdatedSuccessPage from './pages/PasswordUpdatedSuccess';
import DoctorDashboardPage from './pages/DoctorDashboard';
import DoctorPrescriptionsPage from './pages/DoctorPrescriptions';
import DoctorPatientsPage from './pages/DoctorPatients';
import DoctorNotificationsPage from './pages/DoctorNotifications';
import PatientHistoryPage from './pages/PatientHistory';
import PrescriptionDetailsPage from './pages/PrescriptionDetailsPage';
import CreatePrescriptionPage from './pages/CreatePrescription';
import PrescriptionIssuedPage from './pages/PrescriptionIssued';
import DoctorSettingsPage from './pages/DoctorSettings';
import EditProfilePage from './pages/EditProfile';
import ProfileUpdatedPage from './pages/ProfileUpdated';
import NotificationPreferencesPage from './pages/NotificationPreferences';
import DoctorChangePasswordPage from './pages/DoctorChangePassword';
import DoctorPasswordUpdatedPage from './pages/DoctorPasswordUpdated';
import AuditLogsPage from './pages/AuditLogs';
import PharmacistDashboardPage from './pages/PharmacistDashboard';
import PrescriptionHistoryPage from './pages/PrescriptionHistory';
import PendingPrescriptionsPage from './pages/PendingPrescriptions';
import DispensedPrescriptionsPage from './pages/DispensedPrescriptions';
import PrescriptionDetailPage from './pages/PrescriptionDetail';
import PrescriptionDispensedPage from './pages/PrescriptionDispensed';
import PharmacistPatientsPage from './pages/PharmacistPatients';
import PharmacistNotificationsPage from './pages/PharmacistNotifications';
import PharmacistSettingsPage from './pages/PharmacistSettingsPage';
import PharmacistChangePasswordPage from './pages/PharmacistChangePassword';
import PharmacistPasswordUpdatedPage from './pages/PharmacistPasswordUpdated';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="app-root">
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/request-access" element={<RequestAccessPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password-updated" element={<PasswordUpdatedPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/access-requests" element={<AccessRequestsPage />} />
          <Route path="/request-detail/:id" element={<RequestDetailPage />} />
          <Route path="/request-status/:id" element={<RequestStatusPage />} />
          <Route path="/rejection-reason/:id" element={<RejectionReasonPage />} />
          <Route path="/applicant-profile/:id" element={<ApplicantProfilePage />} />
          <Route path="/manage-doctors" element={<ManageDoctorsPage />} />
          <Route path="/manage-pharmacists" element={<ManagePharmacistsPage />} />
          <Route path="/register-staff" element={<RegisterStaffPage />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          <Route path="/manage-patients" element={<ManagePatientsPage />} />
          <Route path="/register-patient" element={<RegisterPatientPage />} />
          <Route path="/admin-profile" element={<AdminProfilePage />} />
          <Route path="/notification-master" element={<NotificationMasterPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />

          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
          <Route path="/doctor-prescriptions" element={<DoctorPrescriptionsPage />} />
          <Route path="/doctor-patients" element={<DoctorPatientsPage />} />
          <Route path="/doctor-notifications" element={<DoctorNotificationsPage />} />
          <Route path="/doctor-settings" element={<DoctorSettingsPage />} />
          <Route path="/create-prescription" element={<CreatePrescriptionPage />} />
          <Route path="/prescription-issued/:id" element={<PrescriptionIssuedPage />} />
          <Route path="/doctor-change-password" element={<DoctorChangePasswordPage />} />
          <Route path="/doctor-password-updated" element={<DoctorPasswordUpdatedPage />} />

          {/* Pharmacist Routes */}
          <Route path="/pharmacist-dashboard" element={<PharmacistDashboardPage />} />
          <Route path="/pharmacist-patients" element={<PharmacistPatientsPage />} />
          <Route path="/pharmacist-profile" element={<PharmacistSettingsPage />} />
          <Route path="/pharmacist-notifications" element={<PharmacistNotificationsPage />} />
          <Route path="/pharmacist-change-password" element={<PharmacistChangePasswordPage />} />
          <Route path="/pharmacist-password-updated" element={<PharmacistPasswordUpdatedPage />} />
          <Route path="/prescription-history" element={<PrescriptionHistoryPage />} />
          <Route path="/pending-prescriptions" element={<PendingPrescriptionsPage />} />
          <Route path="/dispensed-prescriptions" element={<DispensedPrescriptionsPage />} />
          <Route path="/prescription-detail/:id?" element={<PrescriptionDetailPage />} />
          <Route path="/prescription-dispensed" element={<PrescriptionDispensedPage />} />

          {/* Shared / Common Routes */}
          <Route path="/patient-history/:id" element={<PatientHistoryPage />} />
          <Route path="/patient-details/:id" element={<PatientDetailsPage />} />
          <Route path="/prescription-details/:id" element={<PrescriptionDetailsPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/profile-updated" element={<ProfileUpdatedPage />} />
          <Route path="/notification-preferences" element={<NotificationPreferencesPage />} />
          <Route path="/settings-updated" element={<SettingsUpdatedPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/password-updated-success" element={<PasswordUpdatedSuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;