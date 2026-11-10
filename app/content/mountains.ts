type SecondaryPeak = {
  x: number;
  y: number;
  height: number;
  widthX: number;
  widthY: number;
};

export type MountainProfile = {
  height: number;
  widthX: number;
  widthY: number;
  peakX: number;
  peakY: number;
  roughness: number;
  ridgeAngle: number;
  skew: number;
  steepness: number;
  secondaryPeaks: SecondaryPeak[];
};

type MountainScene = {
  mountain: string;
  latitude: string;
  longitude: string;
  quote: string;
  credit: string;
  profile: MountainProfile;
};

const realMountainScenes: MountainScene[] = [
  {
    mountain: "MOUNT EVEREST", latitude: "27.9879° N", longitude: "86.9253° E",
    quote: "因为它就在那里。", credit: "乔治·马洛里（英国）",
    profile: { height: 52, widthX: 46, widthY: 58, peakX: 4, peakY: 1, roughness: 6.2, ridgeAngle: .2, skew: .12, steepness: 1.18, secondaryPeaks: [{ x: -25, y: 5, height: 28, widthX: 30, widthY: 42 }, { x: 28, y: 9, height: 22, widthX: 27, widthY: 39 }] },
  },
  {
    mountain: "MOUNT TAI", latitude: "36.2572° N", longitude: "117.1017° E",
    quote: "会当凌绝顶，一览众山小。", credit: "杜甫（中国）",
    profile: { height: 45, widthX: 60, widthY: 60, peakX: -5, peakY: 3, roughness: 8.2, ridgeAngle: -.46, skew: -.2, steepness: 1.04, secondaryPeaks: [{ x: -31, y: -6, height: 24, widthX: 27, widthY: 37 }, { x: 24, y: 12, height: 31, widthX: 31, widthY: 41 }] },
  },
  {
    mountain: "MOUNT FUJI", latitude: "35.3607° N", longitude: "138.7273° E",
    quote: "空山新雨后，天气晚来秋。", credit: "王维（中国）",
    profile: { height: 50, widthX: 64, widthY: 66, peakX: 0, peakY: 0, roughness: 3.4, ridgeAngle: .06, skew: 0, steepness: .94, secondaryPeaks: [] },
  },
  {
    mountain: "MONT BLANC", latitude: "45.8326° N", longitude: "6.8647° E",
    quote: "勃朗峰是群山的君王。", credit: "拜伦（英国）",
    profile: { height: 49, widthX: 53, widthY: 59, peakX: 2, peakY: 0, roughness: 7, ridgeAngle: .34, skew: .18, steepness: 1.08, secondaryPeaks: [{ x: -27, y: 7, height: 32, widthX: 30, widthY: 41 }, { x: 24, y: -2, height: 27, widthX: 28, widthY: 39 }] },
  },
  {
    mountain: "MOUNT TEIDE", latitude: "28.2710° N", longitude: "16.6410° W",
    quote: "在群山之中，你感到自由。", credit: "T. S. 艾略特（英国）",
    profile: { height: 48, widthX: 57, widthY: 62, peakX: 1, peakY: -2, roughness: 4.2, ridgeAngle: -.12, skew: .06, steepness: 1, secondaryPeaks: [{ x: -26, y: 12, height: 17, widthX: 29, widthY: 35 }] },
  },
  {
    mountain: "MOUNT ELBRUS", latitude: "43.3510° N", longitude: "42.4420° E",
    quote: "你可曾平静而无声地登上山峰，立于苍穹之前？", credit: "维克多·雨果（法国）",
    profile: { height: 45, widthX: 42, widthY: 58, peakX: -15, peakY: 1, roughness: 4.5, ridgeAngle: .08, skew: -.08, steepness: 1.02, secondaryPeaks: [{ x: 17, y: 1, height: 44, widthX: 41, widthY: 57 }] },
  },
  {
    mountain: "K2", latitude: "35.8809° N", longitude: "76.5133° E",
    quote: "当人与群山相遇，伟大的事便会发生。", credit: "威廉·布莱克（英国）",
    profile: { height: 52, widthX: 38, widthY: 53, peakX: 3, peakY: 1, roughness: 7.4, ridgeAngle: -.28, skew: .22, steepness: 1.24, secondaryPeaks: [{ x: -22, y: 8, height: 23, widthX: 25, widthY: 36 }] },
  },
  {
    mountain: "MATTERHORN", latitude: "45.9667° N", longitude: "7.6500° E",
    quote: "勃朗峰显现——静止、覆雪而安详。", credit: "雪莱（英国）",
    profile: { height: 51, widthX: 34, widthY: 48, peakX: 7, peakY: -1, roughness: 6.7, ridgeAngle: .52, skew: -.24, steepness: 1.3, secondaryPeaks: [{ x: -20, y: 7, height: 20, widthX: 25, widthY: 34 }] },
  },
  {
    mountain: "MOUNT KILIMANJARO", latitude: "3.0758° S", longitude: "37.3533° E",
    quote: "群山在召唤，我必须前往。", credit: "约翰·缪尔（美国）",
    profile: { height: 44, widthX: 70, widthY: 69, peakX: 0, peakY: 0, roughness: 4.6, ridgeAngle: -.06, skew: .04, steepness: .9, secondaryPeaks: [{ x: -30, y: 9, height: 18, widthX: 28, widthY: 35 }, { x: 29, y: 11, height: 20, widthX: 29, widthY: 36 }] },
  },
  {
    mountain: "DENALI", latitude: "63.0693° N", longitude: "151.0061° W",
    quote: "不识庐山真面目，只缘身在此山中。", credit: "苏轼（中国）",
    profile: { height: 51, widthX: 65, widthY: 72, peakX: -7, peakY: 2, roughness: 5.6, ridgeAngle: .42, skew: .16, steepness: 1.08, secondaryPeaks: [{ x: -33, y: 8, height: 29, widthX: 34, widthY: 44 }, { x: 27, y: 4, height: 23, widthX: 32, widthY: 41 }] },
  },
  {
    mountain: "ACONCAGUA", latitude: "32.6538° S", longitude: "70.0114° W",
    quote: "相看两不厌，只有敬亭山。", credit: "李白（中国）",
    profile: { height: 48, widthX: 58, widthY: 66, peakX: 8, peakY: 2, roughness: 7.8, ridgeAngle: -.36, skew: -.26, steepness: 1.14, secondaryPeaks: [{ x: -25, y: -3, height: 30, widthX: 31, widthY: 42 }, { x: 31, y: 13, height: 19, widthX: 28, widthY: 37 }] },
  },
  {
    mountain: "AORAKI MOUNT COOK", latitude: "43.5951° S", longitude: "170.1421° E",
    quote: "采菊东篱下，悠然见南山。", credit: "陶渊明（中国）",
    profile: { height: 52, widthX: 40, widthY: 55, peakX: -6, peakY: 1, roughness: 7.1, ridgeAngle: .62, skew: .24, steepness: 1.22, secondaryPeaks: [{ x: 20, y: 5, height: 27, widthX: 27, widthY: 38 }] },
  },
];

const originalMountainData = [
  { mountain: "ASTER RIDGE", latitude: "64.2180° N", longitude: "21.6040° W" },
  { mountain: "NORTHLIGHT PEAK", latitude: "71.3460° N", longitude: "112.5080° W" },
  { mountain: "SILENT SUMMIT", latitude: "46.7920° N", longitude: "12.1840° E" },
  { mountain: "OBSIDIAN CROWN", latitude: "18.4310° S", longitude: "144.2770° E" },
  { mountain: "CLOUD VEIL", latitude: "29.6350° N", longitude: "94.2180° E" },
  { mountain: "ECHO SPIRE", latitude: "52.8460° N", longitude: "118.3920° W" },
  { mountain: "ORANGE SADDLE", latitude: "24.5180° S", longitude: "68.1740° W" },
  { mountain: "GLASS NEEDLE", latitude: "38.2670° N", longitude: "71.8330° E" },
  { mountain: "MOONFOLD PEAK", latitude: "62.9140° N", longitude: "148.6020° W" },
  { mountain: "WHITE CURRENT", latitude: "77.1260° S", longitude: "161.4820° E" },
  { mountain: "FAR HORIZON", latitude: "31.7520° S", longitude: "18.6140° E" },
  { mountain: "STONE COMET", latitude: "41.3080° N", longitude: "104.2750° E" },
  { mountain: "NIGHT ARCH", latitude: "56.1930° N", longitude: "4.8270° W" },
  { mountain: "WIND INDEX", latitude: "35.4760° S", longitude: "147.3180° E" },
  { mountain: "POLAR FOLD", latitude: "68.9050° N", longitude: "42.7310° E" },
  { mountain: "SOLSTICE PEAK", latitude: "23.8140° N", longitude: "99.5620° E" },
  { mountain: "HALO RIDGE", latitude: "48.6210° N", longitude: "123.4060° W" },
  { mountain: "VOID SUMMIT", latitude: "11.2870° S", longitude: "37.9140° E" },
  { mountain: "DAWN MONOLITH", latitude: "44.1520° N", longitude: "9.7310° E" },
  { mountain: "SKYLINE PEAK", latitude: "33.7040° N", longitude: "110.2860° W" },
  { mountain: "QUIET VOLCANO", latitude: "6.4280° S", longitude: "128.1530° E" },
  { mountain: "MIRROR RANGE", latitude: "59.3760° N", longitude: "136.8420° W" },
  { mountain: "LAST LIGHT", latitude: "42.8950° S", longitude: "173.6810° E" },
  { mountain: "ALMOST MOUNTAIN", latitude: "27.4160° N", longitude: "92.5380° E" },
];

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

const originalMountainScenes: MountainScene[] = originalMountainData.map((place, index) => {
  const source = realMountainScenes[(index * 5 + 3) % realMountainScenes.length];
  const sourceProfile = source.profile;
  const horizontalShift = ((index % 7) - 3) * 2.1;
  const verticalShift = ((index % 5) - 2) * 1.2;
  const secondaryPeaks = sourceProfile.secondaryPeaks.length > 0
    ? sourceProfile.secondaryPeaks.map((peak, peakIndex) => ({
      ...peak,
      x: clamp(peak.x + horizontalShift * (peakIndex + 1) * .55, -38, 38),
      y: clamp(peak.y + verticalShift * (peakIndex + 1) * .45, -10, 18),
      height: clamp(peak.height + ((index + peakIndex) % 5 - 2) * 2.3, 17, 45),
      widthX: clamp(peak.widthX * (.88 + (index % 4) * .06), 22, 38),
      widthY: clamp(peak.widthY * (.9 + (index % 3) * .07), 31, 48),
    }))
    : index % 3 === 0
      ? [{
        x: index % 2 === 0 ? -25 : 25,
        y: 7 + index % 6,
        height: 18 + index % 10,
        widthX: 24 + index % 7,
        widthY: 33 + index % 8,
      }]
      : [];

  return {
    ...place,
    quote: source.quote,
    credit: source.credit,
    profile: {
      height: clamp(sourceProfile.height + ((index % 6) - 2.5) * 1.25, 44, 52),
      widthX: clamp(sourceProfile.widthX * (.82 + (index % 7) * .05), 32, 72),
      widthY: clamp(sourceProfile.widthY * (.86 + (index % 5) * .055), 45, 74),
      peakX: clamp(sourceProfile.peakX + horizontalShift, -18, 18),
      peakY: clamp(sourceProfile.peakY + verticalShift, -5, 7),
      roughness: clamp(sourceProfile.roughness * (.86 + (index % 6) * .065), 3.8, 9.2),
      ridgeAngle: sourceProfile.ridgeAngle + ((index % 9) - 4) * .11,
      skew: clamp(sourceProfile.skew + ((index % 5) - 2) * .07, -.38, .38),
      steepness: clamp(sourceProfile.steepness + ((index % 5) - 2) * .045, .98, 1.34),
      secondaryPeaks,
    },
  };
});

export const mountainScenes: MountainScene[] = [...realMountainScenes, ...originalMountainScenes];

