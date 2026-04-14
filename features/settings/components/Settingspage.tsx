import React from 'react';
import { settingsAction } from '../server/actions/settings.action';
import ProfileSettings from './SettingsContent';

async function Settingspage() {
  const data = await settingsAction();

  return data ? (
    <ProfileSettings voices={data.voices} user={data.user} />
  ) : null;
}

export default Settingspage;
