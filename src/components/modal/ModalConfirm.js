import Button from 'components/ui/Button';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'theme/useTheme';
import Modal from './Modal';
import Title from 'components/Text/Title';
import Text from 'components/Text/Text';

const ModalConfirm = ({ 
    isOpen = false, 
    setIsOpen = () => { }, 
    title, 
    content, 
    
    bgStyle,
    modalStyle,

    closeOnBackdropPress = false,

    animationType = "fade", 
    cancelLabel = "Cancelar", 
    confirmLabel = "Confirmar", 
    onConfirm = () => { }, 
    onCancel = () => { } 
}) => {
    const { theme } = useTheme();

    const handleConfirm = () => {
        onConfirm();
    }

    const handleCancel = () => {
        setIsOpen(false);
        onCancel();
    }

    const customStyles = StyleSheet.create({
        modalContent: {
            width: "100%",
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
        },
        modalTitle: {
            marginBottom: 10,
            textAlign: "center",
        },
        modalText: {
            color: theme.colors.textPrimary,
            textAlign: "justify",
        },
        modalButtons: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
        },
        modalButton: {
            flex: 1,
            borderRadius: 8,
            alignItems: "center",
        },
    });


    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            animationType={animationType}
            showCloseButton={false}
            bgStyle={bgStyle}
            modalStyle={modalStyle}
            closeOnBackdropPress={closeOnBackdropPress}
            onClose={onCancel}
        >
            <View style={customStyles.modalContent}>
                <Title style={[customStyles.modalTitle]}>{title}</Title>
                <Text style={[customStyles.modalText, content ? { marginBottom: 30 } : {}]}>{content}</Text>
                <View style={customStyles.modalButtons}>
                    <Button
                        variant="secondary"
                        style={[customStyles.modalButton]}
                        onPress={handleCancel}
                    >{cancelLabel}</Button>

                    <Button
                        style={[customStyles.modalButton]}
                        onPress={handleConfirm}
                    >{confirmLabel}</Button>
                </View>
            </View>
        </Modal>
    )
}

export default ModalConfirm
