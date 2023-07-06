export const generateArtworkUrl = (urlTemplate: string) => {
  return urlTemplate.replace("{w}", "2500").replace("{h}", "2500");
};
