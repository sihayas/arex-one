//React
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useCMDK } from "@/context/CMDKContext";
import { AlbumData } from "@/lib/interfaces";
//NPM
import { animated, useSpring } from "@react-spring/web";
//Components
import { Command } from "cmdk";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import Album from "./pages/album/Album";
import Form from "./pages/form/Form";
import Search from "./pages/search/Search";
import Entry from "./pages/entry/Entry";
import Home from "./pages/home/Home";
//Icons
import { ExitIcon, SearchIcon, HomeIcon } from "../../components/icons";
import SearchAlbums from "./pages/search/subcomponents/SearchAlbums";

type PageName = "home" | "album" | "entry" | "form";
type Page = { name: string; album?: AlbumData; threadcrumbs?: string[] };

const PAGE_DIMENSIONS: Record<PageName, { width: number; height: number }> = {
  home: { width: 720, height: 480 },
  album: { width: 800, height: 800 }, // 808
  entry: { width: 560, height: 880 }, // 880
  form: { width: 960, height: 480 },
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
    () => pages[pages.length - 2] || { name: "home" },
    [pages]
  );

  const isHome = activePage.name === "home";

  // Search albums
  const { data, isLoading, isFetching, error } = SearchAlbums(inputValue);

  // Page dimensions spring
  const [dimensionsSpring, setDimensionsSpring] = useSpring(() => ({
    width: PAGE_DIMENSIONS[previousPage.name as PageName]?.width || 1018,
    height: PAGE_DIMENSIONS[previousPage.name as PageName]?.height || 612,
    config: {
      tension: 400,
      friction: 40,
    },
  }));

  // Page dimensions spring
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

  // Transform spring
  const transformSpring = useSpring({
    transform: isVisible
      ? `translate(-50%, -50%) scale(${bounceScale})`
      : `translate(-50%, -50%) scale(0.95)`,
    config: {
      tension: 400,
      friction: 30,
    },
  });

  // Search Height Spring
  const searchStyles = useSpring({
    height: hideSearch ? "0px" : "480px",
    opacity: hideSearch ? 0 : 1,
    config: { tension: 600, friction: 60 },
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
    setPages([{ name: "home" }]);
    setInputValue("");
    resetThreadcrumbs();
  }, [resetThreadcrumbs, setInputValue, setPages]);

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
  useEffect(() => {
    if (isVisible && inputRef.current && isHome) {
      inputRef.current.focus();
    } //Autofocus on search input.
  }, [isVisible, isHome]);

  // Handle page render
  let ActiveComponent;
  switch (activePage.name) {
    case "home":
      ActiveComponent = Home;
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
    default:
      ActiveComponent = Home;
  }

  return (
    <>
      <animated.div
        style={{
          ...dimensionsSpring,
          ...transformSpring,
          transition: "box-shadow 750ms, scale 300ms",
        }}
        className={`cmdk ${
          isVisible
            ? `scale-100 pointer-events-auto ${
                isHome ? "shadow-defaultLowHover" : ``
              } `
            : "!shadow-none scale-95 pointer-events-none border border-silver"
        }`}
      >
        {/* Breadcrumbs  */}
        {!isHome && (
          <div className="flex flex-col gap-2 items-center absolute -left-8 top-1/2">
            <button onClick={resetPage}>
              <ExitIcon />
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
        {/* CMDK Inner Content  */}
        <Command
          className={`transition-opacity duration-300 w-full h-full relative z-0 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          ref={ref}
          shouldFilter={false}
          //CMDK Behavior depending on whether search input or not
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
          <div className={`flex flex-col w-full`}>
            {/* Search bar */}
            <div
              className={`w-full absolute items-center flex p-4 gap-4 text-grey transition-transform duration-500 ${
                hideSearch ? "-z-10 -translate-y-8" : "z-20"
              }`}
            >
              <div className="absolute left-6">
                <HomeIcon width={24} height={24} color={"#999)"} />
              </div>
              <Command.Input
                className={`border ${
                  hideSearch ? "shadow-defaultLow" : "shadow-album"
                }`}
                ref={inputRef}
                placeholder="Rx*"
                style={{ paddingLeft: "2.5rem" }} // adjust as per your requirement
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
              className={`w-full overflow-scroll rounded-[32px] absolute bg-white p-4 pt-16 z-10 ${
                hideSearch
                  ? "pointer-events-none"
                  : "pointer-events-auto shadow-defaultLow"
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
          <ActiveComponent />
        </Command>
      </animated.div>
    </>
  );
}
