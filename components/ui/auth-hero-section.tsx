import { sampleTestimonials } from '@/features/auth/login/utils/contants';
import { TestimonialCard } from './testimonial-card';

export const AuthHeroSection = () => {
  return (
    <section className="relative hidden flex-1 p-4 md:block">
      <div
        className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80)`,
        }}
      ></div>
      {sampleTestimonials.length > 0 && (
        <div className="absolute bottom-8 left-1/2 flex w-full -translate-x-1/2 justify-center gap-4 px-8">
          <TestimonialCard
            testimonial={sampleTestimonials[0]}
            delay="animate-delay-1000"
          />
          {sampleTestimonials[1] && (
            <div className="hidden xl:flex">
              <TestimonialCard
                testimonial={sampleTestimonials[1]}
                delay="animate-delay-1200"
              />
            </div>
          )}
          {sampleTestimonials[2] && (
            <div className="hidden 2xl:flex">
              <TestimonialCard
                testimonial={sampleTestimonials[2]}
                delay="animate-delay-1400"
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
