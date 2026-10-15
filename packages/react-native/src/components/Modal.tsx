import { useEffect, useRef, type ReactNode } from 'react';
import { AccessibilityInfo, findNodeHandle, Modal as RNModal, Pressable, ScrollView, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { Button } from './Button';

export interface ModalProps {
  /** Whether the dialog is shown. Open it only from a tap, never on load or scroll. */
  visible: boolean;
  /** Called by the close button, a scrim tap (when allowed) and the hardware back button / Esc. */
  onClose: () => void;
  /** Task or question: "Get the dot.Bible app". Also the accessible name of the dialog. */
  title: string;
  /** Body content, 16dp, one or two sentences or a short form. */
  children?: ReactNode;
  /** Footer: a secondary button, then one primary. Right-aligned. */
  footer?: ReactNode;
  /** Max width 400 (`s`) or 560 (`m`). @default "s" */
  size?: 's' | 'm';
  /** Closing by tapping the scrim. @default true */
  dismissOnScrim?: boolean;
  /** Show the 44dp close button. @default true */
  showClose?: boolean;
  /** Accessible name of the close button. @default "Close" */
  closeLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Hooks shared by `Modal` and `ConfirmDialog`: moves screen-reader focus to a node when the dialog opens. */
function useFocusOnOpen(visible: boolean) {
  const ref = useRef<View>(null);
  useEffect(() => {
    if (!visible) return undefined;
    const t = setTimeout(() => {
      try {
        const node = ref.current ? findNodeHandle(ref.current) : null;
        if (node) AccessibilityInfo.setAccessibilityFocus?.(node);
      } catch {
        // not supported on this platform
      }
    }, 100);
    return () => clearTimeout(t);
  }, [visible]);
  return ref;
}

interface FrameProps {
  visible: boolean;
  onRequestClose: () => void;
  onScrimPress?: () => void;
  maxWidth: number;
  accessibilityLabel: string;
  alert?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function DialogFrame({ visible, onRequestClose, onScrimPress, maxWidth, accessibilityLabel, alert, children, style, testID }: FrameProps) {
  const { colors, radius, shadow } = useTheme();
  const { height } = useWindowDimensions();
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose} statusBarTranslucent supportedOrientations={['portrait', 'landscape']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: colors.scrim }}>
        <Pressable
          accessible={false} importantForAccessibility="no" onPress={onScrimPress} disabled={!onScrimPress}
          style={{ position: 'absolute', top: 0, bottom: 0, start: 0, end: 0 }}
        />
        <View
          accessibilityViewIsModal
          accessibilityRole={alert ? 'alert' : undefined}
          accessibilityLabel={accessibilityLabel}
          testID={testID}
          style={[
            {
              width: '100%', maxWidth, maxHeight: height - 32, backgroundColor: colors.surface, borderRadius: radius['radius-lg'], overflow: 'hidden',
              ...shadow['shadow-overlay'],
            },
            style,
          ]}
        >
          {children}
        </View>
      </View>
    </RNModal>
  );
}

/** Dialog over a dimmed scrim for one short task: title, 44dp close button, body and footer. Wraps the native Modal. */
export function Modal({ visible, onClose, title, children, footer, size = 's', dismissOnScrim = true, showClose = true, closeLabel = 'Close', style, testID }: ModalProps) {
  const { colors } = useTheme();
  const titleRef = useFocusOnOpen(visible);
  return (
    <DialogFrame
      visible={visible} onRequestClose={onClose} onScrimPress={dismissOnScrim ? onClose : undefined} maxWidth={size === 'm' ? 560 : 400}
      accessibilityLabel={title} style={style} testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, paddingTop: 20, paddingStart: 24, paddingEnd: showClose ? 20 : 24 }}>
        <View ref={titleRef} accessible accessibilityRole="header" style={{ flex: 1, paddingTop: 10 }}>
          <Text variant="web-h4" style={{ fontSize: 20, lineHeight: 26, color: colors.text }}>{title}</Text>
        </View>
        {showClose ? (
          <Pressable
            accessibilityRole="button" accessibilityLabel={closeLabel} onPress={onClose}
            style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? colors.surfaceMuted : 'transparent' })}
          >
            <UiIcon name="close" size={20} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
      <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ paddingTop: 12, paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
        {typeof children === 'string' ? <Text variant="web-body" tone="body" style={{ fontSize: 16, lineHeight: 25 }}>{children}</Text> : children}
      </ScrollView>
      {footer ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 12, paddingVertical: 16, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: colors.border }}>
          {footer}
        </View>
      ) : null}
    </DialogFrame>
  );
}

export interface ConfirmDialogProps {
  visible: boolean;
  /** Called by Cancel, the hardware back button and Esc. A scrim tap does nothing. */
  onCancel: () => void;
  /** Called by the confirm button. */
  onConfirm: () => void;
  /** The question: "Remove this partner?" Never "Are you sure?" alone. */
  title: string;
  /** What will happen, one or two sentences. */
  description: string;
  /** Names the action: "Remove partner", never "OK" or "Yes". */
  confirmLabel: string;
  /** Dismiss label. @default "Cancel" */
  cancelLabel?: string;
  /** Red confirm button and trash icon for actions that cannot be undone. Neutral uses the blue primary. @default false */
  destructive?: boolean;
  testID?: string;
}

/** Confirmation (alert dialog): no close X, Cancel and one named action. Cancel gets screen-reader focus first. */
export function ConfirmDialog({ visible, onCancel, onConfirm, title, description, confirmLabel, cancelLabel = 'Cancel', destructive = false, testID }: ConfirmDialogProps) {
  const { colors } = useTheme();
  const cancelRef = useFocusOnOpen(visible);
  return (
    <DialogFrame visible={visible} onRequestClose={onCancel} maxWidth={400} accessibilityLabel={`${title}. ${description}`} alert testID={testID}>
      <View style={{ flexDirection: 'row', gap: 16, paddingTop: 24, paddingHorizontal: 24, paddingBottom: 20 }}>
        <View
          accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
          style={{ width: 48, height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: destructive ? colors.errorBg : colors.tint }}
        >
          <UiIcon name={destructive ? 'trash' : 'info'} size={24} color={destructive ? colors.error : colors.link} />
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <Text variant="web-h4" accessibilityRole="header" style={{ fontSize: 20, lineHeight: 26, color: colors.text }}>{title}</Text>
          <Text variant="web-small" tone="body">{description}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 12, paddingVertical: 16, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Button ref={cancelRef} variant="secondary" size="sm" onPress={onCancel} style={{ minHeight: 44 }}>{cancelLabel}</Button>
        <Button
          size="sm" onPress={onConfirm}
          style={destructive ? { backgroundColor: color['error'], borderColor: color['error'], minHeight: 44 } : { minHeight: 44 }}
        >
          {confirmLabel}
        </Button>
      </View>
    </DialogFrame>
  );
}
