//React
import React, { useCallback, useEffect, useState } from "react";
import useCMDKAlbum from "../../hooks/useCMDKAlbum";
import useCMDKContext from "../../hooks/useCMDK";

//NPM
import { animated, useSpring } from "@react-spring/web";

//Components
import { Command } from "cmdk";
import { useThreadcrumb } from "../../context/Threadcrumbs";
import Album from "./pages/album/Album";
import Form from "./pages/form/Form";
import Search from "./pages/search/Search";
import Entry from "./pages/entry/Entry";
//Icons
import { ExitIcon, SearchIcon } from "../../components/icons";
import SearchAlbums from "./pages/search/subcomponents/SearchAlbums";

type PageName = "search" | "album" | "entry" | "form";

const PAGE_DIMENSIONS: Record<PageName, { width: number; height: number }> = {
  search: { width: 720, height: 480 },
  album: { width: 720, height: 720 }, // 808
  entry: { width: 560, height: 880 }, // 880
  form: { width: 960, height: 480 },
};

export function CMDK({ isVisible }: { isVisible: boolean }): JSX.Element {
  //Context stuff
  const { resetThreadcrumbs } = useThreadcrumb();
  const { pages, setPages, bounceScale, bounce } = useCMDKContext();
  const { shadowColor } = useCMDKAlbum();

  //Element refs
  const ref = React.useRef<HTMLInputElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  //Page Tracker
  const activePage: PageName = pages[pages.length - 1] as PageName;
  const previousPage: PageName = pages[pages.length - 2] as PageName;

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

  const boxShadow = shadowColor
    ? `-90px 73px 46px ${shadowColor},0.01),
     -51px 41px 39px ${shadowColor},0.05),
     -22px 18px 29px ${shadowColor},0.08),
     -6px 5px 16px ${shadowColor},0.1),
     0px 0px 0px ${shadowColor},0.1)`
    : undefined;

  return (
    // CMDK Outer
    <animated.div
      style={{
        ...dimensionsSpring,
        ...transformSpring,
        transition: "box-shadow 750ms, scale 300ms",
        boxShadow: boxShadow,
      }}
      className={`cmdk border border-silver ${
        isVisible
          ? "scale-100 pointer-events-auto"
          : "shadow-none scale-95 pointer-events-none"
      }`}
    >
      {/* CMDK Inner  */}
      <Command
        className={`transition-opacity duration-300 w-full h-full ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        ref={ref}
        shouldFilter={false}
        //CMDK Behavior depending on whether search input or not
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" && activePage === "search") {
            bounce();
          }
          if (e.key === "Backspace" && inputRef.current?.value === "") {
            e.preventDefault();
            popPage();
            return;
          }
          if (e.key === "Backspace" && activePage === "album") {
            popPage();
            e.preventDefault();
            return;
          }
        }}
      >
        {/* Search bar & results*/}
        {activePage === "search" && (
          <div className="w-full h-[612px]">
            <div className="w-full items-center flex p-4 gap-4">
              <SearchIcon color={"#CCC"} />
              <Command.Input
                ref={inputRef}
                placeholder="sound search"
                onValueChange={(value) => {
                  setInputValue(value);
                }}
              />
            </div>
            <Search
              searchData={data}
              isLoading={isLoading}
              isFetching={isFetching}
              error={error}
            />
          </div>
        )}

        {activePage === "album" && <Album />}
        {activePage === "entry" && <Entry />}
        {activePage === "form" && <Form />}

        {/* Back Button  */}
        {activePage !== "search" && (
          <div className="flex gap-2 items-center absolute -right-4 -top-6 ">
            <button className="text-xs text-grey" onClick={popPage}>
              <div>{pages.length > 1 ? pages[pages.length - 2] : null}</div>
            </button>
            <button onClick={resetPage}>
              <ExitIcon />
            </button>
          </div>
        )}
      </Command>
    </animated.div>
  );
}
