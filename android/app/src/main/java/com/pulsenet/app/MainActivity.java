package com.pulsenet.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

// This Java file acts as the Native Android OS shell for your React application.
// It initializes the hardware bridge for Camera, Microphone, and Push Notifications.
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Native Android OS initializations can be added here
        // The Capacitor bridge will automatically mount your React App.js into the WebView
    }
}