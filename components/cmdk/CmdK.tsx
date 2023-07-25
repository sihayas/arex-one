//React
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useCMDK } from "@/context/CMDKContext";
//NPM
import { animated, useSpring } from "@react-spring/web";
//Components
import { Command } from "cmdk";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useDragLogic } from "@/hooks/useDragLogic";
import Album from "./pages/album/Album";
import Form from "./pages/form/Form";
import Search from "./pages/search/Search";
import Entry from "./pages/entry/Entry";
import Index from "./pages/index/Index";
import User from "./pages/user/User";
import { Page } from "@/context/CMDKContext";
//Icons
import { HomeIcon } from "../../components/icons";
import SearchAlbums from "./pages/search/subcomponents/SearchAlbums";

type PageName = "index" | "album" | "entry" | "form" | "user";

const PAGE_DIMENSIONS: Record<PageName, { width: number; height: number }> = {
  index: { width: 884, height: 576 },
  album: { width: 864, height: 864 },
  entry: { width: 800, height: 800 },
  form: { width: 960, height: 480 },
  user: { width: 768, height: 768 },
};

export function CMDK({ isVisible }: { isVisible: boolean }): JSX.Element {
  //Context stuff
  const { resetThreadcrumbs, setThreadcrumbs } = useThreadcrumb();
  const { pages, setPages, bounceScale, bounce, hideSearch, setHideSearch } =
    useCMDK();
  const { setSelectedAlbum } = useCMDKAlbum();

  //Element refs
  const ref = React.useRef<HTMLInputElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  //Page Tracker
  const activePage: Page = useMemo(() => pages[pages.length - 1], [pages]);
  const previousPage: Page = useMemo(
    () => pages[pages.length - 2] || { name: "index" },
    [pages]
  );
  const isHome = activePage.name === "index";

  // Search albums
  const { data, isLoading, isFetching, error } = SearchAlbums(inputValue);

  // Use gesture

  // Spring dimensions
  const [dimensionsSpring, setDimensionsSpring] = useSpring(() => ({
    width: PAGE_DIMENSIONS[previousPage.name as PageName]?.width || 1018,
    height: PAGE_DIMENSIONS[previousPage.name as PageName]?.height || 612,
    config: {
      tension: 600,
      friction: 40,
    },
  }));

  // Spring dimensions
  useEffect(() => {
    setDimensionsSpring({
      to: async (next, cancel) => {
        // await next({ width: 306, height: 306 }); // Loading dimension
        await next({
          width: PAGE_DIMENSIONS[activePage.name as PageName]?.width || 1018,
          height: PAGE_DIMENSIONS[activePage.name as PageName]?.height || 612,
        });
      },
    });
  }, [activePage.name, setDimensionsSpring]);

  // Spring transform
  const transformSpring = useSpring({
    transform: isVisible
      ? `translate(-50%, -50%) scale(${bounceScale})`
      : `translate(-50%, -50%) scale(0.95)`,
    config: {
      tension: 400,
      friction: 30,
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

  // Breadcrumb navigation
  const navigateBack = useCallback(
    (pageNumber: number = 1) => {
      setPages((prevPages) => {
        const newPages = prevPages.slice(0, prevPages.length - pageNumber);
        setThreadcrumbs(newPages[newPages.length - 1]?.threadcrumbs || []);
        return newPages;
      });
      bounce();
    },
    [bounce, setPages, setThreadcrumbs]
  );

  // Reset pages
  const resetPage = useCallback(() => {
    setPages([{ name: "index" }]);
    setInputValue("");
    resetThreadcrumbs();
  }, [resetThreadcrumbs, setInputValue, setPages]);

  // Drag logic
  const { bind, x, y, scale } = useDragLogic({
    navigateBack,
    resetPage,
    inputRef,
  });

  // Adjust album context when navigating to an album page
  useEffect(() => {
    if (activePage.name === "album" && activePage.album) {
      setSelectedAlbum(activePage.album);
    }
  }, [activePage, setSelectedAlbum, pages]);

  // useEffect(() => {
  //   if (activePage.name === "entry") {
  //     activePage.threadcrumbs = threadcrumbs;
  //     console.log("backed up crumbs");
  //   }
  // }, [activePage, threadcrumbs]);

  //Focus on input always
  // useEffect(() => {
  //   if (inputRef.current) {
  //     if (isVisible && activePage.name === "index") {
  //       inputRef.current.focus();
  //     } else {
  //       inputRef.current.blur();
  //     }
  //   }
  // }, [isVisible, activePage.name]);

  // Handle page render
  let ActiveComponent;
  switch (activePage.name) {
    case "index":
      ActiveComponent = Index;
      break;
    case "album":
      ActiveComponent = Album;
      break;
    case "entry":
      ActiveComponent = Entry;
      break;
    case "form":
      ActiveComponent = Form;
      break;
    case "user":
      ActiveComponent = User;
      break;
    default:
      ActiveComponent = Index;
  }

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
          ...dimensionsSpring, // To shapeshift
          ...transformSpring, // To appear
          transition: "box-shadow 750ms",
        }}
        className={`cmdk ${
          isVisible
            ? " pointer-events-auto"
            : "!shadow-none pointer-events-none border border-silver"
        }`}
      >
        {/* CMDK Inner Content  */}
        <Command
          className={`transition-opacity duration-300 w-full h-full relative ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          ref={ref}
          shouldFilter={false}
          onKeyDown={(e: React.KeyboardEvent) => {
            // console.log(`Keydown event: ${e.key}`);
            if (e.key === "Enter" && activePage.name === "search") {
              bounce();
            }
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
              className={`w-[96%] absolute items-center flex p-4 gap-4 text-black transition-transform duration-300 scale-100 ${
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
                onValueChange={(value) => {
                  if (hideSearch) {
                    setHideSearch(false);
                  }
                  setInputValue(value);
                }}
                onFocus={() => {
                  setHideSearch(false);
                }}
                onBlur={() => {
                  setHideSearch(true);
                }}
              />
            </div>
            {/* Search Results  */}
            <animated.div
              style={{ ...searchStyles }}
              className={`w-[96%] mt-4 overflow-scroll rounded-[32px] absolute bg-white z-10 border border-silver scrollbar-none ${
                hideSearch
                  ? "pointer-events-none"
                  : "!pt-[4rem] pointer-events-auto shadow-search"
              }`}
            >
              <Search
                searchData={data}
                isLoading={isLoading}
                isFetching={isFetching}
                error={error}
              />
            </animated.div>
          </div>
          {/* Active Page / Use Gesture */}
          <animated.div
            {...bind()}
            style={{
              x,
              y,
              scale,
            }}
            className={`flex w-full h-full rounded-[32px] cursor-grab z-0 ${
              isVisible
                ? `shadow-cmdkScaled ${
                    activePage.name === "user" ? "!rounded-full" : ""
                  }`
                : ""
            } `}
          >
            <ActiveComponent />
          </animated.div>
        </Command>
      </animated.div>
    </>
  );
}
