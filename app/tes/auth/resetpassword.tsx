import PasswordResetForm from '../../components/auth/passwordreset';

export default function ResetPasswordPage() {
  return (
    <div className="auth-container">
      <h1>Reset Password</h1>
      <PasswordResetForm />
    </div>
  );
}