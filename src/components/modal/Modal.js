
import Button from 'components/ui/Button';
import { X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
    Modal as ModalRN,
    StyleSheet,
    Pressable,
    useWindowDimensions,
    View
} from 'react-native';

import { useTheme } from 'theme/useTheme';

const Modal = ({
    isOpen = false,
    setIsOpen = () => { },
    animationType = "fade",
    showCloseButton = true,
    closeOnBackdropPress = false,
    bgStyle,
    modalStyle,
    onClose = () => { },
    children,
}) => {
    const { theme } = useTheme();
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (typeof window !== 'undefined') {
            if (!window.addEventListener) return;
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (typeof window !== 'undefined') {
                if (!window.addEventListener) return;
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [isOpen]);

    const isMobile = width < 768;

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const style = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            cursor: "default"
        },
        modalContent: {
            width: isMobile ? "85%" : "50%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.sm,
            paddingTop: showCloseButton ? 0 : theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: theme.radius.md,
            cursor: "default"

        },
        closeIcon: {
            marginLeft: "auto",
            marginVertical: theme.spacing.xs,
        }
    });

    return (
        <ModalRN
            transparent
            visible={isOpen}
            animationType={animationType}
            onRequestClose={handleClose}
        >
            <Pressable
                style={[style.modalContainer, bgStyle]}
                onPress={closeOnBackdropPress ? handleClose : undefined}
            >
                <Pressable
                    style={[style.modalContent, modalStyle]}
                    onPress={(event) => event.stopPropagation()}
                >
                    {showCloseButton && (
                        <View style={{ width: "100%" }}>
                            <Button
                                variant="ghost"
                                iconSize={22}
                                iconColor={theme.colors.text.text}
                                onPress={handleClose}
                                icon={X}
                                style={style.closeIcon}
                            />
                        </View>
                    )}

                    {children}
                </Pressable>
            </Pressable>
        </ModalRN>
    );
};

export default Modal;
