import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { useMemo } from "react";
import { GetStaticProps } from "next";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
};

// Adjust the function signature to accept props
const PostsList = ({ posts }: { posts: BlogPost[] }) => {
  const postsByYearMonth = useMemo(() => {
    const groups: Record<string, Record<string, BlogPost[]>> = {};
    const baseYear = 2024;

    posts.forEach((post) => {
      const year = parseInt(post.date.slice(0, 4));
      const month = post.date.slice(5, 7);
      let yearText = year.toString();

      if (year >= baseYear) {
        const yearDiff = year - baseYear + 1;
        yearText = `Year ${yearDiff}`;
      }

      if (!groups[yearText]) {
        groups[yearText] = {};
      }
      if (!groups[yearText][month]) {
        groups[yearText][month] = [];
      }
      groups[yearText][month].push(post);
    });
    return groups;
  }, [posts]);

  return (
    <div className={`p-4`}>
      {Object.entries(postsByYearMonth)
        .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
        .map(([year, months]) => (
          <div className={`pt-8 text-base`} key={year}>
            <h2>{year}</h2>
            {Object.entries(months)
              .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
              .map(([month, posts]) => (
                <div className={`pt-4`} key={month}>
                  <h3 className={`text-gray2`}>
                    {new Date(
                      `${
                        year === "Year 1" ? "2024" : year
                      }-${month}-01T00:00:00Z`,
                    ).toLocaleString("default", {
                      month: "long",
                      timeZone: "UTC",
                    })}
                  </h3>
                  <ul>
                    {posts.map((post) => {
                      const day = new Date(
                        `${post.date}T00:00:00Z`,
                      ).getUTCDate();
                      return (
                        <li key={post.slug}>
                          <Link href={`/diary/${post.slug}`}>
                            <p>{`${day} · ${post.title}`}</p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default PostsList;

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    props: {
      posts,
    },
  };
};
