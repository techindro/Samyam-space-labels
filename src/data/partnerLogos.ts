import isroLogo from "@/assets/logos/isro.png";
import nasaLogo from "@/assets/logos/nasa.png";
import esaLogo from "@/assets/logos/esa.png";
import spacexLogo from "@/assets/logos/spacex.png";
import boeingLogo from "@/assets/logos/boeing.png";
import lockheedLogo from "@/assets/logos/lockheed.svg";
import northropLogo from "@/assets/logos/northrop.svg";
import blueOriginLogo from "@/assets/logos/blueorigin.svg";
import planetLabsLogo from "@/assets/logos/planetlabs.svg";
import usgsLogo from "@/assets/logos/usgs.png";

export type PartnerInfo = {
  name: string;
  logo: string;
  category?: string;
};

export const officialPartnerLogos: Record<string, string> = {
  ISRO: isroLogo,
  NASA: nasaLogo,
  ESA: esaLogo,
  SpaceX: spacexLogo,
  Boeing: boeingLogo,
  "Lockheed Martin": lockheedLogo,
  "Northrop Grumman": northropLogo,
  "Blue Origin": blueOriginLogo,
  "Planet Labs": planetLabsLogo,
  USGS: usgsLogo,
  DRDO: lockheedLogo,
  "Indian Army": northropLogo,
  "Indian Navy": boeingLogo,
  "Indian Air Force": isroLogo,
  "HQ IDS": usgsLogo,
  "IN-SPACe": spacexLogo,
  NSIL: blueOriginLogo,
  NTRO: planetLabsLogo,
  "R&AW": usgsLogo,
  IB: lockheedLogo,
  DIA: northropLogo,
  NSCS: boeingLogo,
  BSF: northropLogo,
  ITBP: lockheedLogo,
  SSB: usgsLogo,
  "Indian Coast Guard": boeingLogo,
  "Assam Rifles": isroLogo,
  MeitY: isroLogo,
  NIC: usgsLogo,
  "Smart Cities Mission": planetLabsLogo,
  UIDAI: nasaLogo,
  HAL: boeingLogo,
  BEL: lockheedLogo,
  BDL: northropLogo,
  BEML: usgsLogo,
  MDL: isroLogo,
  IndiaAI: isroLogo,
  "C-DAC": nasaLogo,
  "Academic Labs": esaLogo,
  "MoD T&E": lockheedLogo,
  "DRDO Labs": northropLogo,
  "CERT-In": usgsLogo,
  "Standards Bodies": isroLogo,
  "Civil Space Agencies": esaLogo,
  "Coalition MoDs": lockheedLogo,
  "Geospatial Surveys": usgsLogo,
  "Allied Tech Partners": spacexLogo,
};
