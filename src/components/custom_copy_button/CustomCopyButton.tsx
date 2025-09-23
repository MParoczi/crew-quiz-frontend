import { ActionIcon, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

interface ICustomCopyButtonProps {
  value: string;
  text: string;
}

function CustomCopyButton(props: ICustomCopyButtonProps) {
  const { value, text } = props;
  function render() {
    return (
      <CopyButton value={value}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? "Copied!" : text}>
            <ActionIcon color={copied ? "success" : "gray"} variant="light" onClick={copy} radius="xs" size="lg">
              {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    );
  }

  return render();
}

export default CustomCopyButton;
