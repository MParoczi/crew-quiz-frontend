import { Autocomplete } from "@mantine/core";
import { memo, useCallback, useMemo, useState } from "react";

import styles from "./customAutocomplete.module.css";

interface ICustomAutocompleteProps<T extends Record<string, unknown>> {
  label: string;
  options?: T[];
  keyProperty: keyof T;
  onChange?: (option: T) => void;
}

function CustomAutocomplete<T extends Record<string, unknown>>(props: ICustomAutocompleteProps<T>) {
  const { label, options, keyProperty, onChange } = props;

  const [value, setValue] = useState("");

  const optionList = useMemo(() => {
    return options?.map((option) => {
      return String(option[keyProperty]);
    });
  }, [keyProperty, options]);

  const handleSubmit = useCallback(
    (value: string) => {
      const selectedValue = options?.find((option) => String(option[keyProperty]) === value);
      if (selectedValue) {
        onChange?.(selectedValue);
      }
    },
    [keyProperty, onChange, options],
  );

  function render() {
    return (
      <Autocomplete
        clearable
        variant="filled"
        radius="xs"
        size="md"
        placeholder={label}
        value={value}
        data={optionList}
        onChange={setValue}
        onOptionSubmit={handleSubmit}
        className={styles.autocomplete}
      />
    );
  }

  return render();
}

export default memo(CustomAutocomplete) as typeof CustomAutocomplete;
