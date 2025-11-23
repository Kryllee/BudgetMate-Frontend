import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');


const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale, width as screenWidth, height as screenHeight };
