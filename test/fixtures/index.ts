import stylex from "@stylexjs/stylex";
// import { vars } from "./vars.stylex";

const fadeIn = stylex.keyframes({
  "0%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});

const styles = stylex.create({
  foo: {
    // backgroundColor: vars.backgroundColor,
    // color: vars.color,
    animation: fadeIn,
  },
  bar: {
    padding: "10px",
  },
});

export default function App() {
  return stylex.props(styles.foo, styles.bar);
}
