"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Some mobile browsers defer declarative autoplay until the media has
    // loaded. Calling play after canplay keeps the poster from becoming a
    // permanent mobile fallback while remaining muted and inline.
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const playVideo = () => {
      void video.play().catch(() => {
        // Autoplay can still be blocked by a browser policy; the poster is
        // intentionally retained as an accessible visual fallback.
      });
    };

    video.addEventListener("canplay", playVideo);
    video.addEventListener("loadeddata", playVideo);
    playVideo();

    return () => {
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("loadeddata", playVideo);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-end text-white bg-black h-full min-h-screen overflow-hidden"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        loop
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/nftbg-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/nftbg.mp4" type="video/mp4; codecs=avc1.42E01E, mp4a.40.2" />
      </video>

      {/* Dark overlay to improve text readability and visual contrast,
          weighted toward the bottom where the content sits. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25"
      ></div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 xl:px-16">
        <div className="flex flex-col gap-4 sm:gap-6 py-10 sm:py-16">
          <div className="flex items-start gap-2.5 md:gap-4">
            <div aria-hidden="true" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0">
              <motion.img
                src={"/tessera-mark.svg"}
                alt=""
                width={44}
                height={44}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <p className="sm:text-base text-sm sm:leading-6 leading-5 font-normal text-white sm:max-w-sm">
              Proof you were there, stored{" "}
              <span className="text-teal-400">entirely onchain</span>. Create a
              POAP, hand it out at your event, keep it forever.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
            className="flex sm:flex-row flex-col items-start lg:items-baseline gap-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-10 lg:leading-32 font-bold">
              TESSERA®POAP
            </h1>
            <div>
              <div className="bg-teal-400 rounded-full p-1 pl-8">
                <div className="lg:p-3 p-2 bg-white text-black rounded-full">
                  <ArrowUpRight size={24} aria-hidden="true" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
