import * as React from "react"
import { cn } from "@/lib/utils"

type CarouselProps = {
  children: React.ReactNode[] | React.ReactNode
  className?: string
  initialIndex?: number
}

export function Carousel({ children, className, initialIndex = 0 }: CarouselProps) {
  const slides = React.Children.toArray(children)
  const [index, setIndex] = React.useState(initialIndex)

  const goNext = () => setIndex((i) => (i + 1) % slides.length)
  const goPrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "transition-opacity duration-300",
              i === index ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
            )}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 items-center">
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#212431] hover:bg-[#181a22] text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex gap-1 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "block h-2 w-2 rounded-full transition-colors",
                i === index ? 'bg-[#212431]' : 'bg-gray-300'
              )}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          aria-label="Next"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#212431] hover:bg-[#181a22] text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Carousel
