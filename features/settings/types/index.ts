import { VoiceResponse } from 'retell-sdk/resources/voice.mjs';

export type UserInfo = {
  email: string;
  name: string;
};

export type SettingsData = {
  user: UserInfo;
  voices: VoiceResponse[];
};
