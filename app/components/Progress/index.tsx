import { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'react-router';
import { useSpinDelay } from 'spin-delay';
import { twMerge } from 'tailwind-merge';

export function Progress() {
  const transition = useNavigation();
  const busy = transition.state !== 'idle';
  const delayedPending = useSpinDelay(busy, {
    delay: 125,
    minDuration: 125,
  });

  const ref = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(true);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (delayedPending) {
      setAnimationComplete(false);
    }

    const animationPromises = ref.current
      .getAnimations()
      .map(({ finished }) => finished);

    Promise.allSettled(animationPromises).then(() => {
      if (!delayedPending) setAnimationComplete(true);
    });
  }, [delayedPending]);

  return (
    <div
      aria-hidden={!delayedPending}
      className="fixed inset-x-0 top-0 z-50 h-[2px]"
    >
      <div
        ref={ref}
        className={twMerge(
          'ease h-full origin-left scale-x-0 transform-gpu duration-500',
          transition.state === 'idle' &&
            (animationComplete
              ? 'transition-none'
              : 'scale-x-100 transition duration-200'),
          delayedPending && transition.state === 'submitting' && 'scale-x-50',
          delayedPending && transition.state === 'loading' && 'scale-x-75',
        )}
        style={{
          backgroundColor: 'coral',
        }}
      />
    </div>
  );
}
