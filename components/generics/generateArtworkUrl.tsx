const SIZE = "1500";

export const generateArtworkUrl = (urlTemplate: string, size: string) => {
  return urlTemplate.replace("{w}", size).replace("{h}", size);
};
