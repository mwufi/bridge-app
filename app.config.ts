import { ConfigContext, ExpoConfig } from "expo/config"

const IS_DEV = process.env.APP_VARIANT === "development"
const IS_PREVIEW = process.env.APP_VARIANT === "preview"
const IS_PROD = process.env.APP_VARIANT === "production"

const getAppName = () => {
  return IS_DEV ? "Chat App Dev" : IS_PREVIEW ? "Chat App Preview" : "Chat App"
}

const getUniqueIdentifier = () => {
  return IS_DEV ? "com.araintelligence.chatapp.dev" : IS_PREVIEW ? "com.araintelligence.chatapp.preview" : "com.araintelligence.chatapp"
}

const getSlug = () => {
  return IS_DEV ? "my-app-dev" : IS_PREVIEW ? "my-app-preview" : "my-app"
}

const getScheme = () => {
  return IS_DEV ? "my-app-dev" : IS_PREVIEW ? "my-app-preview" : "my-app"
}

const getBaseUrl = () => {
  return IS_DEV ? "http://localhost:8081" : IS_PREVIEW ? "https://my-app-preview.vercel.app" : "https://my-app.vercel.app"
}

const getApiUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL || (IS_DEV
    ? "https://f6db-71-238-155-26.ngrok-free.app"
    : IS_PREVIEW
      ? "https://api-preview.my-app.com"
      : "https://api.my-app.com")
}

const config = ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    "name": getAppName(),
    "slug": getSlug(),
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": getScheme(),
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "usesAppleSignIn": true,
      "bundleIdentifier": getUniqueIdentifier(),
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "server",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-apple-authentication",
      [
        "expo-router",
        {
          "origin": getBaseUrl()
        }
      ],
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-contacts",
        {
          "contactsPermission": "Allow $(PRODUCT_NAME) to access your contacts."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "b5193418-ccc8-47f7-b25f-e4584de842e3"
      },
      "apiUrl": getApiUrl()
    }
  }
}

export default config