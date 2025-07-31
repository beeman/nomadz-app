import { CarouselProvider, Image, Slide, Slider } from 'pure-react-carousel';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons/Icons';
import { CarouselDotGroup } from './CarouselDotGroup';

interface StayCarouselProps {
  stay: any;
  isSquare?: boolean;
}

interface ImageProps {
  src: string;
  alt: string;
  className: string;
  hasMasterSpinner: boolean;
}

function LazyImage({ src, alt, className, hasMasterSpinner }: ImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <View ref={imgRef} className={className}>
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          className={className}
          hasMasterSpinner={hasMasterSpinner}
        />
      )}
    </View>
  );
}

export function StayCarousel({ stay, isSquare = false }: StayCarouselProps) {
  const processedImages = stay?.images?.map(img => 
    img.url.replace('{size}', '640x640')
  ) || [];
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current?.querySelector('.carousel__slider') as HTMLElement;
    if (!slider) return;

    const handleScroll = () => {
      const slideWidth = slider.clientWidth;
      const currentIndex = Math.round(slider.scrollLeft / slideWidth);
      setCurrentSlide(currentIndex);
    };

    slider.addEventListener('scroll', handleScroll);
    return () => slider.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    if (currentSlide >= processedImages.length - 1) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const scrollToPrev = () => {
    if (currentSlide <= 0) {
      setCurrentSlide(processedImages.length - 1);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <CarouselProvider
      naturalSlideWidth={320}
      naturalSlideHeight={220}
      totalSlides={processedImages.length}
      infinite={true}
      className={`@container group h-full ${isSquare ? 'aspect-square' : ''}`}
      isIntrinsicHeight={true}
      hasMasterSpinner={false}
      touchEnabled={true}
      dragEnabled={true}
      currentSlide={currentSlide}
    >
      <View ref={sliderRef}>
        <Slider className="h-full">
          {processedImages.map((image, index) => (
            <Slide index={index} key={index} className="h-full">
              <View className="w-full">
                <LazyImage
                  src={image}
                  alt={`${stay.name} - image ${index + 1}`}
                  className={`object-cover object-center w-full ${isSquare ? 'aspect-square' : 'aspect-[282/187.58]'}`}
                  hasMasterSpinner={false}
                />
              </View>
            </Slide>
          ))}
        </Slider>

        {processedImages.length > 1 && (
          <>
            <button 
              className="carousel__back-button absolute left-1.5 @[180px]:left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollToPrev();
              }}
            >
              <ChevronLeftIcon className="w-3 h-3 @[180px]:w-4 @[180px]:h-4 text-black" />
            </button>

            <button 
              className="carousel__next-button absolute right-1.5 @[180px]:right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollToNext();
              }}
            >
              <ChevronRightIcon className="w-3 h-3 @[180px]:w-4 @[180px]:h-4 text-black" />
            </button>
          </>
        )}

        {stay?.images?.length > 1 && <CarouselDotGroup className='opacity-0 group-hover:opacity-100' />}
      </View>
    </CarouselProvider>
  );
} 