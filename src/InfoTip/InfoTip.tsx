import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { useInfoTipDismiss } from './useInfoTipDismiss';

const MIN_TARGET_PX = 44;
const GLYPH_SIZE = 20;
const GLYPH_RADIUS = 10;
const GLYPH_FONT_SIZE = 13;
const BUBBLE_MIN_WIDTH = 220;
const BUBBLE_MAX_WIDTH = 320;
const BUBBLE_RADIUS = 12;
const BUBBLE_PADDING = 12;
const BUBBLE_Z_INDEX = 20;
const BUBBLE_SHADOW_RADIUS = 12;
const BUBBLE_SHADOW_OFFSET_Y = 4;
const BUBBLE_SHADOW_OPACITY = 0.16;
const GLYPH = 'i';
const BUBBLE_SUFFIX = '-bubble';
const TRIGGER_SUFFIX = '-trigger';

export interface InfoTipProps {
  label: string;
  accessibilityHint: string;
  content: React.ReactNode;
  children?: React.ReactNode;
  testID?: string;
}

interface OpenState {
  pinned: boolean;
  hovered: boolean;
  focused: boolean;
}

const CLOSED: OpenState = { pinned: false, hovered: false, focused: false };

const styles = StyleSheet.create({
  root: { position: 'relative', alignSelf: 'flex-start' },
  trigger: { minWidth: MIN_TARGET_PX, minHeight: MIN_TARGET_PX, justifyContent: 'center', alignItems: 'flex-start' },
  glyph: {
    width: GLYPH_SIZE,
    height: GLYPH_SIZE,
    borderRadius: GLYPH_RADIUS,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphText: { fontSize: GLYPH_FONT_SIZE, fontWeight: '700' },
  bubble: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: BUBBLE_Z_INDEX,
    minWidth: BUBBLE_MIN_WIDTH,
    maxWidth: BUBBLE_MAX_WIDTH,
    padding: BUBBLE_PADDING,
    borderRadius: BUBBLE_RADIUS,
    borderWidth: 1,
    shadowOffset: { width: 0, height: BUBBLE_SHADOW_OFFSET_Y },
    shadowRadius: BUBBLE_SHADOW_RADIUS,
    shadowOpacity: BUBBLE_SHADOW_OPACITY,
  },
});

const suffixed = (testID: string | undefined, suffix: string): string | undefined =>
  testID === undefined ? undefined : `${testID}${suffix}`;

/** A trigger that shows `content` as a tooltip on hover, focus or press. */
export const InfoTip = ({ label, accessibilityHint, content, children, testID }: InfoTipProps): React.ReactElement => {
  const { theme } = useUi();
  const rootRef = useRef<View>(null);
  const [state, setState] = useState<OpenState>(CLOSED);
  const open = state.pinned || state.hovered || state.focused;
  const close = useCallback((): void => setState(CLOSED), []);
  useInfoTipDismiss(open, rootRef, close);

  const colors = useMemo(
    () => ({
      bubble: { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border, shadowColor: theme.colors.text },
      glyph: { borderColor: theme.colors.text },
      glyphText: { color: theme.colors.text },
    }),
    [theme.colors],
  );
  const set = (patch: Partial<OpenState>): void => setState((prev) => ({ ...prev, ...patch }));

  return (
    <View ref={rootRef} style={styles.root} testID={testID}>
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={styles.trigger}
        testID={suffixed(testID, TRIGGER_SUFFIX)}
        onBlur={() => set({ focused: false })}
        onFocus={() => set({ focused: true })}
        onHoverIn={() => set({ hovered: true })}
        onHoverOut={() => set({ hovered: false })}
        onPress={() => setState((prev) => (prev.pinned ? CLOSED : { ...prev, pinned: true }))}
      >
        {children ?? (
          <View style={[styles.glyph, colors.glyph]}>
            <Text style={[styles.glyphText, colors.glyphText]}>{GLYPH}</Text>
          </View>
        )}
      </Pressable>
      {open ? (
        <View role="tooltip" style={[styles.bubble, colors.bubble]} testID={suffixed(testID, BUBBLE_SUFFIX)}>
          {content}
        </View>
      ) : null}
    </View>
  );
};
