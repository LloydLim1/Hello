import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Platform,
    StatusBar,
    Modal,
    Pressable
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withRepeat,
    withTiming,
    withDelay,
    interpolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';

// -------------------------------------------------------------------
// 💖 COMPONENT: FLOATING HEARTS BACKGROUND
// -------------------------------------------------------------------
const HEART_COUNT = 15;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Heart = ({ delay }) => {
    const size = useMemo(() => Math.random() * 20 + 20, []);
    const left = useMemo(() => Math.random() * SCREEN_WIDTH, []);
    const duration = useMemo(() => Math.random() * 3000 + 4000, []);

    const translateY = useSharedValue(SCREEN_HEIGHT + 100);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);

    useEffect(() => {
        translateY.value = withDelay(delay, withRepeat(withTiming(-100, { duration }), -1, false));
        opacity.value = withDelay(delay, withRepeat(withSequence(
            withTiming(0.6, { duration: 500 }),
            withTiming(0.6, { duration: duration - 1000 }),
            withTiming(0, { duration: 500 })
        ), -1, false));
        scale.value = withDelay(delay, withRepeat(withTiming(1.2, { duration: duration / 2 }), -1, true));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        opacity: opacity.value,
        left,
    }));

    return (
        <Animated.Text style={[styles.floatingHeart, animatedStyle, { fontSize: size }]}>
            ❤️
        </Animated.Text>
    );
};

const FloatingHearts = () => {
    return (
        <View
            style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
            pointerEvents="none"
        >
            {Array.from({ length: HEART_COUNT }).map((_, i) => (
                <Heart key={i} delay={i * 600} />
            ))}
        </View>
    );
};

// -------------------------------------------------------------------
// 📸 DATA: PHOTOBOOTH STRIPS
// -------------------------------------------------------------------
const photoboothStrips = [
    { id: 101, source: require('../assets/images/photo1.jpg'), caption: "SM Sta.Mesa", description: "Eto pa ung galing ako school HAHAHHA I LOVE YOU", rotation: '-2deg' },
    { id: 102, source: require('../assets/images/photo2.jpg'), caption: "Mall of Asia", description: "NAKALIMUTAN KO SAN TO SORRY BABY I LOVE YOU", rotation: '3deg' },
    { id: 103, source: require('../assets/images/photo3.jpg'), caption: "Ayala Sea Side", description: "ETO ATA UNG NASA SEA SIDE TAYO?? HAHHAHAHA I LOVE YOU OR BAKA SA SHANG ITO", rotation: '-1deg' },
    { id: 104, source: require('../assets/images/photo4.jpg'), caption: "Shangri-La Plaza", description: "ETO RIN HAHAHAHHHA I LOVE YOU BABY", rotation: '-4deg' },
    { id: 105, source: require('../assets/images/photo5.jpg'), caption: "Tomo Coffee", description: "Eto ung parang busy pa ata ako non tas pagod ako, tapos andon rin sila tim AHAHHA i love you", rotation: '2deg' },
    { id: 106, source: require('../assets/images/photo6.jpg'), caption: "Greenhills", description: "ETO UNG NAG DATE TAYO SA GREENHILLS EYYY NAALALA KO HAAHAHA I LOVE YOU", rotation: '3deg' },
    { id: 107, source: require('../assets/images/photo7.jpg'), caption: "Gateway Mall", description: "ETO UNG GALING PA TAYO SA MAKATI HAHAHAHA I LOVE YOU BABY i'm so happy to be with you", rotation: '-1deg' },
];

const successPhoto = require('../assets/images/photo23.jpg');
const initialPhoto = require('../assets/images/photo24.jpg');
const noPhoto = require('../assets/images/photo25.jpg');

const extraPhotos = [
    { id: 8, source: require('../assets/images/Photo8.jpg'), rotation: '4deg' },
    { id: 9, source: require('../assets/images/photo9.jpg'), rotation: '-3deg' },
    { id: 10, source: require('../assets/images/photo10.jpg'), rotation: '2deg' },
    { id: 11, source: require('../assets/images/photo11.jpg'), rotation: '-5deg' },
    { id: 12, source: require('../assets/images/photo12.jpg'), rotation: '3deg' },
    { id: 13, source: require('../assets/images/photo13.jpg'), rotation: '-2deg' },
    { id: 14, source: require('../assets/images/photo14.jpg'), rotation: '4deg' },
    { id: 15, source: require('../assets/images/photo15.jpg'), rotation: '-1deg' },
    { id: 16, source: require('../assets/images/photo16.jpg'), rotation: '2deg' },
    { id: 17, source: require('../assets/images/photo17.jpg'), rotation: '-3deg' },
    { id: 18, source: require('../assets/images/photo18.jpg'), rotation: '5deg' },
    { id: 19, source: require('../assets/images/photo19.jpg'), rotation: '-2deg' },
    { id: 20, source: require('../assets/images/photo20.jpg'), rotation: '1deg' },
    { id: 21, source: require('../assets/images/photo21.jpg'), rotation: '-4deg' },
    { id: 22, source: require('../assets/images/photo22.jpg'), rotation: '3deg' },
];

const myLetter = `
Hello Baby!

Gulat ka noh HAHAHAHA, EWAN KO NALANG KUNG GALIT KA PA SAAKIN. Pero aun nga, I made this for you para maiba naman nabibigay ko sayo HAHAHA

I hope kiligin ka kahit ganto lang. Pero aun, I just want to say thank you for all the things you are doing, helping me, teaching me, caring for me.

I love you so much baby! I want to be with you always and forever. 

Sorry na busy ako palagi lalo na recently, I just want us to have a better future. And andito rin ako para sayo, to support you and love you.

Lalo na sa ginagawa mo ngayon na business. I know parang sa tingin mo di ako supportive. But I am baby, and I always will be.

I love you so much baby! Let's celebrate valentines together okay? mwa

-Lloyd your baby loves

PS: SORRY SA MGA MALING LOCATIONS SA PHOTOBOOTH HAHAHAHA I LOVE YOU
`;

export default function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [yesPressed, setYesPressed] = useState(false);
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isMuted, setIsMuted] = useState(false);

    // Audio Setup
    const player = useAudioPlayer(require('../assets/audio/found.mp3'));

    useEffect(() => {
        async function configureAudio() {
            try {
                // Latest expo-audio way to handle silent mode and active background
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    interruptionMode: 'duckOthers',
                    shouldRouteThroughEarpiece: false,
                });
                console.log("Audio mode configured successfully");
            } catch (e) {
                console.log("Audio mode error:", e);
            }
        }
        configureAudio();
    }, []);

    useEffect(() => {
        if (player && yesPressed && !isMuted) {
            console.log("Attempting to play audio...");
            player.loop = true;
            player.volume = 0.8; // Bumped up for clarity
            player.play();
        }
    }, [player, yesPressed]);

    useEffect(() => {
        if (player) {
            player.muted = isMuted;
        }
    }, [isMuted, player]);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions(window);
        });
        return () => subscription?.remove();
    }, []);

    const moveNoButton = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const { width, height } = dimensions;
        const buttonWidth = 100;
        const buttonHeight = 60;
        const minX = 20;
        const maxX = width - buttonWidth - 20;
        const minY = height * 0.15;
        const maxY = height * 0.80;
        const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        setNoPosition({ x: randomX, y: randomY });
        setHasMoved(true);
    };

    const handleYesPress = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setYesPressed(true);
        setActiveTab('home'); // Now goes directly to home as requested
        if (player) {
            player.play();
        }
    };

    const openPhotoDetail = (photo) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedPhoto(photo);
    };

    const toggleMute = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsMuted(!isMuted);
    };

    const renderContent = () => {
        if (activeTab === 'home') {
            return (
                <View style={[styles.mainWrapper, { zIndex: 1 }]}>
                    {yesPressed ? (
                        <Animated.View
                            entering={FadeInUp.springify().damping(12).mass(1.2)}
                            style={styles.centerContent}
                        >
                            <Animated.View
                                entering={FadeInDown.delay(300).springify()}
                                style={styles.homePhotoContainer}
                            >
                                <Image
                                    source={successPhoto}
                                    style={styles.homePhoto}
                                    resizeMode="cover"
                                />
                                <View style={styles.photoHeart}>
                                    <Text style={{ fontSize: 20 }}>💖</Text>
                                </View>
                            </Animated.View>
                            <Text style={styles.title}>Yay! You said YES!</Text>
                            <Text style={styles.subtitle}>I LOVE YOU BABY</Text>
                        </Animated.View>
                    ) : (
                        <>
                            <Animated.View
                                entering={FadeInDown.delay(200)}
                                style={styles.homePhotoContainer}
                            >
                                <Image
                                    source={hasMoved ? noPhoto : initialPhoto}
                                    style={styles.homePhoto}
                                    resizeMode="cover"
                                />
                            </Animated.View>
                            <Animated.Text entering={FadeInDown.delay(400)} style={styles.title}>Will you be my Valentine?</Animated.Text>

                            <TouchableOpacity
                                style={[styles.button, styles.yesButton]}
                                onPress={handleYesPress}
                            >
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.noButton,
                                    hasMoved ? {
                                        position: 'absolute',
                                        top: noPosition.y,
                                        left: noPosition.x,
                                        zIndex: 9999
                                    } : {}
                                ]}
                                onPress={moveNoButton}
                                activeOpacity={1}
                            >
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            );
        }

        if (activeTab === 'letter') {
            return (
                <View style={{ flex: 1, zIndex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Animated.Text entering={FadeInUp} style={styles.headerTitle}>For You 🌹</Animated.Text>
                        <Animated.View entering={FadeInDown.delay(300)} style={styles.letterWrapper}>
                            <View style={styles.letterDecorativeBorder} />
                            <View style={styles.letterContent}>
                                <Text style={styles.letterText}>{myLetter}</Text>
                                <View style={styles.letterFooter}>
                                    <Text style={styles.letterRose}>🌹</Text>
                                </View>
                            </View>
                        </Animated.View>
                        <View style={{ height: 120 }} />
                    </ScrollView>
                </View>
            );
        }

        if (activeTab === 'photos') {
            return (
                <View style={{ flex: 1, zIndex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.headerTitle}>Our Memories hehe</Text>
                        <View style={styles.divider} />

                        <View style={styles.gridContainer}>
                            {photoboothStrips.map((item, index) => (
                                <Animated.View
                                    key={item.id}
                                    entering={FadeInDown.delay(index * 100)}
                                    style={styles.gridItem}
                                >
                                    <View style={{ transform: [{ rotate: item.rotation || '0deg' }] }}>
                                        <TouchableOpacity
                                            onPress={() => openPhotoDetail(item)}
                                            activeOpacity={0.9}
                                            style={styles.photoContainer}
                                        >
                                            <Image
                                                source={item.source}
                                                style={styles.gridPhoto}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.captionOverlay}>
                                                <Text style={styles.gridCaption} numberOfLines={1}>{item.caption}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            ))}
                        </View>

                        <Text style={[styles.headerTitle, { marginTop: 40, fontSize: 24 }]}>More Snaps of you and me hehe</Text>
                        <View style={[styles.divider, { width: '20%', marginBottom: 20 }]} />

                        <View style={styles.gridContainer}>
                            {extraPhotos.map((item, index) => (
                                <Animated.View
                                    key={item.id}
                                    entering={FadeInDown.delay(500 + (index * 50))}
                                    style={styles.stackedItem}
                                >
                                    <View style={{ transform: [{ rotate: item.rotation || '0deg' }] }}>
                                        <TouchableOpacity
                                            onPress={() => openPhotoDetail(item)}
                                            activeOpacity={0.9}
                                            style={styles.stackedPhotoContainer}
                                        >
                                            <Image
                                                source={item.source}
                                                style={styles.stackedPhoto}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            ))}
                        </View>

                        <View style={{ height: 180 }} />
                    </ScrollView>
                </View>
            );
        }
    };

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#fff1f2', '#ffe4e6', '#fecdd3']}
                    style={StyleSheet.absoluteFill}
                />

                <FloatingHearts />

                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
                    <StatusBar barStyle="dark-content" />

                    <View style={styles.contentArea}>
                        {renderContent()}
                    </View>

                    {/* PHOTO DETAIL MODAL */}
                    <Modal
                        visible={selectedPhoto !== null}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setSelectedPhoto(null)}
                    >
                        <Pressable
                            style={styles.modalOverlay}
                            onPress={() => setSelectedPhoto(null)}
                        >
                            <Animated.View
                                entering={FadeInUp}
                                style={styles.modalContent}
                            >
                                {selectedPhoto && (
                                    <>
                                        <Image
                                            source={selectedPhoto.source}
                                            style={styles.modalImage}
                                            resizeMode="contain"
                                        />

                                        {/* ONLY SHOW DESCRIPTION FOR PHOTOBOOTH STRIPS (IDs > 100) */}
                                        {selectedPhoto.id > 100 && (
                                            <View style={styles.modalTextContainer}>
                                                <Text style={styles.modalTitle}>{selectedPhoto.caption}</Text>
                                                <Text style={styles.modalDescription}>{selectedPhoto.description}</Text>
                                            </View>
                                        )}

                                        <TouchableOpacity
                                            style={[styles.closeButton, selectedPhoto.id <= 100 && { marginTop: 20 }]}
                                            onPress={() => setSelectedPhoto(null)}
                                        >
                                            <Text style={styles.closeButtonText}>Close ❤️</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </Animated.View>
                        </Pressable>
                    </Modal>

                    {/* REDESIGNED FLOATING TAB BAR */}
                    {yesPressed && (
                        <Animated.View
                            entering={FadeInUp.springify().damping(15)}
                            style={styles.floatingTabBarContainer}
                        >
                            <View style={styles.floatingTabBar}>
                                <TouchableOpacity
                                    style={[styles.tabItem, activeTab === 'home' && styles.activeTabItem]}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setActiveTab('home');
                                    }}
                                >
                                    <View style={styles.tabIconWrapper}>
                                        <Text style={[styles.tabIcon, activeTab === 'home' && { opacity: 1 }]}>🏠</Text>
                                        {activeTab === 'home' && <View style={styles.activeDot} />}
                                    </View>
                                    <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeLabel]}>Home</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.tabItem, activeTab === 'letter' && styles.activeTabItem]}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setActiveTab('letter');
                                    }}
                                >
                                    <View style={styles.tabIconWrapper}>
                                        <Text style={[styles.tabIcon, activeTab === 'letter' && { opacity: 1 }]}>💌</Text>
                                        {activeTab === 'letter' && <View style={styles.activeDot} />}
                                    </View>
                                    <Text style={[styles.tabLabel, activeTab === 'letter' && styles.activeLabel]}>Letter</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.tabItem, activeTab === 'photos' && styles.activeTabItem]}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setActiveTab('photos');
                                    }}
                                >
                                    <View style={styles.tabIconWrapper}>
                                        <Text style={[styles.tabIcon, activeTab === 'photos' && { opacity: 1 }]}>📸</Text>
                                        {activeTab === 'photos' && <View style={styles.activeDot} />}
                                    </View>
                                    <Text style={[styles.tabLabel, activeTab === 'photos' && styles.activeLabel]}>Photos</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    )}

                    {/* MUSIC TOGGLE */}
                    <TouchableOpacity
                        style={styles.muteButton}
                        onPress={toggleMute}
                        activeOpacity={0.7}
                    >
                        <Animated.View style={styles.muteIconContainer}>
                            <Text style={styles.muteIcon}>{isMuted ? '🔇' : '🎵'}</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    contentArea: {
        flex: 1,
        zIndex: 5,
    },
    mainWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 40,
        margin: 20,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#e11d48',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 15,
    },
    successBadge: {
        backgroundColor: '#e11d48',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 20,
    },
    successBadgeText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 14,
    },
    homePhotoContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 6,
        borderColor: 'white',
        overflow: 'visible', // For the pop-out heart
        marginBottom: 25,
        shadowColor: '#e11d48',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homePhoto: {
        width: '100%',
        height: '100%',
        borderRadius: 80,
    },
    photoHeart: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: 'white',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    scrollContent: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        paddingBottom: 150, // Space for floating tab bar
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '47%',
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 5,
        marginBottom: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    photoContainer: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    gridPhoto: {
        width: '100%',
        height: 180,
    },
    captionOverlay: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    gridCaption: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4b5563',
        textAlign: 'center',
    },
    stackedItem: {
        width: '47%',
        backgroundColor: 'white',
        padding: 4,
        marginBottom: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#eee',
    },
    stackedPhotoContainer: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        overflow: 'hidden',
    },
    stackedPhoto: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
        color: '#e11d48',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#be185d',
        textAlign: 'center',
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: '#e11d48',
        marginBottom: 5,
        textAlign: 'center',
    },
    divider: {
        width: '40%',
        height: 4,
        backgroundColor: '#fb7185',
        alignSelf: 'center',
        marginBottom: 30,
        borderRadius: 10,
    },
    letterWrapper: {
        backgroundColor: '#fffdf5', // Creamy stationery color
        borderRadius: 20,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 12,
        marginTop: 10,
    },
    letterDecorativeBorder: {
        position: 'absolute',
        top: 15,
        left: 15,
        right: 15,
        bottom: 15,
        borderWidth: 1,
        borderColor: '#fcd34d', // Gold-ish border
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    letterContent: {
        padding: 35,
    },
    letterText: {
        fontSize: 19,
        lineHeight: 34,
        color: '#334155',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        textAlign: 'justify',
    },
    letterFooter: {
        alignItems: 'center',
        marginTop: 30,
    },
    letterRose: {
        fontSize: 30,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 10,
    },
    button: {
        paddingVertical: 20,
        paddingHorizontal: 50,
        borderRadius: 40,
        margin: 15,
        elevation: 10,
        shadowColor: '#e11d48',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    yesButton: {
        backgroundColor: '#e11d48',
    },
    noButton: {
        backgroundColor: '#ff4d4d',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
    },
    modalImage: {
        width: '100%',
        height: 380,
        borderRadius: 20,
    },
    modalTextContainer: {
        paddingVertical: 25,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#e11d48',
        marginBottom: 12,
    },
    modalDescription: {
        fontSize: 17,
        lineHeight: 26,
        color: '#4b5563',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    closeButton: {
        backgroundColor: '#e11d48',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 18,
    },
    floatingTabBarContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10000,
    },
    floatingTabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 50,
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '85%',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#e11d48',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 15,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    tabItem: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 30,
    },
    activeTabItem: {
        backgroundColor: 'rgba(225, 29, 72, 0.08)',
    },
    tabIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 24,
        opacity: 0.6,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#e11d48',
        marginTop: 2,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        marginTop: 2,
    },
    activeLabel: {
        color: '#e11d48',
        fontWeight: '900',
    },
    muteButton: {
        position: 'absolute',
        top: 60,
        right: 25,
        zIndex: 10000,
    },
    muteIconContainer: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#fff',
    },
    muteIcon: {
        fontSize: 24,
    },
    floatingHeart: {
        position: 'absolute',
        bottom: -100,
    },
});
