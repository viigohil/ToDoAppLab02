import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    title: string;
}

const Header: React.FC<Props> = ({title}) => {
    return(
        <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: 20,
        alignItems: 'center',
        borderBottomColor: '#BAE1FF',
        borderBottomWidth: 1
    },
    headerText: {
        fontSize: 20,
        color: '#560401'
    }
});

export default Header;