//React
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useCMDK } from "@/context/CMDKContext";
//NPM
import { animated, useSpring, useTransition } from "@react-spring/web";
//Components
import { Command } from "cmdk";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import Album from "./pages/album/Album";
import Form from "./pages/form/Form";
import Search from "./pages/search/Search";
import Entry from "./pages/entry/Entry";
import Index from "./pages/index/Index";
import User from "./pages/user/User";
import { Page } from "@/context/CMDKContext";
//Icons
import { HomeIcon } from "../../components/icons";
import SearchAlbums from "@/lib/api/searchAPI";

type PageName = "index" | "album" | "entry" | "form" | "user";

const PAGE_DIMENSIONS: Record<PageName, { minWidth: number; height: number }> =
  {
    index: { minWidth: 500, height: 680 }, //1022
    album: { minWidth: 722, height: 722 },
    entry: { minWidth: 800, height: 800 },
    form: { minWidth: 960, height: 480 },
    user: { minWidth: 768, height: 768 },
  };

const MemoizedSearch = React.memo(Search);

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
  } = useCMDK();
  const { setSelectedAlbum } = useCMDKAlbum();

  //Element refs
  const ref = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  //Page Tracker
  const isHome = activePage.name === "index";
  const componentMap: Record<string, React.ComponentType> = {
    index: Index,
    album: Album,
    entry: Entry,
    form: Form,
    user: User,
  };
  const ActiveComponent = componentMap[activePage.name] || Index;

  // Search albums
  const { data, isLoading, isFetching, error } = SearchAlbums(inputValue);

  // Shapeshift dimensions
  const [dimensionsSpring, setDimensionsSpring] = useSpring(() => ({
    minWidth: PAGE_DIMENSIONS[previousPage!.name as PageName]?.minWidth,
    height: PAGE_DIMENSIONS[previousPage!.name as PageName]?.height,
    config: {
      tension: 400,
      friction: 77,
    },
  }));

  // Shapeshift dimensions useEffect trigger
  useEffect(() => {
    setDimensionsSpring({
      to: async (next, cancel) => {
        // If the page has custom dimensions, use them
        const targetPageDimensions = activePage.dimensions;
        await next({
          minWidth: targetPageDimensions?.minWidth,
          height: targetPageDimensions?.height,
        });
      },
    });
  }, [activePage.name, setDimensionsSpring]);

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

  // Spring dynamic search
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

  return (
    <>
      {/* Breadcrumbs  */}
      {/* {!isHome && (
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
      )} */}

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
              <HomeIcon minWidth={24} height={24} color={"#333"} />
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
            style={{
              ...dimensionsSpring, // To shape-shift or parent dimensions
            }}
            className={`flex justify-center bg-white rounded-[24px] z-0 hoverable-large relative ${
              isVisible ? `drop-shadow-2xl` : ""
            } `}
          >
            {/* Apply transition */}
            {transitions((style, Component) => (
              <animated.div
                className={"flex min-w-fit h-full bg-white rounded-[24px]"}
                style={{ ...style, position: "absolute" }}
              >
                <Component />
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
