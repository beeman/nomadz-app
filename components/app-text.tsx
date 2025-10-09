import { Text, TextProps } from 'react-native-paper'

export function AppText({ ...rest }: TextProps<Text>) {
  return <Text {...rest} />
}

AppText.displayName = 'AppText'
