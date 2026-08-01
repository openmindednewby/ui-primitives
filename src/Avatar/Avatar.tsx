/**
 * Avatar — a themed, circular monogram avatar for the shared kit (finreg CRM
 * contacts table, contact-detail header, activity timeline, and anywhere a person
 * or organisation needs a compact visual identity).
 *
 * RN-web + native: built from react-native primitives (`View`/`Text`/`Image`) so it
 * renders in the Expo apps and on the web via react-native-web. Every colour comes
 * from the app's `@dloizides/ui-feedback` UiProvider theme (`useUi`) — the background
 * is a deterministic brand/semantic swatch keyed off the name, and the initials ink is
 * whichever theme neutral contrasts better (see `avatarColor.ts`). Nothing is hardcoded.
 *
 * When `imageUrl` is supplied the photo fills the circle; the monogram remains the
 * fallback for every name.
 */
import React, { useMemo } from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { resolveAvatarColors } from './avatarColor';
import { deriveInitials } from './avatarInitials';

/** Default diameter in px. */
const DEFAULT_SIZE = 40;
/** Initials font size as a fraction of the diameter. */
const INITIALS_FONT_RATIO = 0.4;
/** A circle's radius is half its diameter. */
const RADIUS_DIVISOR = 2;
/** Suffix for the inner image's testID, derived from the component testID. */
const IMAGE_TESTID_SUFFIX = '-image';
const AVATAR_ROLE = 'image' as const;
const IMAGE_RESIZE_MODE = 'cover' as const;
const INITIALS_FONT_WEIGHT = '600' as const;
const EMPTY = '';

export interface AvatarProps {
  /** Full name — derives the initials, the tint, and the accessible label. */
  name: string;
  /** Diameter in px. Default 40. */
  size?: number;
  /** Optional photo; when set it fills the circle (initials stay the fallback). */
  imageUrl?: string;
  /** Test / accessibility hook. */
  testID?: string;
}

export const Avatar = ({
  name,
  size = DEFAULT_SIZE,
  imageUrl,
  testID,
}: AvatarProps): React.ReactElement => {
  const { theme } = useUi();

  const { backgroundColor, color } = useMemo(
    () => resolveAvatarColors(name, theme),
    [name, theme],
  );
  const initials = useMemo(() => deriveInitials(name), [name]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: size,
          height: size,
          borderRadius: size / RADIUS_DIVISOR,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        image: {
          width: size,
          height: size,
        },
        initials: {
          color,
          fontSize: size * INITIALS_FONT_RATIO,
          fontWeight: INITIALS_FONT_WEIGHT,
        },
      }),
    [size, backgroundColor, color],
  );

  const resolvedUrl = imageUrl === undefined ? EMPTY : imageUrl;
  const hasImage = resolvedUrl !== EMPTY;
  const imageTestID = testID !== undefined ? `${testID}${IMAGE_TESTID_SUFFIX}` : undefined;

  return (
    <View
      testID={testID}
      accessibilityRole={AVATAR_ROLE}
      accessibilityLabel={name}
      style={styles.container}
    >
      {hasImage ? (
        <Image
          testID={imageTestID}
          source={{ uri: resolvedUrl }}
          style={styles.image}
          resizeMode={IMAGE_RESIZE_MODE}
        />
      ) : (
        <Text style={styles.initials}>{initials}</Text>
      )}
    </View>
  );
};

export default Avatar;
