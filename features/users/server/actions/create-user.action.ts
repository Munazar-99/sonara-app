'use server';

import { addUserSchema } from '../../utils/schema';

import { sendInvitationEmail } from '../email/sendInvitationEmail';

import type { AddUserFormValues } from '../../utils/schema';
import { createInvitedUser } from '@/server/db/auth/createInvitedUser';

export async function createUserAction(formData: AddUserFormValues) {
  const parsed = addUserSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0]?.message,
    };
  }

  try {
    const result = await createInvitedUser(parsed.data);

    if (!result.success) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    const emailResult = await sendInvitationEmail(
      parsed.data.email,
      parsed.data.name,
      result.invitationToken,
    );

    if (!emailResult.success) {
      return {
        data: result.user,
        success: false,
        message: 'User created, but invitation email failed.',
      };
    }

    return {
      data: result.user,
      success: true,
      message: 'User created successfully',
    };
  } catch (error) {
    console.error('createUserAction:', error);

    return {
      success: false,
      message: 'Failed to create user',
    };
  }
}
