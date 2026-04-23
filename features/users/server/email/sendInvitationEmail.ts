import InvitationEmail from '@/components/email/Invite';
import { resend } from '@/lib/resend/resend';

export const sendInvitationEmail = async (
  email: string,
  name: string,
  token: string,
) => {
  const { error } = await resend.emails.send({
    from: 'support@munazar-ali.dev',
    to: [email],
    subject: 'Welcome Aboard! Set Up Your Account',
    react: InvitationEmail({
      name,
      email,
      createPasswordLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/complete-signup/${token}`,
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
