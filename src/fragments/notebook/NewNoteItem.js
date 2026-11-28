import Line from 'components/layout/Line';
import Text from 'components/Text/Text';
import NoteRepository from 'database/repositories/note';
import { router } from 'expo-router';
import { FilePlus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'theme/useTheme';

const NewNoteItem = ({idNotebook}) => {
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const isMobile = width < 768;

    const handleCreate = async() => {
        try{
            const result = await NoteRepository.createEmptyNote(idNotebook);
            router.push({
                pathname: "/notebooks/"+result.lastInsertRowId,
                params: {
                    edit: true
                }
            });
        }catch(err){
            console.error(err);
            alert("Ocurrio un error", err);
        }

    }

    const styles = StyleSheet.create({
        container: {
            aspectRatio: 4/3,
            maxHeight: 250,
            width: isMobile ? '49.5%' : '24.25%',
            marginVertical: theme.spacing.xs,

            padding: theme.spacing.md,
            paddingBottom: 0,

            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            borderWidth: 1,
        },

        content: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        }
    });

    return (
        <TouchableOpacity
            onPress={handleCreate}
            style={styles.container}
        >
            <View style={styles.content}>
                <FilePlus
                    color={theme.colors.text.secondary}
                    size={35}
                />
                <Text
                    variant="secondary"
                    font="semibold"
                >Crear nota</Text>
            </View>
        </TouchableOpacity>
    );
};

export default NewNoteItem;