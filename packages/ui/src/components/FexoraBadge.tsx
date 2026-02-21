import { styled, Text, XStack } from "tamagui";

const BadgeContainer = styled(XStack, {
  name: "FexoraBadge",
  paddingHorizontal: "$2",
  paddingVertical: "$1",
  borderRadius: "$2",
  alignItems: "center",
  justifyContent: "center",

  variants: {
    variant: {
      default: {
        backgroundColor: "$fexoraSurface",
      },
      success: {
        backgroundColor: "$green3",
      },
      warning: {
        backgroundColor: "$yellow3",
      },
      error: {
        backgroundColor: "$red3",
      },
      info: {
        backgroundColor: "$blue3",
      },
    },
  } as const,

  defaultVariants: {
    variant: "default",
  },
});

const BadgeText = styled(Text, {
  name: "FexoraBadgeText",
  fontSize: "$1",
  fontWeight: "600",
});

export function FexoraBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
}) {
  return (
    <BadgeContainer variant={variant}>
      <BadgeText>{children}</BadgeText>
    </BadgeContainer>
  );
}
