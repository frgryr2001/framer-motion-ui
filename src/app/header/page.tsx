'use client';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect } from 'react';

const HEIGHT = 80;

let clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function useBoundedScroll(bounds: number) {
  let { scrollY } = useScroll();
  let scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, bounds],
    [0, 1]
  );
  useMotionValueEvent(scrollY, 'change', (latest) => {
    let previous = scrollY.getPrevious() as number;
    const diff = latest - previous;
    let newScrollY = scrollYBounded.get() + diff;
    scrollYBounded.set(clamp(newScrollY, 0, bounds));
  });
  return { scrollYBounded, scrollYBoundedProgress };
}

export default function Header() {
  const { scrollYBoundedProgress } = useBoundedScroll(200);
  let scrollYBoundedProgressThrottled = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1]
  );
  return (
    <div className="mx-auto flex w-full  flex-1 overflow-hidden text-slate-600">
      <div className="z-0 flex-1 ">
        <motion.header
          style={{
            height: useTransform(
              scrollYBoundedProgressThrottled,
              [0, 1],
              [HEIGHT, 50]
            ),
            backgroundColor: useMotionTemplate`rgb(255 255 255 / ${useTransform(
              scrollYBoundedProgressThrottled,
              [0, 1],
              [1, 0.1]
            )})`,
          }}
          className="flex h-20 fixed  backdrop-blur-md inset-x-0 shadow"
        >
          <div className="mx-auto flex w-full  items-center justify-between px-8">
            <motion.p
              style={{
                scale: useTransform(
                  scrollYBoundedProgressThrottled,
                  [0, 1],
                  [1, 0.9]
                ),
              }}
              className="flex origin-left items-center text-xl font-semibold uppercase"
            >
              <span className="-ml-1.5 inline-block -rotate-90 text-[10px] leading-[0]">
                The
              </span>
              <span className="-ml-1 text-2xl tracking-[-.075em]">
                Daily Bugle
              </span>
            </motion.p>
            <motion.nav
              style={{
                opacity: useTransform(
                  scrollYBoundedProgressThrottled,
                  [0, 1],
                  [1, 0]
                ),
              }}
              className="flex space-x-4 text-xs font-medium text-slate-400"
            >
              <a href="#">News</a>
              <a href="#">Sports</a>
              <a href="#">Culture</a>
            </motion.nav>
          </div>
        </motion.header>

        <main className="px-8 pt-28">
          <h1 className="h-10 w-4/5 rounded bg-slate-200 text-2xl font-bold" />
          <div className="mt-8 space-y-6">
            {Array.from(Array(9)).map((i) => (
              <div key={i} className="space-y-2 text-sm">
                <p className="h-4 w-5/6 rounded bg-slate-200" />
                <p className="h-4 rounded bg-slate-200" />
                <p className="h-4 w-4/6 rounded bg-slate-200" />
              </div>
            ))}
            <div className="h-64 rounded bg-slate-200"></div>
            {Array.from(Array(90)).map((i) => (
              <div key={i} className="space-y-2 text-sm">
                <p className="h-4 w-5/6 rounded bg-slate-200" />
                <p className="h-4 rounded bg-slate-200" />
                <p className="h-4 w-4/6 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
