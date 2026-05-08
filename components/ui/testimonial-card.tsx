import { Testimonial } from '@/features/auth/login/utils/types';

export const TestimonialCard = ({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: string;
}) => (
  <div
    className={`animate-testimonial ${delay} flex w-64 items-start gap-3 rounded-3xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl dark:bg-zinc-800/40`}
  >
    <img
      src={testimonial.avatarSrc}
      width={40}
      height={40}
      className="h-10 w-10 rounded-2xl object-cover"
      alt="avatar"
    />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

//TODO : REPLACE img WITH NEXT IMAGE COMPONENT AND HANDLE EXTERNAL IMAGES PROPERLY
