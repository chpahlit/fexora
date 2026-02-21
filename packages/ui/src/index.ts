export { default as config } from "./tamagui.config";
export type { FexoraConfig } from "./tamagui.config";

// Re-export core Tamagui primitives for convenience
export {
  Button,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Input,
  Label,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  styled,
  Text,
  TextArea,
  Theme,
  View,
  XStack,
  YStack,
  ZStack,
  Avatar,
  Card,
  Sheet,
  Switch,
  Tabs,
  ScrollView,
  TamaguiProvider,
} from "tamagui";
export type { TamaguiProviderProps } from "tamagui";

// Custom shared components
export { FexoraButton } from "./components/FexoraButton";
export { FexoraBadge } from "./components/FexoraBadge";
