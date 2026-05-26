import ResetPasswordEmail from '@/components/email/Reset';
import { resend } from '@/lib/resend/resend';
import { getAppUrl } from '@/utils/url/getAppUrl';

export const sendResetLinkEmail = async (
  email: string,
  token: string,
  name: string,
) => {
  const { error } = await resend.emails.send({
    from: 'support@munazar-ali.dev',
    to: [email],
    subject: 'Reset Password',
    react: ResetPasswordEmail({
      userName: name,
      resetLink: `${getAppUrl()}/set-password/${token}`,
    }),
  });

  if (error) {
    console.error({ error });
    return {
      success: false,
      message: `Failed to send email: ${error.message}`,
    };
  }

  return {
    success: true,
    message: `An email has been sent to ${email}.`,
  };
};
