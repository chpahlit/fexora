import { styled, Button } from "tamagui";

export const FexoraButton = styled(Button, {
  name: "FexoraButton",
  backgroundColor: "$fexoraPrimary",
  borderRadius: "$4",
  pressStyle: {
    backgroundColor: "$fexoraPrimaryDark",
    opacity: 0.9,
  },
  hoverStyle: {
    backgroundColor: "$fexoraPrimaryLight",
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: "$fexoraPrimary",
      },
      accent: {
        backgroundColor: "$fexoraAccent",
        pressStyle: {
          backgroundColor: "$fexoraAccentLight",
        },
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$fexoraBorder",
        pressStyle: {
          backgroundColor: "$fexoraSurface",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        pressStyle: {
          backgroundColor: "$fexoraSurface",
        },
      },
    },
  } as const,

  defaultVariants: {
    variant: "primary",
  },
});
