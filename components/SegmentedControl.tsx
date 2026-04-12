import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { SegmentedControlProps } from "@/types/components";
import React from "react";
import { Button, ButtonGroup, ButtonText } from "./ui/button";

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedValue,
  onValueChange,
  containerStyle,
}) => {
  const colorScheme = useAppColorScheme();

  // Helper to safely extract className and styles
  const customClassName =
    typeof containerStyle === "string"
      ? containerStyle
      : containerStyle?.className || "";

  let customStyle: import("react-native").ViewStyle | undefined;
  if (typeof containerStyle === "object") {
    customStyle = containerStyle.style;
  }

  const btnBg = colorScheme === "light" ? "bg-white shadow-sm" : "bg-[#334156]";

  const btnText =
    colorScheme === "light"
      ? "text-slate-800 font-bold"
      : "text-white font-bold";

  return (
    <ButtonGroup
      flexDirection="row"
      className={`p-1 rounded-2xl w-full items-center ${
        colorScheme === "light" ? "bg-[#EEF0F6]" : "bg-[#162032]"
      } ${customClassName}`}
      style={customStyle}
    >
      {options.map((option) => {
        const isActive = selectedValue === option;

        return (
          <Button
            key={option}
            size="md"
            action="primary"
            onPress={() => onValueChange(option)}
            className={`flex-1 rounded-xl h-11 border-0 ${
              isActive ? btnBg : "bg-transparent"
            }`}
          >
            <ButtonText
              className={`${isActive ? btnText : "text-slate-400 font-medium"}`}
            >
              {option}
            </ButtonText>
          </Button>
        );
      })}
    </ButtonGroup>
  );
};
