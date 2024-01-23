/// <reference path="MusicKit.Player.d.ts" />

/**
 * Use the MusicKit namespace to configure MusicKit JS and to access app
 * instances, control music playback, and fetch data from the Apple Music API.
 */

declare namespace MusicKit {
  /**
   * A configuration for an app.
   */
  interface AppConfiguration {
    /**
     * The build number of your app.
     */
    build?: string | undefined;
    /**
     * A URL for your app icon.
     */
    icon?: string | undefined;
    /**
     * The name of your app.
     */
    name?: string | undefined;
    /**
     * The version of your app.
     */
    version?: string | undefined;
  }

  const PlaybackStates: {
    none: 0;
    loading: 1;
    playing: 2;
    paused: 3;
    stopped: 4;
    ended: 5;
    seeking: 6;
    waiting: 7;
    stalled: 8;
    completed: 9;
  };

  interface FormattedPlaybackDuration {
    hours: number;
    minutes: number;
  }

  interface EmbedOptions {
    height: number | string;
    width: number | string;
  }

  const Events: {
    /**
     * A notification name indicating a change in the authorization status.
     */
    authorizationStatusDidChange: string;
    /**
     * A notification name indicating an upcoming change in the authorization status.
     */
    authorizationStatusWillChange: string;
    /**
     * A notification name indicating a user is eligible for a subscribe view.
     */
    eligibleForSubscribeView: string;
    /**
     * A notification name indicating MusicKit JS is loaded.
     */
    loaded: string;
    /**
     * A notification name indicating the player has obtained enough data for
     * playback to start.
     */
    mediaCanPlay: string;
    /**
     * A notification name indicating that the currently-playing media item has
     * changed.
     */
    mediaItemDidChange: string;
    /**
     * A notification name indicating the currently-playing media item is about
     * to change.
     */
    mediaItemWillChange: string;
    /**
     * A notification name indicating that the player has thrown an error during
     * playback.
     */
    mediaPlaybackError: string;
    /**
     * A notification name indicating the media item's metadata has finished
     * loading.
     */
    metadataDidChange: string;
    /**
     * A notification indicating the playback bit rate has changed.
     */
    playbackBitrateDidChange: string;
    /**
     * A notification name indicating the current playback duration changed.
     */
    playbackDurationDidChange: string;
    /**
     * A notification name indicating the current playback progress changed.
     */
    playbackProgressDidChange: string;
    /**
     * A notification indicating the playback state has changed.
     */
    playbackStateDidChange: string;
    /**
     * A notification indicating the playback state is about to be changed.
     */
    playbackStateWillChange: string;
    /**
     * A notification indicating that a playback target's availability has changed.
     */
    playbackTargetAvailableDidChange: string;
    /**
     * A notification name indicating the current playback time has changed.
     */
    playbackTimeDidChange: string;
    /**
     * A notification name indicating the player volume has changed.
     */
    playbackVolumeDidChange: string;
    /**
     * A notification name indicating the playback has started in another context
     * on your domain, and the current player has stopped playback.
     */
    primaryPlayerDidChange: string;
    /**
     * A notification name indicating that the items in the current playback
     * queue have changed.
     */
    queueItemsDidChange: string;
    /**
     * A notification name indicating that the current queue position has changed.
     */
    queuePositionDidChange: string;
    /**
     * A notification name indicating a change in the storefront country code.
     */
    storefrontCountryCodeDidChange: string;
    /**
     * A notification name indicating that the device's inferred storefront
     * identifier changed.
     */
    storefrontIdentifierDidChange: string;
    /**
     * A notification name indicating the user token changed.
     */
    userTokenDidChange: string;
  };

  const errors: MKError[];

  const version: string;

  interface AuthStatus {
    NOT_DETERMINED: 0;
    DENIED: 1;
    RESTRICTED: 2;
    AUTHORIZED: 3;
  }

  /**
   * A dictionary of configuration options for the MusicKit instance.
   */
  interface Configuration {
    /**
     * The version of your app.
     */
    app?: AppConfiguration | undefined;
    /**
     * This property indicates whether you have explicitly enabled or disabled
     * declarative markup.
     */
    declarativeMarkup?: boolean | undefined;
    /**
     * The developer token to identify yourself as a trusted developer and
     * member of the Apple Developer Program.
     */
    developerToken?: string | undefined;
    /**
     * The current storefront for this MusicKit configuration.
     */
    storefrontId?: string | undefined;
    /**
     * The playback bit rate of the music player.
     */
    bitrate?: PlaybackBitrate | undefined;
  }
  /**
   * Configure a MusicKit instance.
   */
  function configure(configuration: Configuration): MusicKitInstance;
  /**
   * Returns the configured MusicKit instance.
   */
  function getInstance(): MusicKitInstance;
  /**
   * Returns a formatted artwork URL.
   *
   * @param artwork An artwork resource object.
   * @param height The desired artwork height.
   * @param width the desired artwork width.
   */
  function formatArtworkURL(
    artwork: Artwork,
    height: number,
    width: number,
  ): string;
  /**
   * Returns an object with milliseconds formatted into hours and minutes.
   */
  function formattedMilliseconds(
    milliseconds: number,
  ): FormattedPlaybackDuration;
  /**
   * Returns an object with seconds formatted into hours and minutes.
   */
  function formattedSeconds(seconds: number): FormattedPlaybackDuration;
  /**
   * Generates Apple Music web player markup.
   *
   * @param url The iTunes URL for the Apple Music content.
   * @param options The object containing the height and width of the player.
   */
  function generateEmbedCode(url: string, options: EmbedOptions): string;

  function formatMediaTime(seconds: number, separator: string): string;
}
