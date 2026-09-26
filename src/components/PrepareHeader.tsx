import React from "react";
import { useWeather } from "../context/WeatherContext";

export default function PrepareHeader() {
  const ctx = useWeather();

  return (
    <header className="w-full max-w-[1234px] mx-auto h-[69px] flex items-center justify-between px-2 lg:px-6 py-[9px] z-20">
      {/* Brand Monogram "P" (Figma: prepare-mark 1) */}
      <div className="flex items-center pl-1 sm:pl-0">
        <a
          href="/"
          className="flex items-center justify-center transition-transform hover:scale-105"
          aria-label="Prepare Home"
        >
          <img src="/logo.png" alt="Prepare Logo" className="h-9 w-9 object-contain" />
        </a>
      </div>

      {/* Right Actions: Desktop Auth vs Mobile Profile & Message (Figma: 318:2656) */}
      <div className="flex items-center pr-1 sm:pr-0">
        {/* Desktop Buttons (Figma node 416:10078 / Frame 149 - 200px x 35px, gap 8px) */}
        <div data-name="Frame 149" className="hidden lg:flex items-center gap-2">
          {/* Sign Up Button (Unavailable State) */}
          <button
            type="button"
            disabled
            data-name="Buttons"
            className="w-[96px] h-[35px] rounded-[8px] bg-[#F0ECE4] text-[#D5CFC4] font-btn flex items-center justify-center cursor-not-allowed select-none transition-colors border-none"
            style={{
              fontFamily: '"Fira Sans", sans-serif',
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "120%",
              letterSpacing: "-0.03em",
              backgroundColor: "#F0ECE4",
              color: "#D5CFC4",
            }}
            title="Sign Up (Currently unavailable)"
          >
            Sign Up
          </button>

          {/* Log In Button (Unavailable State) */}
          <button
            type="button"
            disabled
            data-name="Buttons"
            className="w-[96px] h-[35px] rounded-[8px] bg-[#F0ECE4] text-[#D5CFC4] font-btn flex items-center justify-center cursor-not-allowed select-none transition-colors border-none"
            style={{
              fontFamily: '"Fira Sans", sans-serif',
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "120%",
              letterSpacing: "-0.03em",
              backgroundColor: "#F0ECE4",
              color: "#D5CFC4",
            }}
            title="Log In (Currently unavailable)"
          >
            Log In
          </button>
        </div>

        {/* Mobile Circle Action Buttons (Figma node 318:2656 / Frame 152 - Account & Message Buttons) */}
        <div data-name="Frame 152" className="flex lg:hidden items-center gap-2">
          {/* Account Button (318:2644) */}
          <button
            type="button"
            aria-label="Account"
            data-name="Account Button"
            className="w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" rx="15" fill="#4A69A9"/>
              <circle cx="15" cy="11" r="4" fill="#EEF1F8"/>
              <path d="M8.33788 20.3206C8.99897 17.5269 11.7717 16 14.6426 16H15.3574C18.2283 16 21.001 17.5269 21.6621 20.3206C21.79 20.8611 21.8917 21.4268 21.9489 22.0016C22.0036 22.5512 21.5523 23 21 23H9C8.44772 23 7.99642 22.5512 8.0511 22.0016C8.1083 21.4268 8.20997 20.8611 8.33788 20.3206Z" fill="#EEF1F8"/>
            </svg>
          </button>

          {/* Message Button (318:2645) */}
          <button
            type="button"
            aria-label="Message"
            data-name="Message Button"
            onClick={() => ctx?.openChat()}
            className="w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Open Chat"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" rx="15" fill="#4A69A9"/>
              <path d="M15 7.125C17.4459 7.125 18.669 7.12492 19.6338 7.52441C20.9202 8.05726 21.9427 9.07981 22.4756 10.3662C22.8751 11.331 22.875 12.5541 22.875 15C22.875 17.4459 22.8751 18.669 22.4756 19.6338C21.9427 20.9202 20.9202 21.9427 19.6338 22.4756C18.669 22.8751 17.4459 22.875 15 22.875H12.375C9.90013 22.875 8.6624 22.8753 7.89355 22.1064C7.12471 21.3376 7.125 20.0999 7.125 17.625V15C7.125 12.5541 7.12492 11.331 7.52441 10.3662C8.05726 9.07981 9.07981 8.05726 10.3662 7.52441C11.331 7.12492 12.5541 7.125 15 7.125ZM12.375 15.75C11.8227 15.75 11.375 16.1977 11.375 16.75C11.3752 17.3021 11.8228 17.75 12.375 17.75H15C15.5522 17.75 15.9998 17.3021 16 16.75C16 16.1977 15.5523 15.75 15 15.75H12.375ZM12.375 12.25C11.8227 12.25 11.375 12.6977 11.375 13.25C11.3752 13.8021 11.8228 14.25 12.375 14.25H17.625C18.1772 14.25 18.6248 13.8021 18.625 13.25C18.625 12.6977 18.1773 12.25 17.625 12.25H12.375Z" fill="#EEF1F8"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
