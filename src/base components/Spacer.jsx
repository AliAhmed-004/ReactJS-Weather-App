export default function Spacer({ size = 42, direction = "vertical" }) {
  const style =
    direction === "vertical"
      ? { height: size }
      : { width: size, display: "inline-block" };

  return <div style={style} />;
}
