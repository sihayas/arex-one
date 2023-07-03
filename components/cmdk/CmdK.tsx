//React
import React, { useCallback, useEffect, useState } from "react";
import useCMDKAlbum from "../../hooks/useCMDKAlbum";
import useCMDKContext from "../../hooks/useCMDK";
//NPM
import { animated, useSpring, useTransition } from "@react-spring/web";
//Components
import { Command } from "cmdk";
import { useThreadcrumb } from "../../context/Threadcrumbs";
import Album from "./pages/album/Album";
import Form from "./pages/form/Form";
import Search from "./pages/search/Search";
import Entry from "./pages/entry/Entry";
import Home from "./pages/home/Home";
//Icons
import { ExitIcon, SearchIcon } from "../../components/icons";
import SearchAlbums from "./pages/search/subcomponents/SearchAlbums";

type PageName = "home" | "search" | "album" | "entry" | "form";

const PAGE_DIMENSIONS: Record<PageName, { width: number; height: number }> = {
  home: { width: 720, height: 480 },
  search: { width: 720, height: 480 },
  album: { width: 720, height: 788 }, // 808
  entry: { width: 560, height: 880 }, // 880
  form: { width: 960, height: 480 },
};

export function CMDK({ isVisible }: { isVisible: boolean }): JSX.Element {
  //Context stuff
  const { resetThreadcrumbs } = useThreadcrumb();
  const { pages, setPages, bounceScale, bounce, hideSearch, setHideSearch } =
    useCMDKContext();

  //Element refs
  const ref = React.useRef<HTMLInputElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  //Page Tracker
  const activePage: PageName = pages[pages.length - 1] as PageName;
  const previousPage: PageName = pages[pages.length - 2] as PageName;
  const isHome = activePage === "home";

  // Search albums
  const { data, isLoading, isFetching, error } = SearchAlbums(inputValue);

  // Page dimensions spring
  const [dimensionsSpring, setDimensionsSpring] = useSpring(() => ({
    width: PAGE_DIMENSIONS[previousPage]?.width || 1018,
    height: PAGE_DIMENSIONS[previousPage]?.height || 612,
    config: {
      tension: 400,
      friction: 40,
    },
  }));

  useEffect(() => {
    setDimensionsSpring({
      to: async (next, cancel) => {
        await next({ width: 306, height: 306 }); // Loading dimension
        await next({
          width: PAGE_DIMENSIONS[activePage]?.width || 1018,
          height: PAGE_DIMENSIONS[activePage]?.height || 612,
        });
      },
    });
  }, [activePage, previousPage, setDimensionsSpring]);

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

  const navigateBackToPage = useCallback(
    (page: string) => {
      setPages((prevPages) => {
        const index = prevPages.lastIndexOf(page);
        return prevPages.slice(0, index + 1);
      });
      bounce();
      resetThreadcrumbs();
    },
    [bounce, resetThreadcrumbs, setPages]
  );

  // Go back a page
  const popPage = useCallback(() => {
    setPages((pages) => {
      const newPages = [...pages];
      if (newPages.length > 1) {
        newPages.pop();
      }
      return newPages;
    });
    bounce();
    resetThreadcrumbs();
  }, [bounce, resetThreadcrumbs, setPages]);

  // Reset pages
  const resetPage = useCallback(() => {
    setPages(["search"]);
    setInputValue("");
    resetThreadcrumbs();
  }, [resetThreadcrumbs, setInputValue, setPages]);

  //Focus on input always
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    } //Autofocus on search input.
  }, [isVisible]);

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
            ? `${
                activePage === "home" ? "shadow-defaultLowHover" : ""
              } scale-100 pointer-events-auto`
            : "!shadow-none scale-95 pointer-events-none border border-silver"
        }`}
      >
        {/* Breadcrumbs  */}
        {activePage !== "home" && (
          <div className="flex flex-col gap-2 items-center absolute -left-8 top-1/2">
            <button onClick={resetPage}>
              <ExitIcon />
            </button>
            {pages.map((page, index) => (
              <button
                key={index}
                className="text-xs text-grey"
                onClick={() => navigateBackToPage(page)}
              >
                <div>{page}</div>
              </button>
            ))}
          </div>
        )}
        {/* CMDK Inner Content  */}
        <Command
          className={`transition-opacity duration-300 w-full h-full ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          ref={ref}
          shouldFilter={false}
          //CMDK Behavior depending on whether search input or not
          onKeyDown={(e: React.KeyboardEvent) => {
            console.log(`Keydown event: ${e.key}`);
            if (e.key === "Enter" && activePage === "search") {
              bounce();
            }
            if (e.key === "Backspace" && activePage !== "home" && !inputValue) {
              popPage();
              e.preventDefault();
              return;
            }
          }}
        >
          <div
            className={`flex flex-col w-full transition-all duration-300 h-[6.25rem] overflow-hidden ${
              !hideSearch ? `${isHome ? "!h-[30rem]" : "!h-[52rem]"}` : null
            }`}
          >
            {/* Search bar */}
            <div className="w-full items-center flex p-4 gap-4 border-b ">
              <SearchIcon color={"#CCC"} />
              <Command.Input
                ref={inputRef}
                placeholder="SOUNDSEARCH"
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
            <div
              className={`transition-opacity duration-300 h-fill overflow-scroll ${
                hideSearch ? "opacity-0" : "opacity-100"
              }`}
            >
              <Search
                searchData={data}
                isLoading={isLoading}
                isFetching={isFetching}
                error={error}
              />
            </div>
          </div>

          {/* Search bar & results*/}
          {activePage === "home" && <Home />}
          {activePage === "album" && <Album />}
          {activePage === "entry" && <Entry />}
          {activePage === "form" && <Form />}
        </Command>
      </animated.div>
    </>
  );
}
