import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Platform,
    Image,
    ScrollView,
    SafeAreaView
} from 'react-native';

// -------------------------------------------------------------------
// 📸 CONFIGURATION ZONE: ADD YOUR PHOTOS HERE
// -------------------------------------------------------------------
// Instructions:
// 1. Place your photos in the 'assets' folder of your Expo project.
// 2. Update the 'source' line to match your file names (e.g., require('./assets/us.jpg'))
// 3. Or use a URL link (e.g., { uri: 'https://example.com/photo.jpg' })
const memories = [
    {
        id: 1,
        // PLACEHOLDER: Replace the URI below with your image
        source: { uri: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500' },
        caption: "The day we met ❤️",
        rotation: '-3deg'
    },
    {
        id: 2,
        source: { uri: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500' },
        caption: "Our first trip together ✈️",
        rotation: '2deg'
    },
    {
        id: 3,
        source: { uri: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500' },
        caption: "Best dinner ever 🍕",
        rotation: '-2deg'
    },
    {
        id: 4,
        source: { uri: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=500' },
        caption: "Just being silly 🤪",
        rotation: '4deg'
    },
];

const { width, height } = Dimensions.get('window');

export default function App() {
    const [yesPressed, setYesPressed] = useState(false);
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [isRelocated, setIsRelocated] = useState(false);

    // Logic to move the No button
    const moveNoButton = () => {
        const randomX = Math.floor(Math.random() * (width - 150));
        const randomY = Math.floor(Math.random() * (height - 150));
        setNoPosition({ x: randomX, y: randomY });
        setIsRelocated(true);
    };

    // -------------------------------------------------------
    // SCREEN 1: THE SUCCESS / PHOTO GALLERY SCREEN
    // -------------------------------------------------------
    if (yesPressed) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.galleryContainer}>
                    <Text style={styles.yayTitle}>Yay! I Love You! 💖</Text>
                    <Text style={styles.yaySubtitle}>Here are some of my favorite moments...</Text>

                    {memories.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.polaroid,
                                { transform: [{ rotate: item.rotation }] }
                            ]}
                        >
                            <Image source={item.source} style={styles.photo} />
                            <Text style={styles.caption}>{item.caption}</Text>
                        </View>
                    ))}

                    <Text style={styles.footer}>Can't wait to make more memories! 🌹</Text>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // -------------------------------------------------------
    // SCREEN 2: THE QUESTION SCREEN
    // -------------------------------------------------------
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>💌</Text>
            <Text style={styles.title}>Will you be my Valentine?</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.yesButton]}
                    onPress={() => setYesPressed(true)}
                >
                    <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.noButton,
                        isRelocated ? { position: 'absolute', top: noPosition.y, left: noPosition.x } : {}
                    ]}
                    onPress={moveNoButton}
                    onMouseEnter={Platform.OS === 'web' ? moveNoButton : undefined}
                    activeOpacity={1}
                >
                    <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Main Layout
    container: {
        flex: 1,
        backgroundColor: '#ffe4e6', // Soft Pink
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Gallery Styles
    galleryContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        width: '100%',
    },
    yayTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e11d48',
        marginBottom: 10,
        textAlign: 'center',
    },
    yaySubtitle: {
        fontSize: 18,
        color: '#be185d',
        marginBottom: 30,
        textAlign: 'center',
    },
    footer: {
        marginTop: 30,
        fontSize: 16,
        color: '#881337',
        fontStyle: 'italic',
    },

    // Polaroid Effect
    polaroid: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 30,
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    photo: {
        width: width * 0.75, // Responsive width (75% of screen)
        height: width * 0.75, // Square photo
        borderRadius: 2,
        backgroundColor: '#eee', // Placeholder gray while loading
    },
    caption: {
        marginTop: 15,
        fontSize: 18,
        color: '#333',
        fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'sans-serif-light', // Handwriting style font if available
    },

    // Button Styles
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#be185d',
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    emoji: {
        fontSize: 60,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 100,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        margin: 10,
        elevation: 3,
    },
    yesButton: {
        backgroundColor: '#4ade80',
    },
    noButton: {
        backgroundColor: '#f43f5e',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});