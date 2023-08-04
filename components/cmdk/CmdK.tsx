//React
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useCMDK } from "@/context/CMDKContext";
//NPM
import { animated, useSpring, useTransition } from "@react-spring/web";
import { useScroll, useWheel } from "@use-gesture/react";
//Components
import { Command } from "cmdk";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import Album from "./pages/album/Album";
import Form from "./pages/form/Form";
import Search from "./pages/search/Search";
import Entry from "./pages/entry/Entry";
import Index from "./pages/index/Index";
import User from "./pages/user/User";
const Lethargy = require("lethargy").Lethargy;

//Icons
import { HomeIcon } from "../../components/icons";
import SearchAlbums from "@/lib/api/searchAPI";
import { useScrollContext } from "@/context/ScrollContext";
import { debounce } from "lodash";

type PageName = "index" | "album" | "entry" | "form" | "user";

const PAGE_DIMENSIONS: Record<PageName, { width: number; height: number }> = {
  index: { width: 900, height: 680 }, //1022
  album: { width: 722, height: 722 },
  entry: { width: 800, height: 800 },
  form: { width: 960, height: 480 },
  user: { width: 768, height: 768 },
};

const MemoizedSearch = React.memo(Search);

const componentMap: Record<string, React.ComponentType<any>> = {
  index: Index,
  album: Album,
  entry: Entry,
  form: Form,
  user: User,
};

let lastScrollTime = Date.now();

export function CMDK({ isVisible }: { isVisible: boolean }): JSX.Element {
  //Context stuff
  const {
    pages,
    hideSearch,
    setHideSearch,
    activePage,
    navigateBack,
    inputRef,
    previousPage,
    resetPage,
    setPages,
  } = useCMDK();
  const { setSelectedAlbum } = useCMDKAlbum();
  const { cursorOnRight } = useScrollContext();

  //Element refs
  const ref = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  //Page Tracker
  const isHome = activePage.name === "index";

  const ActiveComponent = componentMap[activePage.name] || Index;

  // Search albums
  const { data, isLoading, isFetching, error } = SearchAlbums(inputValue);

  // Shapeshift dimensionss
  const [dimensionsSpring, setDimensionsSpring] = useSpring(() => ({
    width: PAGE_DIMENSIONS[previousPage!.name as PageName]?.width,
    height: PAGE_DIMENSIONS[previousPage!.name as PageName]?.height,
    config: {
      tension: 400,
      friction: 77,
    },
  }));
  useEffect(() => {
    setDimensionsSpring({
      to: async (next, cancel) => {
        // If the page has custom dimensions, use them
        const targetPageDimensions = activePage.dimensions;
        await next({
          width: targetPageDimensions?.width,
          height: targetPageDimensions?.height,
        });
      },
    });
    set({ width: activePage.dimensions.width || 0 });
  }, [activePage.name, setDimensionsSpring]);

  const setDebounced = useMemo(
    () =>
      debounce(({ newWidth }) => {
        setPages((prevPages) => {
          const updatedPages = [...prevPages];
          const activePageIndex = updatedPages.length - 1;
          updatedPages[activePageIndex] = {
            ...updatedPages[activePageIndex],
            dimensions: {
              width: newWidth,
              height: 722,
            },
          };
          return updatedPages;
        });
      }, 150),
    [setPages]
  );

  // Inertia tracking with lethargy to trigger shapeshift
  const lethargy = new Lethargy(2, 200, 0.4);
  const [{ width, scale }, set] = useSpring(() => ({
    scale: 1,
    width: activePage.dimensions.width,
  }));
  const wheelBind = useWheel(({ event, last, delta, velocity }) => {
    const [, y] = delta;

    let isUserScroll = true;

    // Last is necessary cause React does not register the last event
    if (!last && event) {
      isUserScroll = lethargy.check(event);
    }
    if (
      isUserScroll &&
      cursorOnRight &&
      previousPage &&
      previousPage.dimensions
    ) {
      const now = Date.now();
      const elapsedTime = now - lastScrollTime;
      const scrollSpeed = Math.abs(y) / elapsedTime;
      const magnitudeVelocity = Math.sqrt(
        velocity[0] * velocity[0] + velocity[1] * velocity[1]
      );

      // Log scroll speed and velocity here for debugging

      if (scrollSpeed > 1 && magnitudeVelocity > 2.41) {
        let newWidth;
        if (previousPage.dimensions.width > activePage.dimensions.width) {
          // If previous page is wider, increase the width
          newWidth = width.get() + -y * 3;
          if (newWidth === previousPage.dimensions.width) {
            newWidth = previousPage.dimensions.width;
            navigateBack();
          }
          if (newWidth < activePage.dimensions.width) {
            newWidth = activePage.dimensions.width;
          }
        } else {
          // If previous page is narrower, decrease the width
          newWidth = width.get() - -y * 3;
          if (newWidth < previousPage.dimensions.width) {
            newWidth = previousPage.dimensions.width;
            navigateBack();
          }
          if (newWidth > activePage.dimensions.width) {
            newWidth = activePage.dimensions.width;
          }
        }

        // Apply the new width immediately to the spring animation
        set({ width: newWidth });
        console.log("newWidth", newWidth);
        // Defer updating the page dimensions
        setDebounced({ newWidth });
      }

      lastScrollTime = now;
    }
  });

  // Album page ScrollBind, make wider on scroll down, and scale down Artwork
  const scrollBind = useScroll(({ xy: [, y] }) => {
    if (!cursorOnRight && activePage.name === "album") {
      // only proceed when cursorOnRight is false
      let newScale = 1 - y / 1000;
      if (newScale > 1) newScale = 1;
      if (newScale < 0.5) newScale = 0.5;

      let newWidth = 722 + (y / 300) * (1066 - 722);
      if (newWidth < 722) newWidth = 722;
      if (newWidth > 1066) newWidth = 1066;

      // Apply the new scale and width immediately to the spring animation
      set({ scale: newScale, width: newWidth });

      // Defer updating the page dimensions
      setDebounced({ newWidth });
    }
  });

  // Spring CMDK visibility
  const visibilitySpring = useSpring({
    transform: isVisible
      ? `translate(-50%, -50%) scale(1)`
      : `translate(-50%, -50%) scale(0.95)`,
    config: {
      tension: 400,
      friction: 70,
    },
  });

  // Spring search
  const searchStyles = useSpring({
    height: hideSearch ? "0px" : "448px",
    opacity: hideSearch ? 0 : 1,
    paddingTop: hideSearch ? "0px" : "32px",
    padding: hideSearch ? "0px" : "16px",
    config: { tension: 700, friction: 60 },
  });

  // Adjust album context when navigating to an album page
  useEffect(() => {
    if (activePage.name === "album" && activePage.album) {
      setSelectedAlbum(activePage.album);
    }
  }, [activePage, setSelectedAlbum, pages]);

  // Handle input changes
  const onValueChange = useCallback(
    (value: string) => {
      if (hideSearch) {
        setHideSearch(false);
      }
      setInputValue(value);
    },
    [hideSearch, setInputValue, setHideSearch]
  );
  const onFocus = useCallback(() => {
    setHideSearch(false);
  }, [setHideSearch]);
  const onBlur = useCallback(() => {
    setHideSearch(true);
  }, [setHideSearch]);

  const transitions = useTransition(ActiveComponent, {
    from: { scale: 0.95, opacity: 0 },
    enter: { scale: 1, opacity: 1, delay: 500 },
    leave: { scale: 0.95, opacity: 0 },
    config: {
      duration: 0,
    },
  });

  // Unmount cleanup
  useEffect(() => {
    return () => {
      setDebounced.cancel();
    };
  }, [setDebounced]);

  return (
    <>
      {/* Breadcrumbs  */}
      {!isHome && (
        <div className="flex flex-col gap-2 items-center absolute top-1/2">
          <button className="text-xs text-grey" onClick={resetPage}>
            reset
          </button>
          {pages.map((page, index) => (
            <button
              key={index}
              className="text-xs text-grey"
              onClick={() => navigateBack(pages.length - index - 1)}
            >
              <div>{page.name}</div>
            </button>
          ))}
        </div>
      )}

      <animated.div
        style={{
          ...visibilitySpring, // To appear
        }}
        className={`cmdk ${
          isVisible ? "pointer-events-auto" : "!shadow-none pointer-events-none"
        }`}
      >
        {/* CMDK Inner Content  */}
        <Command
          className={`transition-opacity duration-150 w-full h-full relative ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          ref={ref}
          shouldFilter={false}
          onKeyDown={(e: React.KeyboardEvent) => {
            // console.log(`Keydown event: ${e.key}`);
            if (e.key === "Backspace" && !isHome && !inputValue) {
              navigateBack();
              e.preventDefault();
              return;
            }
          }}
        >
          {/* Search / Search Results*/}
          <div className={`flex flex-col w-[96%]`}>
            {/* Search bar */}
            <div
              className={`w-[96%] absolute items-center flex p-4 gap-4 text-black transition-transform duration-300 scale-100 hoverable-small ${
                hideSearch
                  ? `-translate-y-8 scale-95 hover:scale-[97%] z-0`
                  : "translate-y-4 z-20"
              }`}
            >
              <HomeIcon width={24} height={24} color={"#333"} />
              <Command.Input
                className={`bg-blurWhite backdrop-blur-sm border border-silver`}
                ref={inputRef}
                placeholder="Dive"
                style={{ paddingLeft: "2.5rem" }}
                onValueChange={onValueChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            {/* Search Results  */}
            <animated.div
              style={{ ...searchStyles }}
              className={`w-[96%] mt-4 overflow-scroll rounded-[32px] absolute bg-blurWhite backdrop-blur-lg z-20 border border-silver scrollbar-none transform-gpu ${
                hideSearch
                  ? "pointer-events-none"
                  : "!pt-[4rem] pointer-events-auto shadow-search"
              }`}
            >
              <MemoizedSearch
                searchData={data}
                isLoading={isLoading}
                isFetching={isFetching}
                error={error}
              />
            </animated.div>
          </div>
          {/* Container / Shapeshifter */}
          <animated.div
            {...wheelBind()} // Shapeshifter scrolling
            {...scrollBind()} // Custom page scrolling
            style={{
              ...dimensionsSpring, // Shapeshifter
              width: width.to((w) => `${w}px`),
            }}
            className={`flex justify-center bg-white rounded-[24px] z-0 hoverable-large relative overflow-scroll scrollbar-none ${
              isVisible ? `drop-shadow-2xl` : ""
            } `}
          >
            {/* Apply transition */}
            {transitions((style, Component) => (
              <animated.div
                className={"w-full"}
                style={{ ...style, position: "absolute" }}
              >
                {Component === Album ? (
                  <Component scale={scale} />
                ) : (
                  <Component />
                )}
              </animated.div>
            ))}
          </animated.div>
        </Command>
      </animated.div>
    </>
  );
}

// useEffect(() => {
//   if (activePage.name === "entry") {
//     activePage.threadcrumbs = threadcrumbs;
//     console.log("backed up crumbs");
//   }
// }, [activePage, threadcrumbs]);
