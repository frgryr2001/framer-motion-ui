'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useState } from 'react';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  Variant,
  Variants,
} from 'framer-motion';
import useMeasure from 'react-use-measure';

let variants: Variants = {
  enter: (direction) => {
    console.log('enter', direction);
    return {
      x: `${direction * 100}%`,
      opacity: 0,
    };
  },
  middle: { x: 0, opacity: 1 },
  exit: (direction) => {
    console.log('exit', direction);

    return { x: `${-100 * direction}%`, opacity: 0 };
  },
};
let removeImmediately: Variants = {
  exit: { visibility: 'collapse' },
};

export default function Page() {
  let [monthString, setMonthString] = useState(format(new Date(), 'yyyy-MM'));
  let month = parse(monthString, 'yyyy-MM', new Date());
  let [direction, setDirection] = useState<number>();
  let [isAnimating, setIsAnimating] = useState(false);
  let [ref, bounds] = useMeasure();

  function nextMonth() {
    if (isAnimating) return;
    let next = addMonths(month, 1);

    setMonthString(format(next, 'yyyy-MM'));
    setDirection(1);
    setIsAnimating(true);
  }

  function previousMonth() {
    if (isAnimating) return;
    let previous = subMonths(month, 1);

    setMonthString(format(previous, 'yyyy-MM'));
    setDirection(-1);
    setIsAnimating(true);
  }

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  return (
    <MotionConfig
      transition={{
        duration: 0.25,
        type: 'spring',
        bounce: 0,
      }}
    >
      <div className="flex min-h-screen items-start bg-stone-800 pt-16 text-stone-900">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white relative overflow-hidden">
          <div className="py-8">
            <div className="flex flex-col justify-center rounded text-center ">
              <motion.div
                animate={{
                  height: bounds.height > 0 ? bounds.height : 'auto',
                }}
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.8,
                }}
              >
                <div ref={ref}>
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                    onExitComplete={() => {
                      setIsAnimating(false);
                    }}
                  >
                    <motion.div
                      key={monthString}
                      initial="enter"
                      animate="middle"
                      exit="exit"
                    >
                      <header className="relative flex justify-between px-8">
                        <motion.button
                          variants={removeImmediately}
                          className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                          onClick={previousMonth}
                        >
                          <ChevronLeftIcon className="h-4 w-4" />
                        </motion.button>
                        <motion.p
                          variants={variants}
                          custom={direction}
                          className="absolute inset-0 flex items-center justify-center font-semibold "
                        >
                          {format(month, 'MMMM yyyy')}
                        </motion.p>
                        <motion.button
                          variants={removeImmediately}
                          className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                          onClick={nextMonth}
                        >
                          <ChevronRightIcon className="h-4 w-4" />
                        </motion.button>

                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              'linear-gradient(to right, white 15%, transparent 30%, transparent 70%, white 85%)',
                          }}
                        />
                      </header>
                      <motion.div
                        variants={removeImmediately}
                        className="mt-6 grid grid-cols-7 gap-y-6 px-8 text-sm"
                      >
                        <span className="font-medium text-stone-500">Su</span>
                        <span className="font-medium text-stone-500">Mo</span>
                        <span className="font-medium text-stone-500">Tu</span>
                        <span className="font-medium text-stone-500">We</span>
                        <span className="font-medium text-stone-500">Th</span>
                        <span className="font-medium text-stone-500">Fr</span>
                        <span className="font-medium text-stone-500">Sa</span>
                      </motion.div>
                      <motion.div
                        variants={variants}
                        custom={direction}
                        className="mt-6 grid grid-cols-7 gap-y-6 px-8 text-sm"
                      >
                        {days.map((day) => (
                          <span
                            className={`${
                              isSameMonth(day, month) ? '' : 'text-stone-300'
                            } font-semibold`}
                            key={format(day, 'yyyy-MM-dd')}
                          >
                            {format(day, 'd')}
                          </span>
                        ))}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
