import * as LucideIcons from "lucide-react-native";
import { useTheme } from "theme/useTheme";

const DynamicIcon = ({
    name,
    size = 24,
    color,
}) => {
    const {theme} = useTheme();
    const Icon = LucideIcons[name];

    if (!Icon) return null;
    return <Icon size={size} color={color ? color : theme.colors.primary} />;
};

export default DynamicIcon;