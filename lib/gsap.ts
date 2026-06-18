import gsapLib from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

gsapLib.registerPlugin(CustomEase, SplitText);
CustomEase.create("hop", "0.85,0,0.15,1");

export { gsapLib as gsap, CustomEase, SplitText };
