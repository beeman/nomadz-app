import { CarouselContext } from 'pure-react-carousel';
import { useContext, useEffect, useState } from 'react';

const CarouselCounter = () => {
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);

  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);
  
  return (
    <Text className='pb-4 mt-4 text-xs text-center text-white 2xl:text-sm'>
      {currentSlide + 1} / {carouselContext.state.totalSlides}
    </Text>
  );
};

export default CarouselCounter;
