import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export type IconName =
  | 'chevron-left'
  | 'chevron-down'
  | 'arrow-right'
  | 'arrow-down'
  | 'check'
  | 'loader'
  | 'alert-triangle'
  | 'info'
  | 'x'
  | 'share'
  | 'file-text'
  | 'pencil'
  | 'plus';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

/**
 * Set de ícones Lucide (traço 1.5) usado no app inteiro — desenhados na mão
 * com react-native-svg em vez de instalar a biblioteca inteira: só 13 ícones
 * aparecem no produto.
 */
export function Icon({ name, size = 20, color = 'currentColor' }: Props) {
  if (name === 'loader') return <SpinningIcon size={size} color={color} />;

  const spec = ICONS[name];

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {spec.circles?.map((c, i) => (
        <Circle key={i} {...c} fill="none" {...STROKE} stroke={color} />
      ))}
      {spec.paths.map((d, i) => (
        <Path key={i} d={d} fill="none" {...STROKE} stroke={color} />
      ))}
    </Svg>
  );
}

function SpinningIcon({ size, color }: { size: number; color: string }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ rotate }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21 12a9 9 0 1 1-6.2-8.6" {...STROKE} stroke={color} />
      </Svg>
    </Animated.View>
  );
}

const STROKE = {
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

type IconSpec = { paths: string[]; circles?: { cx: number; cy: number; r: number }[] };

const ICONS: Record<Exclude<IconName, 'loader'>, IconSpec> = {
  'chevron-left': { paths: ['M15 18L9 12L15 6'] },
  'chevron-down': { paths: ['M6 9L12 15L18 9'] },
  'arrow-right': { paths: ['M5 12H19', 'M12 5L19 12L12 19'] },
  'arrow-down': { paths: ['M12 5V19', 'M19 12L12 19L5 12'] },
  check: { paths: ['M20 6L9 17L4 12'] },
  'alert-triangle': {
    paths: [
      'M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
      'M12 9V13',
      'M12 17H12.01',
    ],
  },
  info: { paths: ['M12 16V12', 'M12 8H12.01'], circles: [{ cx: 12, cy: 12, r: 9 }] },
  x: { paths: ['M18 6L6 18', 'M6 6L18 18'] },
  share: { paths: ['M7 17L17 7', 'M7 7H17V17'] },
  'file-text': {
    paths: [
      'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z',
      'M14 2V7H20',
      'M8 13H16',
      'M8 17H13',
    ],
  },
  pencil: {
    paths: ['M12 20H21', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'],
  },
  plus: { paths: ['M5 12H19', 'M12 5V19'] },
};
