'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function ImageCarousel({ images = [], autoPlay = true, interval = 2000, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Mount state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      setProgress(0) // Reset progress when changing slides
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  // Progress bar animation
  useEffect(() => {
    if (!autoPlay || images.length <= 1 || !isMounted) return

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + (100 / (interval / 100))
      })
    }, 100)

    return () => clearInterval(progressTimer)
  }, [autoPlay, interval, images.length, currentIndex, isMounted])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className={`relative w-full bg-gradient-to-br from-primary-100 to-accent-100 rounded-[20px] overflow-hidden shadow-xl ${className || 'h-64 sm:h-80 lg:h-96'}`}>
      {/* Main Image Display */}
      <div className="relative w-full h-full">
        <Image
          src={images[currentIndex]}
          alt={`Ferry service ${currentIndex + 1}`}
          fill
          className="object-cover object-center transition-all duration-700 ease-in-out"
          priority={currentIndex === 0}
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          style={{ objectFit: 'cover' }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:shadow-large transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/25 group"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-700 group-hover:text-secondary-900 transition-colors duration-200" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:shadow-large transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/25 group"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-700 group-hover:text-secondary-900 transition-colors duration-200" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === currentIndex
                  ? 'bg-white shadow-medium scale-110'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Loading indicator */}
      {autoPlay && images.length > 1 && isMounted && (
        <div className="absolute bottom-0 left-0 h-1 bg-primary-500/30 w-full">
          <div 
            className="h-full bg-primary-500 transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`
            }}
          ></div>
        </div>
      )}
    </div>
  )
}