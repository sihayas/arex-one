const SIZE = "1500";

export const generateArtworkUrl = (urlTemplate: string) => {
  return urlTemplate.replace("{w}", SIZE).replace("{h}", SIZE);
};
