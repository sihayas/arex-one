const SIZE = "1500";

const generateArtworkUrl = (urlTemplate: string, size: string) => {
  return urlTemplate.replace("{w}", size).replace("{h}", size);
};

export default generateArtworkUrl;
