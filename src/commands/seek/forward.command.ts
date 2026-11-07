import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';

import { Injectable, UseGuards } from '@nestjs/common';

import { CommandInteraction } from 'discord.js';

import { DiscordMessageCleanupService } from '../../clients/discord/discord.message-cleanup.service';
import { DiscordVoiceService } from '../../clients/discord/discord.voice.service';
import { ChannelLockGuard } from '../../clients/discord/guards/channel-lock.guard';
import { DeferReplyGuard } from '../../clients/discord/guards/defer-reply.guard';
import { PlaybackService } from '../../playback/playback.service';
import { defaultMemberPermissions } from '../../utils/environment';
import { handleSeek } from './seek.handler';
import { SeekCommandParams } from './seek.params';

@Injectable()
@UseGuards(DeferReplyGuard, ChannelLockGuard)
@Command({
  name: 'forward',
  description: 'Skip forward in the current track, e.g. 5s, 30s or 2m',
  defaultMemberPermissions,
})
export class ForwardCommand {
  constructor(
    private readonly discordVoiceService: DiscordVoiceService,
    private readonly playbackService: PlaybackService,
    private readonly messageCleanupService: DiscordMessageCleanupService,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: SeekCommandParams,
    @IA() interaction: CommandInteraction,
  ): Promise<void> {
    await handleSeek(1, dto.time, interaction, {
      discordVoiceService: this.discordVoiceService,
      playbackService: this.playbackService,
      messageCleanupService: this.messageCleanupService,
    });
  }
}
