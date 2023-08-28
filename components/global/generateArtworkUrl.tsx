const SIZE = "1500";

const GenerateArtworkUrl = (urlTemplate: string, size: string) => {
  return urlTemplate.replace("{w}", size).replace("{h}", size);
};

export default GenerateArtworkUrl;
