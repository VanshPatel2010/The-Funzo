function parseImages(imagesData) {
  if (!imagesData) return [];
  if (Array.isArray(imagesData)) return imagesData;
  if (typeof imagesData === "string") {
    if (imagesData.startsWith("{") && imagesData.endsWith("}")) {
      const inner = imagesData.slice(1, -1);
      if (!inner) return [];
      return inner.split(",").map(s => s.replace(/^"/, "").replace(/"$/, "").trim());
    }
    try {
      const parsed = JSON.parse(imagesData);
      if (Array.isArray(parsed)) return parsed;
    } catch { }
    return [imagesData];
  }
  return [];
}
console.log(parseImages("{https://upload.wikimedia.org/wikipedia/commons/9/96/Orbea_Occam_2020.jpg}"));
console.log(parseImages('["https://upload.wikimedia.org/wikipedia/commons/9/96/Orbea_Occam_2020.jpg"]'));
