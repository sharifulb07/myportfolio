
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';




  import './global.css';
import { View , Text, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function App() {
  return (
    <SafeAreaView className='flex-1'>
    <View>
     <Text className='px-8 text-3xl text-orange-600 font-bold'> Welcome @Shariful Islam</Text>
    <ScrollView className='px-8 py-4'>
      <View className='h-10 bg-black rounded-lg flex justify-center items-center   text-white'> <Text className=' text-white '>Bluue Moon</Text></View>


      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

