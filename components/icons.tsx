import {
  BadgePercent,
  CalendarDays,
  CreditCard,
  FileText,
  Fingerprint,
  Globe2,
  HandCoins,
  Hash,
  Home,
  Landmark,
  Layers3,
  MapPin,
  MessageCircleMore,
  Monitor,
  ReceiptText,
  ScanSearch,
  ShieldCheck,
  SmartphoneCharging,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  smartphone: SmartphoneCharging,
  receipt: ReceiptText,
  calendar: HandCoins,
  hash: Fingerprint,
  shield: ScanSearch,
  message: MessageCircleMore,
  map: MapPin,
  globe: Landmark,
  monitor: Monitor,
  layers: Layers3,
  home: Home,
  card: CreditCard,
  document: FileText,
  wallet: WalletCards,
  percent: BadgePercent,
};

export function ContentIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = icons[name] ?? Layers3;
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
