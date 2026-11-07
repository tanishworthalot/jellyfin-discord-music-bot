import { CommandInteraction } from 'discord.js';

import {
  buildErrorMessage,
  buildMessage,
} from '../../clients/discord/discord.message.builder';
import { DiscordMessageCleanupService } from '../../clients/discord/discord.message-cleanup.service';
import { DiscordVoiceService } from '../../clients/discord/discord.voice.service';
import { PlaybackService } from '../../playback/playback.service';
import { formatPosition, parseSeekAmount } from './seek.util';

/**
 * Shared logic for /forward and /back.
 * Expects the interaction to have been deferred already (DeferReplyGuard).
 */
export const handleSeek = async (
  direction: 1 | -1,
  time: string,
  interaction: CommandInteraction,
  deps: {
    discordVoiceService: DiscordVoiceService;
    playbackService: PlaybackService;
    messageCleanupService: DiscordMessageCleanupService;
  },
): Promise<void> => {
  const { discordVoiceService, playbackService, messageCleanupService } = deps;

  const reply = async (embed: ReturnType<typeof buildMessage>) =>
    messageCleanupService.scheduleResponseDeletion(
      await interaction.editReply({ embeds: [embed] }),
    );

  const amountMs = parseSeekAmount(time);
  if (amountMs === undefined) {
    await reply(
      buildErrorMessage({
        title: `Unable to read "${time}"`,
        description:
          'Use a number followed by s or m, for example 5s, 30s, 2m or 1m30s. A bare number counts as seconds.',
      }),
    );
    return;
  }

  if (!playbackService.getPlaylistOrDefault().hasActiveTrack()) {
    await reply(
      buildErrorMessage({
        title: 'Unable to seek',
        description: 'The bot is not playing any music right now',
      }),
    );
    return;
  }

  const result = discordVoiceService.seekRelative(direction * amountMs);
  if (result === undefined) {
    await reply(
      buildErrorMessage({
        title: 'Unable to seek',
        description: 'The bot is not streaming to a channel right now',
      }),
    );
    return;
  }

  const verb = direction === 1 ? 'Skipped forward' : 'Went back';
  await reply(
    buildMessage({
      title: `${verb} ${formatPosition(amountMs)}`,
      description: `Now at ${formatPosition(result.positionMs)} / ${formatPosition(result.durationMs)}${
        result.clamped
          ? direction === 1
            ? ' (stopped near the end of the track)'
            : ' (back at the start of the track)'
          : ''
      }`,
    }),
  );
};
