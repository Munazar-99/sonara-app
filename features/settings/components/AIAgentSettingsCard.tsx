'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, Pause, Play } from 'lucide-react';
import type { VoiceResponse } from 'retell-sdk/resources/voice.mjs';

interface AIAgentSettingsCardProps {
  voices: VoiceResponse[];
  selectedVoice: VoiceResponse | null;
  onVoiceSelect: (voice: VoiceResponse | null) => void;
}

export default function AIAgentSettingsCard({
  voices,
  selectedVoice,
  onVoiceSelect,
}: AIAgentSettingsCardProps) {
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false);
  const [tempSelectedVoice, setTempSelectedVoice] =
    useState<VoiceResponse | null>(null);
  const [accentFilter, setAccentFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTempSelectedVoice(selectedVoice);
  }, [selectedVoice]);

  useEffect(() => {
    if (!isVoiceDialogOpen) {
      audioRef.current?.pause();
      audioRef.current!.currentTime = 0;
      setPlayingVoiceId(null);
    }
  }, [isVoiceDialogOpen]);

  const handleVoiceSelect = (voice: VoiceResponse) => {
    setTempSelectedVoice(prevVoice =>
      prevVoice?.voice_id === voice.voice_id ? null : voice,
    );
  };

  const handleSaveVoice = () => {
    onVoiceSelect(tempSelectedVoice);
    setIsVoiceDialogOpen(false);
    audioRef.current?.pause();
    audioRef.current!.currentTime = 0;
    setPlayingVoiceId(null);
  };

  const handlePlayVoice = (event: React.MouseEvent, voiceId: string) => {
    event.stopPropagation();
    const voice = voices.find(v => v.voice_id === voiceId);
    if (!voice) return;

    if (playingVoiceId === voiceId) {
      audioRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = voice.preview_audio_url!;
        audioRef.current.play();
        setPlayingVoiceId(voiceId);
      }
    }
  };

  const filteredVoices = voices.filter(
    voice =>
      (accentFilter === 'All' || voice.accent === accentFilter) &&
      (genderFilter === 'All' || voice.gender === genderFilter) &&
      (ageFilter === 'All' || voice.age === ageFilter),
  );

  return (
    <Card className="hover-card dark:bg-gray-dark">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>AI Agent Settings</CardTitle>
        </div>
        <CardDescription>
          Customize your AI assistant&apos;s voice and behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Selected Voice</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedVoice
                ? `${selectedVoice.voice_name} (${selectedVoice.accent} • ${selectedVoice.gender} • ${selectedVoice.age})`
                : 'No voice selected'}
            </p>
          </div>
          <Dialog
            open={isVoiceDialogOpen}
            onOpenChange={open => {
              setIsVoiceDialogOpen(open);
              if (!open) {
                audioRef.current?.pause();
                audioRef.current!.currentTime = 0;
                setPlayingVoiceId(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 dark:bg-dark dark:hover:bg-primary dark:hover:text-white"
              >
                Change Voice
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[550px] p-0 dark:bg-gray-dark">
              <DialogHeader className="border-b px-6 py-4">
                <DialogTitle className="text-xl">Select a Voice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 border-b px-6 py-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Select value={accentFilter} onValueChange={setAccentFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Accent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Accents</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="British">British</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Ages</SelectItem>
                      <SelectItem value="Young">Young</SelectItem>
                      <SelectItem value="Middle Aged">Middle Aged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ScrollArea className="max-h-[400px] min-h-[400px] overflow-auto">
                <div className="px-6 py-2">
                  {filteredVoices.map(voice => (
                    <div
                      key={voice.voice_id}
                      className={`flex cursor-pointer items-center justify-between py-3 transition-colors ${
                        tempSelectedVoice?.voice_id === voice.voice_id
                          ? 'bg-muted'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleVoiceSelect(voice)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                            tempSelectedVoice?.voice_id === voice.voice_id
                              ? 'border-primary bg-primary'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {tempSelectedVoice?.voice_id === voice.voice_id && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{voice.voice_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {voice.accent} • {voice.gender} • {voice.age}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-50 hover:opacity-100"
                        onClick={e => handlePlayVoice(e, voice.voice_id)}
                      >
                        {playingVoiceId === voice.voice_id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-end border-t px-6 py-4">
                <Button onClick={handleSaveVoice} disabled={!tempSelectedVoice}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      <audio ref={audioRef} onEnded={() => setPlayingVoiceId(null)} />
    </Card>
  );
}
