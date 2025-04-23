import { useFonts } from 'expo-font';
import { Poppins_100Thin } from '@expo-google-fonts/poppins';
import { EBGaramond_400Regular } from '@expo-google-fonts/eb-garamond';
import { IngridDarling_400Regular } from '@expo-google-fonts/ingrid-darling';
import { PlayfairDisplay_400Regular, PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display';
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from '@expo-google-fonts/cormorant-garamond';

export const useCustomFonts = () => {
    const [fontsLoaded] = useFonts({
        Poppins_100Thin,
        EBGaramond_400Regular,
        IngridDarling_400Regular,
        PlayfairDisplay_400Regular,
        PlayfairDisplay_500Medium,
        CormorantGaramond_300Light,
        CormorantGaramond_400Regular,
    });

    return fontsLoaded;
}; 