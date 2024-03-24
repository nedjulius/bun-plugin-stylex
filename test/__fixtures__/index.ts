import stylex from '@stylexjs/stylex';
import { colors } from './vars.stylex';

const fadeIn = stylex.keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

const styles = stylex.create({
  foo: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    animation: fadeIn,
  },
  bar: {
    color: colors.textSecondary,
  },
});

export default function App() {
  return stylex.props(styles.foo, styles.bar);
}
