'use client'

import { Keyboard, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ActivityOverview from "./slides/ActivityOverview";
import { ExtractedData } from "@/utils/types";
import EngagementRecieved from "./slides/EngagementRecieved";
import MostLovedPost from "./slides/MostLovedPost";
import PeakActivityMonth from "./slides/PeakActivityMonth";
import PeakEngagementMonth from "./slides/PeakEngagementMonth";
import WordsUsed from "./slides/WordsUsed";
import HashTagsUsed from "./slides/HashTagsUsed";
import AccountInteractions from "./slides/AccountInteractions";
import BlueskyPersonality from "./slides/BlueskyPersonality";
import ThankYou from "./slides/ThankYou";

export interface WrappedStoriesProps {
  closeStories: () => void;
  extractedData: ExtractedData
}

export default function WrappedStories({ closeStories, extractedData }: WrappedStoriesProps) {

  const slideComponents = [
    ActivityOverview,
    EngagementRecieved,
    MostLovedPost,
    PeakActivityMonth,
    PeakEngagementMonth,
    WordsUsed,
    HashTagsUsed,
    AccountInteractions,
    BlueskyPersonality,
    ThankYou,

  ]

  return (
    <div className="fixed inset-0 z-50 checkered-bg ">
      <button
        type="button"
        onClick={() => closeStories()}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <Swiper
        modules={[Navigation, Pagination, Keyboard]}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        pagination={{
          type: 'progressbar',
          clickable: true,
          dynamicBullets: true,
        }}
        keyboard={{
          enabled: true,
        }}
        className="w-full h-full"
        spaceBetween={0}
        slidesPerView={1}
      >

        {
          slideComponents.map((SlideComponent, index) => (
            <SwiperSlide className="overflow-y-auto" key={index}>
              {
                ({ isActive }) => (
                  <div className="min-h-full">
                    <SlideComponent
                      data={extractedData}
                      isActive={isActive}
                    />
                  </div>
                )
              }
            </SwiperSlide>
          ))
        }

      </Swiper>

      <button
        className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Previous"
        type="button"
      >
        <ChevronLeft className="w-4 h-4 md:w-8 md:h-8 text-base-content" />
      </button>
      <button
        className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Next"
        type="button"
      >
        <ChevronRight className="w-4 h-4 md:w-8 md:h-8 text-base-content" />
      </button>

      {/* Click Zones for Desktop (Left/Right halves) 
          <div className="hidden md:block absolute inset-0 pointer-events-none z-30">
            <div
              className="absolute left-0 top-0 w-1/2 h-full pointer-events-auto cursor-w-resize swiper-button-prev-custom"
              aria-label="Previous slide zone"
            />
            <div
              className="absolute right-0 top-0 w-1/2 h-full pointer-events-auto cursor-e-resize swiper-button-next-custom"
              aria-label="Next slide zone"
            />
          </div>
      */}
    </div>
  )
}