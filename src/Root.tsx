import { Composition } from "remotion";
import { ShowcaseIntro } from "./ShowcaseIntro";
import { MufaqarIntro } from "./mufaqar/MufaqarIntro";
import { MufaqarVertical } from "./vertical/MufaqarVertical";
import { V_FPS, V_HEIGHT, V_TOTAL, V_WIDTH } from "./vertical/timeline";
import {
  calculateMetadata as calculateRichestMetadata,
  FPS as RICHEST_FPS,
  HEIGHT as RICHEST_HEIGHT,
  RichestCountries,
  WIDTH as RICHEST_WIDTH,
} from "./countries/RichestCountries";
import {
  calculateMetadata as calculateSteelMetadata,
  FPS as STEEL_FPS,
  HEIGHT as STEEL_HEIGHT,
  SteelProducers,
  WIDTH as STEEL_WIDTH,
} from "./steel/SteelProducers";
import {
  calculateMetadata as calculateBillionairesMetadata,
  FALLBACK_FRAMES as BILLIONAIRE_FRAMES,
  FPS as BILLIONAIRE_FPS,
  HEIGHT as BILLIONAIRE_HEIGHT,
  RichestPeople,
  WIDTH as BILLIONAIRE_WIDTH,
} from "./billionaires/MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RichestPeople"
        component={RichestPeople}
        durationInFrames={1761}
        fps={BILLIONAIRE_FPS}
        width={BILLIONAIRE_WIDTH}
        height={BILLIONAIRE_HEIGHT}
        defaultProps={{ sceneFrames: BILLIONAIRE_FRAMES }}
        calculateMetadata={calculateBillionairesMetadata}
      />
      <Composition
        id="SteelProducers"
        component={SteelProducers}
        durationInFrames={1740}
        fps={STEEL_FPS}
        width={STEEL_WIDTH}
        height={STEEL_HEIGHT}
        defaultProps={{ sceneFrames: [295, 443, 294, 390, 318] }}
        calculateMetadata={calculateSteelMetadata}
      />
      <Composition
        id="RichestCountries"
        component={RichestCountries}
        durationInFrames={2280}
        fps={RICHEST_FPS}
        width={RICHEST_WIDTH}
        height={RICHEST_HEIGHT}
        defaultProps={{ sceneFrames: [356, 465, 535, 597, 327] }}
        calculateMetadata={calculateRichestMetadata}
      />
      <Composition
        id="MufaqarVertical"
        component={MufaqarVertical}
        durationInFrames={V_TOTAL}
        fps={V_FPS}
        width={V_WIDTH}
        height={V_HEIGHT}
        defaultProps={{}}
      />
      <Composition
        id="MufaqarIntro"
        component={MufaqarIntro}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="ShowcaseIntro"
        component={ShowcaseIntro}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
