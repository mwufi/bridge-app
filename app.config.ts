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
  return IS_DEV ? "chatapp-dev" : IS_PREVIEW ? "chatapp-preview" : "chatapp"
}

const getScheme = () => {
  return IS_DEV ? "chatapp-dev" : IS_PREVIEW ? "chatapp-preview" : "chatapp"
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
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
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
      }
    }
  }
}

export default config
