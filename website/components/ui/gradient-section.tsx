import { cn } from "@/lib/utils";

interface GradientSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "hero" | "footer" | "default" | "plain";
  children: React.ReactNode;
}

export function GradientSection({
  variant = "default",
  className,
  children,
  ...props
}: GradientSectionProps) {
  return (
    <section
      className={cn(
        "relative py-12 overflow-hidden",
        {
          "py-16": variant === "hero",
          "bg-white": variant === "plain",
        },
        className
      )}
      {...props}
    >
      {/* Background Image for hero, footer, and default sections */}
      {(variant === "hero" || variant === "footer" || variant === "default") && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/Gemini_Generated_Image_aii1bbaii1bbaii1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay for better text visibility with different opacities */}
          <div 
            className={cn(
              "absolute inset-0",
              {
                "bg-black/30 backdrop-blur-[1px]": variant === "hero",
                "bg-black/40 backdrop-blur-[2px]": variant === "default",
                "bg-black/50 backdrop-blur-[3px]": variant === "footer",
              }
            )}
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}