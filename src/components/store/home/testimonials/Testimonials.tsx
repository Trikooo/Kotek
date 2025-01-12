import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

interface Testimonial {
  quote: string;
  name: string;
  title?: string;
  image?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32">
      {/* Top Left Quote */}
      <FaQuoteLeft className="absolute top-20 left-0 w-80 h-80 text-indigo-600 opacity-10" />
      {/* Bottom Right Quote */}
      <FaQuoteRight className="absolute bottom-0 right-0 w-80 h-80 text-indigo-600 opacity-10" />

      <div className="container ">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            What Our Customers Say
          </h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Hear from our satisfied customers about their experience with our
            service
          </p>
        </div>
        <div className="mx-4 grid items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden animate-float`}
              style={{
                animationDelay: `${index * 0.5}s`, // Stagger the float animation
              }}
            >
              <div className="p-6">
                <FaQuoteLeft className="h-7 w-7 mb-4 text-indigo-500" />
                <p className="mb-4 text-lg">{testimonial.quote}</p>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 overflow-visible">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-indigo-500" />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    {testimonial.title && (
                      <p className="text-sm text-gray-500">
                        {testimonial.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
