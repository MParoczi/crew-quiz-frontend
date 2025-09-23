import { Card, Text } from "@mantine/core";
import classes from "./infoCard.module.css";

interface IInfoCardProps {
  text: string;
  type?: "info" | "warning" | "error";
}

function InfoCard(props: IInfoCardProps) {
  const { text, type = "info" } = props;

  function getInfoCardStyle() {
    switch (type) {
      case "info":
        return classes.infoCard_render_card_info;
      case "warning":
        return classes.infoCard_render_card_warning;
      case "error":
        return classes.infoCard_render_card_error;
      default:
        return classes.infoCard_render_card_info;
    }
  }

  function render() {
    return (
      <Card padding="lg" radius="xs" withBorder ta="center" className={getInfoCardStyle()}>
        <Text size="md" fw={500}>
          {text}
        </Text>
      </Card>
    );
  }

  return render();
}

export default InfoCard;
