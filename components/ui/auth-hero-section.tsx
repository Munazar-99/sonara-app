import { sampleTestimonials } from '@/features/auth/login/utils/contants';
import { TestimonialCard } from './testimonial-card';

export const AuthHeroSection = () => {
  return (
    <section className="relative hidden flex-[1.05] bg-white p-3 dark:bg-[linear-gradient(325deg,#090d14_0%,#0d1420_52%,#10151c_100%)] md:block lg:p-4">
      <div
        className="animate-slide-right animate-delay-300 absolute inset-3 overflow-hidden rounded-2xl border border-transparent bg-cover bg-center dark:border-white/10 lg:inset-4"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80)`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/25 dark:bg-[#05070c]/55" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(135deg,rgba(75,111,255,0.22),rgba(20,184,166,0.10)_42%,rgba(5,7,12,0.20))] dark:block" />
        <div className="absolute left-8 top-8 max-w-md text-white lg:left-10 lg:top-10">
          <p className="animate-element animate-delay-500 text-sm font-medium text-white/80">
            Sonara AI
          </p>
          <h2 className="animate-element animate-delay-600 mt-3 text-3xl font-semibold leading-tight tracking-normal xl:text-4xl">
            A calmer operating layer for voice teams.
          </h2>
        </div>
      </div>
      {sampleTestimonials.length > 0 && (
        <div className="absolute bottom-8 left-1/2 flex w-full -translate-x-1/2 justify-center gap-4 px-8 lg:bottom-10">
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
