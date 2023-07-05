//React
import React, { useCallback, useEffect, useState } from "react";
import useCMDKAlbum from "../../hooks/useCMDKAlbum";
import useCMDKContext from "../../hooks/useCMDK";
import { AlbumData } from "@/lib/interfaces";
//NPM
import { animated, useSpring } from "@react-spring/web";
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

type PageName = "home" | "album" | "entry" | "form";
type Page = { name: string; album?: AlbumData; threadcrumbs?: string[] };

const PAGE_DIMENSIONS: Record<PageName, { width: number; height: number }> = {
  home: { width: 720, height: 480 },
  album: { width: 720, height: 788 }, // 808
  entry: { width: 560, height: 880 }, // 880
  form: { width: 960, height: 480 },
};

export function CMDK({ isVisible }: { isVisible: boolean }): JSX.Element {
  //Context stuff
  const { resetThreadcrumbs, setThreadcrumbs, threadcrumbs } = useThreadcrumb();
  const { pages, setPages, bounceScale, bounce, hideSearch, setHideSearch } =
    useCMDKContext();
  const { setSelectedAlbum } = useCMDKAlbum();

  //Element refs
  const ref = React.useRef<HTMLInputElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  //Page Tracker
  const activePage: Page = pages[pages.length - 1];
  const previousPage: Page = pages[pages.length - 2] || { name: "home" };

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

  useEffect(() => {
    setDimensionsSpring({
      to: async (next, cancel) => {
        await next({ width: 306, height: 306 }); // Loading dimension
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

  // Breadcrumb navigation
  const navigateBack = useCallback(
    (pageNumber: number = 1) => {
      setPages((prevPages) => {
        const newPages = [...prevPages];
        while (newPages.length > 1 && pageNumber-- > 0) {
          newPages.pop();
        }
        setThreadcrumbs(newPages[newPages.length - 1]?.threadcrumbs || []);
        return newPages;
      });
      bounce();
      resetThreadcrumbs();
    },
    [bounce, resetThreadcrumbs, setPages, setThreadcrumbs]
  );

  // Reset pages
  const resetPage = useCallback(() => {
    setPages([{ name: "home" }]);
    setInputValue("");
    resetThreadcrumbs();
  }, [resetThreadcrumbs, setInputValue, setPages]);

  // Album context
  useEffect(() => {
    if (activePage.name === "album" && activePage.album) {
      setSelectedAlbum(activePage.album);
    }
  }, [activePage, setSelectedAlbum]);

  // useEffect(() => {
  //   if (activePage.name === "entry") {
  //     activePage.threadcrumbs = threadcrumbs;
  //     console.log("backed up crumbs");
  //   }
  // }, [activePage, threadcrumbs]);

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
                isHome ? "shadow-defaultLowHover" : ""
              } scale-100 pointer-events-auto`
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
          className={`transition-opacity duration-300 w-full h-full ${
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
          <div
            className={`flex flex-col w-full transition-all duration-300 h-[94px] overflow-hidden ${
              !hideSearch ? `${isHome ? "!h-[30rem]" : "!h-[52rem]"}` : null
            }`}
          >
            {/* Search bar */}
            <div className="w-full items-center flex p-4 gap-4 border-b text-grey">
              <SearchIcon color={"#CCC"} />
              <Command.Input
                ref={inputRef}
                placeholder="soundsystem"
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
          {activePage.name === "home" && <Home />}
          {activePage.name === "album" && <Album />}
          {activePage.name === "entry" && <Entry />}
          {activePage.name === "form" && <Form />}
        </Command>
      </animated.div>
    </>
  );
}
