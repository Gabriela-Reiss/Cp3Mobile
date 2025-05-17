import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function Camera() {
    const [permissaoCam, requestPermissaoCam] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [isFrontCamera, setIsFrontCamera] = useState(false);
    const [flashOn, setFlashOn] = useState(false);

    if (!permissaoCam) return <View style={styles.loadingContainer} />;
    
    if (!permissaoCam.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera-off" size={48} color="#333" />
                <Text style={styles.permissionText}>Permissão da câmera não foi concedida</Text>
                <TouchableOpacity 
                    style={styles.permissionButton}
                    onPress={requestPermissaoCam}
                >
                    <Text style={styles.permissionButtonText}>PERMITIR ACESSO</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={isFrontCamera ? "front" : "back"}
                enableTorch={flashOn}
                onBarcodeScanned={({ type, data }) => {
                    console.log(data);
                }}
            />
            
            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setFlashOn(!flashOn)}
                >
                    <Ionicons 
                        name={flashOn ? "flash" : "flash-off"} 
                        size={28} 
                        color="#fff" 
                    />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.switchButton}
                    onPress={() => setIsFrontCamera(!isFrontCamera)}
                >
                    <Ionicons 
                        name="camera-reverse" 
                        size={28} 
                        color="#fff" 
                    />
                </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>Aponte para o código de barras</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionText: {
        fontSize: 18,
        color: '#333',
        marginVertical: 20,
        textAlign: 'center',
    },
    permissionButton: {
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    camera: {
        flex: 1,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    controlButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
});