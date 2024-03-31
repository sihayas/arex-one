import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticProps, GetStaticPaths } from "next";
import { marked } from "marked";
import Image from "next/image";
const postsDirectory = path.join(process.cwd(), "posts");

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(postsDirectory);
  const paths = files.map((fileName) => ({
    params: { slug: fileName.replace(/\.md$/, "") },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const htmlContent = marked(content);

  return {
    props: {
      post: {
        slug,
        ...data,
        content: htmlContent,
      },
    },
  };
};
// @ts-ignore
const PostPage = ({ post }) => {
  const dateParts = post.date.split("-").map((part: any) => parseInt(part, 10));
  const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));

  const monthName = date.toLocaleString("default", {
    month: "long",
    timeZone: "UTC",
  });
  const dayNumber = date.getUTCDate();
  const yearNumber = date.getUTCFullYear();

  const baseYear = 2024;
  let yearText;
  if (yearNumber >= baseYear) {
    const yearDiff = yearNumber - baseYear + 1;
    yearText = `Year ${yearDiff}`;
  } else {
    yearText = yearNumber.toString();
  }

  return (
    <div className={`w-screen h-screen overflow-scroll`}>
      <div className={`p-4 text-base w-[592px]`}>
        <h1>
          {monthName} {dayNumber} &mdash; {yearText}
        </h1>
        <div>{post.title}</div>
        <Image
          className={`mt-8 border-silver border`}
          src={post.image}
          alt={`artwork`}
          width={304}
          height={304}
        />

        <article dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default PostPage;
